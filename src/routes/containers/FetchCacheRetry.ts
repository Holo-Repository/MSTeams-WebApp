import FetchCache, { CachedValue, IMinimalResponse } from '@sozialhelden/fetch-cache';


class FetchCacheRetry {
    private readonly fetchCacheRetry: FetchCache<{}, IMinimalResponse, typeof global.fetch>;

    constructor(
        private readonly retries: number = 5, 
        private readonly retryDelay: number = 1000 * 1) 
    {
        const fetchRetry = require('fetch-retry')(global.fetch, { retries, retryDelay }) as typeof global.fetch;

        this.fetchCacheRetry = new FetchCache({
            fetch: fetchRetry,
            cacheOptions: { maximalItemCount: 100, evictExceedingItemsBy: 'lru' },
            ttl: this.ttl.bind(this),
        });
    }

    private ttl(cachedValue: CachedValue<IMinimalResponse>) {
        switch (cachedValue.state) {
            case 'running':
                // Evict running promises after 30s if they are not resolved to allow re-requesting.
                // This leaves it up to the fetch implementation to clean up resources if requests are not
                // aborted and the same URL is requested multiple times.
                return 30000;

            case 'resolved':
                const { response } = cachedValue;
                // Keep successful or 'resource missing' responses in the cache for 1 minute
                if (response && (response.status === 200 || response.status === 404)) {
                    return 1 * 60 * 1000;
                }
                // Allow retrying all other responses after retryDelay
                return this.retryDelay;

            case 'rejected':
                const { error } = cachedValue;
                if (typeof error.name !== 'undefined' && error.name === 'AbortError') {
                    return 0;
                }
                // Allow reattempting failed requests after retryDelay
                return this.retryDelay;
        }
    }

    async fetch(url: string, options?: RequestInit): Promise<Response> {
        return this.fetchCacheRetry.fetch(url, options);
    }
}

export default FetchCacheRetry;