import { db, CacheEntry } from './schema';
import { Comprobante } from '../../types';

/**
 * Cache Repository for storing receipt analysis results
 * Prevents redundant API calls for identical images
 */
export class CacheRepository {

    /**
     * Generate SHA-256 hash of image data
     * Uses first 1000 characters for performance
     */
    private async generateHash(base64: string): Promise<string> {
        const sample = base64.substring(0, 1000);
        const msgUint8 = new TextEncoder().encode(sample);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Get cached analysis result by image hash
     */
    async get(base64Image: string): Promise<Partial<Comprobante> | null> {
        const hash = await this.generateHash(base64Image);
        const entry = await db.cache.get(hash);

        if (!entry) return null;

        // Check if cache is still valid (24 hours)
        const isExpired = Date.now() - entry.timestamp > (24 * 60 * 60 * 1000);
        if (isExpired) {
            await db.cache.delete(hash);
            return null;
        }

        return entry.data;
    }

    /**
     * Store analysis result in cache
     */
    async set(base64Image: string, data: Partial<Comprobante>): Promise<void> {
        const hash = await this.generateHash(base64Image);
        const entry: CacheEntry = {
            hash,
            data,
            timestamp: Date.now()
        };

        await db.cache.put(entry);
    }

    /**
     * Clear all cached entries
     */
    async clear(): Promise<void> {
        await db.cache.clear();
    }

    /**
     * Remove expired cache entries (older than 24 hours)
     */
    async cleanExpired(): Promise<number> {
        const expirationTime = Date.now() - (24 * 60 * 60 * 1000);
        const expiredEntries = await db.cache
            .where('timestamp')
            .below(expirationTime)
            .toArray();

        await db.cache.bulkDelete(expiredEntries.map(e => e.hash));
        return expiredEntries.length;
    }
}

// Singleton instance
export const cacheRepository = new CacheRepository();
