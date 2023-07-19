import * as jose from 'jose'

class FetchJWT {
    private readonly fetchRetry: typeof global.fetch;

    constructor(
        private readonly retries: number = 5, 
        private readonly retryDelay: number = 1000 * 1) 
    {
        this.fetchRetry = require('fetch-retry')(global.fetch, { retries, retryDelay }) as typeof global.fetch;
    }

    private expired(token: string): boolean {
        // Check if the token is expired or not
        const decoded = jose.decodeJwt(token) as jose.JWTPayload;
        const now = Math.floor(Date.now() / 1000);
        const exp = decoded.exp as number;
        return now >= exp;
    }

    async fetch(url: string, options?: RequestInit, useCache: boolean = true): Promise<Response> {
        let response: Response | undefined = undefined;
        let cache = useCache ? await caches.open('v1') : undefined;
        
        // Attempt to get the token from the cache
        if (useCache) {
            const cachedRes = await cache!.match(url);
            let token = cachedRes && await cachedRes.text();
            // If the token is not expired, return it
            if (token && !this.expired(token))
                // Return the cached token in a response object because we already consumed the body
                return new Response(token, { status: 200 });
            // Otherwise, fetch and update the cache
        }
        
        // Fetch the token with retries
        response = await this.fetchRetry(url, options);
        
        // If the token is valid, update the cache
        if (response.ok) cache!.put(url, response.clone());

        return response;
    }
}

export default FetchJWT;