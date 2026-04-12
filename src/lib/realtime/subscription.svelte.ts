import type { SupabaseClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/database.types';

const RETRY_DELAYS = [1000, 2000, 5000, 10000];
const MAX_RETRIES = RETRY_DELAYS.length;

type SubscriptionStatus = 'connecting' | 'connected' | 'error' | 'closed';

type SubscriptionCallbacks<T extends Record<string, unknown>> = {
	onData: (payload: RealtimePostgresChangesPayload<T>) => void;
	onError?: (error: Error) => void;
	onStatusChange?: (status: SubscriptionStatus) => void;
};

type SubscriptionConfig = {
	table: string;
	filter?: {
		column: string;
		value: string;
	};
	event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
};

export function createRealtimeSubscription<T extends Record<string, unknown>>(
	supabase: SupabaseClient<Database>,
	config: SubscriptionConfig,
	callbacks: SubscriptionCallbacks<T>
) {
	let channel: ReturnType<typeof supabase.channel> | null = null;
	let retryCount = 0;
	let retryTimeout: ReturnType<typeof setTimeout> | null = null;
	let isActive = true;
	let currentStatus: SubscriptionStatus = 'connecting';

	function setStatus(status: SubscriptionStatus) {
		currentStatus = status;
		callbacks.onStatusChange?.(status);
	}

	function subscribe() {
		if (!isActive) return;

		setStatus('connecting');

		const channelName = `realtime:${config.table}:${config.filter?.column ?? 'all'}:${config.filter?.value ?? 'all'}`;

		channel = supabase
			.channel(channelName)
			.on(
				'postgres_changes' as const,
				{
					event: config.event ?? '*',
					schema: 'public',
					table: config.table,
					filter: config.filter ? `${config.filter.column}=eq.${config.filter.value}` : undefined
				},
				(payload: RealtimePostgresChangesPayload<T>) => {
					retryCount = 0;
					callbacks.onData(payload);
				}
			)
			.subscribe((status, err) => {
				if (!isActive) return;

				if (status === 'SUBSCRIBED') {
					retryCount = 0;
					setStatus('connected');
				} else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
					setStatus('error');
					callbacks.onError?.(err ?? new Error(`Subscription ${status.toLowerCase()}`));
					scheduleRetry();
				} else if (status === 'CLOSED') {
					setStatus('closed');
					if (isActive) {
						scheduleRetry();
					}
				}
			});
	}

	function scheduleRetry() {
		if (!isActive || retryCount >= MAX_RETRIES) {
			return;
		}

		const delay = RETRY_DELAYS[retryCount];
		retryCount++;

		retryTimeout = setTimeout(() => {
			retryTimeout = null;
			unsubscribe();
			subscribe();
		}, delay);
	}

	function unsubscribe() {
		if (retryTimeout) {
			clearTimeout(retryTimeout);
			retryTimeout = null;
		}

		if (channel) {
			supabase.removeChannel(channel);
			channel = null;
		}
	}

	function destroy() {
		isActive = false;
		unsubscribe();
	}

	function retry() {
		retryCount = 0;
		unsubscribe();
		subscribe();
	}

	function getStatus() {
		return currentStatus;
	}

	subscribe();

	return {
		destroy,
		retry,
		getStatus,
		unsubscribe
	};
}

export function watchAuthState(
	supabase: SupabaseClient<Database>,
	onAuthChange: (event: string, session: unknown) => void
) {
	const { data } = supabase.auth.onAuthStateChange(onAuthChange);
	return data.subscription;
}
