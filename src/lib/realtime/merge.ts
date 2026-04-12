import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Efficiently merge realtime changes into current data using Map for O(n) performance.
 * Replaces the O(n²) array-based approach with O(n) Map operations.
 */
export function mergeChanges<T extends Record<string, unknown>>(
	current: T[],
	changes: RealtimePostgresChangesPayload<T>[],
	keyField: keyof T
): T[] {
	// Build map from current data for O(1) lookups
	const resultMap = new Map<T[keyof T], T>();

	for (const item of current) {
		resultMap.set(item[keyField], item);
	}

	for (const change of changes) {
		const { eventType, new: newRecord, old: oldRecord } = change;

		switch (eventType) {
			case 'INSERT':
				if (newRecord && !resultMap.has(newRecord[keyField])) {
					resultMap.set(newRecord[keyField], newRecord);
				}
				break;

			case 'UPDATE':
				if (newRecord) {
					resultMap.set(newRecord[keyField], newRecord);
				}
				break;

			case 'DELETE':
				if (oldRecord && oldRecord[keyField] !== undefined) {
					resultMap.delete(oldRecord[keyField]);
				}
				break;
		}
	}

	return Array.from(resultMap.values());
}
