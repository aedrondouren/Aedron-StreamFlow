import { createBatcher } from '$lib/realtime/batcher.svelte';
import { mergeChanges } from '$lib/realtime/merge';
import { createRealtimeSubscription, watchAuthState } from '$lib/realtime/subscription.svelte';
import type { Database, Tables } from '$lib/supabase/database.types';
import type { RealtimePostgresChangesPayload, SupabaseClient } from '@supabase/supabase-js';

type TableName = keyof Database['public']['Tables'];

type ReactiveTableState<T> = {
	data: T[];
	loading: boolean;
	error: Error | null;
	status: 'idle' | 'loading' | 'connected' | 'error';
};

type ReactiveTableOptions<T extends TableName> = {
	table: T;
	filter?: {
		column: string;
		value: string;
	};
	initialData?: Tables<T>[];
	keyField?: keyof Tables<T>;
};

export function createReactiveTable<T extends TableName>(
	supabase: SupabaseClient<Database>,
	options: ReactiveTableOptions<T>
) {
	const { table, filter, initialData = [], keyField = 'id' as keyof Tables<T> } = options;

	let subscription: ReturnType<typeof createRealtimeSubscription> | null = null;
	let authSubscription: ReturnType<typeof watchAuthState> | null = null;
	let batcher: ReturnType<typeof createBatcher<Tables<T>>> | null = null;

	const state: ReactiveTableState<Tables<T>> = $state({
		data: initialData,
		loading: initialData.length === 0,
		error: null,
		status: 'idle'
	});

	function handleBatch(changes: { payload: RealtimePostgresChangesPayload<Tables<T>> }[]) {
		const payloads = changes.map((c) => c.payload);
		state.data = mergeChanges(state.data, payloads, keyField);
	}

	function start() {
		if (subscription) return;

		state.loading = true;
		state.status = 'loading';
		state.error = null;

		batcher = createBatcher<Tables<T>>(handleBatch);

		subscription = createRealtimeSubscription<Tables<T>>(
			supabase,
			{
				table: table as string,
				filter,
				event: '*'
			},
			{
				onData: (payload) => {
					batcher?.add(payload);
				},
				onError: (error) => {
					state.error = error;
					state.status = 'error';
				},
				onStatusChange: (status) => {
					if (status === 'connected') {
						state.status = 'connected';
						state.loading = false;
					} else if (status === 'error') {
						state.status = 'error';
					}
				}
			}
		);

		authSubscription = watchAuthState(supabase, (event) => {
			if (event === 'SIGNED_OUT') {
				stop();
				state.data = [];
				state.status = 'idle';
			} else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
				if (state.status === 'error' || state.status === 'idle') {
					retry();
				}
			}
		});
	}

	function stop() {
		batcher?.destroy();
		batcher = null;

		subscription?.destroy();
		subscription = null;

		authSubscription?.unsubscribe();
		authSubscription = null;

		state.status = 'idle';
	}

	function retry() {
		stop();
		start();
	}

	function refresh() {
		retry();
	}

	function updateData(newData: Tables<T>[]) {
		state.data = newData;
	}

	return {
		start,
		get data() {
			return state.data;
		},
		get loading() {
			return state.loading;
		},
		get error() {
			return state.error;
		},
		get status() {
			return state.status;
		},
		stop,
		retry,
		refresh,
		updateData
	};
}
