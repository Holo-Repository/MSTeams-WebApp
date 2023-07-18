import { AzureMember } from "@fluidframework/azure-client";
import { ITokenProvider, ITokenResponse } from "@fluidframework/routerlicious-driver";

import FetchCacheRetry from "./FetchCacheRetry";


class FluidTokenProvider implements ITokenProvider {
    private readonly fetchCacheRetry: FetchCacheRetry;

    constructor(
        private readonly tokenFunURL: string,
        private readonly user?: Pick<AzureMember, "userId" | "userName" | "additionalDetails">,
    ) {
        this.fetchCacheRetry = new FetchCacheRetry();
    }

    /**
     * Fetches the orderer token from host.
     * @param tenantId - Tenant ID.
     * @param documentId - Optional. Document ID is only required for document-scoped requests.
     * @param refresh - Optional flag indicating whether token fetch must bypass local cache.
     * @returns TokenResponse object representing token value along with flag indicating
     * whether token came from cache.
     */
    async fetchOrdererToken(tenantId: string, documentId?: string, refresh?: boolean): Promise<ITokenResponse> {
        return await this.fetchToken(tenantId, documentId, refresh);
    }

    /**
     * Fetches the storage token from host.
     * @param tenantId - Tenant ID.
     * @param documentId - Document ID.
     * @param refresh - Optional flag indicating whether token fetch must bypass local cache.
     * @returns TokenResponse object representing token value along with flag indicating
     * whether token came from cache.
     */
    async fetchStorageToken(tenantId: string, documentId: string, refresh?: boolean): Promise<ITokenResponse> {
        return await this.fetchToken(tenantId, documentId, refresh);
    }

    /**
     * Fetches the token from host.
     * @param tenantId - Tenant ID.
     * @param documentId - Optional. Document ID is only required for document-scoped requests.
     * @param refresh - Optional flag indicating whether token fetch must bypass local cache.
     * @returns TokenResponse object representing token value along with flag indicating
     */
    private async fetchToken(tenantId: string, documentId?: string, refresh?: boolean): Promise<ITokenResponse> {
        const reqQueryParams = {
            tenantId,
            documentId,
            userId: this.user?.userId,
            userName: this.user?.userName,
            additionalDetails: this.user?.additionalDetails,
        };

        const reqQuery = Object.entries(reqQueryParams)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");

        const reqURL = `${this.tokenFunURL}?${reqQuery}`;
        const res = await this.fetchCacheRetry.fetch(reqURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error(`Error fetching token: ${res.status} ${res.statusText}`);

        return { jwt: await res.json() };
    }
}

export default FluidTokenProvider;