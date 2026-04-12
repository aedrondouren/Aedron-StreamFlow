import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type BatchedChange<T extends Record<string, unknown>> = {
	payload: RealtimePostgresChangesPayload<T>;
	timestamp: number;
};

type BatchFlushCallback<T extends Record<string, unknown>> = (changes: BatchedChange<T>[]) => void;

const BATCH_WINDOW_MS = 50;
const MAX_QUEUE_SIZE = 100;

export function createBatcher<T extends Record<string, unknown>>(
	flushCallback: BatchFlushCallback<T>
) {
	let queue: BatchedChange<T>[] = [];
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let rafId: number | null = null;

	function flush() {
		if (queue.length === 0) return;

		const changes = [...queue];
		queue = [];

		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}

		flushCallback(changes);
	}

	function scheduleFlush() {
		if (timeoutId) return;

		timeoutId = setTimeout(() => {
			timeoutId = null;
			flush();
		}, BATCH_WINDOW_MS);

		rafId = requestAnimationFrame(() => {
			rafId = null;
			flush();
		});
	}

	function add(payload: RealtimePostgresChangesPayload<T>) {
		queue.push({
			payload,
			timestamp: Date.now()
		});

		if (queue.length >= MAX_QUEUE_SIZE) {
			flush();
		} else {
			scheduleFlush();
		}
	}

	function destroy() {
		if (timeoutId) clearTimeout(timeoutId);
		if (rafId) cancelAnimationFrame(rafId);
		flush();
	}

	return {
		add,
		flush,
		destroy
	};
}
