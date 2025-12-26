import Dexie, { Table } from 'dexie';
import { Comprobante } from '../../types';

/**
 * ToroGroup Database Schema
 * Uses IndexedDB for unlimited storage capacity
 */
export class ToroGroupDB extends Dexie {
    // Tables
    transactions!: Table<Comprobante, string>;
    cache!: Table<CacheEntry, string>;

    constructor() {
        super('ToroGroupDB');

        // Define schema version 1
        this.version(1).stores({
            transactions: 'id, fecha, monto, referencia, timestamp, status',
            cache: 'hash, timestamp'
        });
    }
}

/**
 * Cache entry structure for receipt analysis results
 */
export interface CacheEntry {
    hash: string;
    data: Partial<Comprobante>;
    timestamp: number;
}

// Singleton instance
export const db = new ToroGroupDB();
