import type { SupabaseClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database, Tables } from '$lib/supabase/database.types';
import { createBatcher } from '$lib/realtime/batcher.svelte';
import { createRealtimeSubscription, watchAuthState } from '$lib/realtime/subscription.svelte';

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

function mergeChanges<T extends Record<string, unknown>>(
	current: T[],
	changes: RealtimePostgresChangesPayload<T>[],
	keyField: keyof T
): T[] {
	let result = [...current];

	for (const change of changes) {
		const { eventType, new: newRecord, old: oldRecord } = change;

		switch (eventType) {
			case 'INSERT':
				if (newRecord && !result.some((item) => item[keyField] === newRecord[keyField])) {
					result = [...result, newRecord];
				}
				break;

			case 'UPDATE':
				if (newRecord) {
					result = result.map((item) =>
						item[keyField] === newRecord[keyField] ? { ...item, ...newRecord } : item
					);
				}
				break;

			case 'DELETE':
				if (oldRecord) {
					result = result.filter((item) => item[keyField] !== oldRecord[keyField]);
				}
				break;
		}
	}

	return result;
}

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
