import { AzureMember } from "@fluidframework/azure-client";
import { ITokenProvider, ITokenResponse } from "@fluidframework/routerlicious-driver";

import FetchJWT from "./FetchJWT";


/**
 * Handle the retrieval of the JWT needed to authenticate with the Azure Fluid Relay.
 * A basic implementation of the ITokenProvider interface.
 */
class FluidTokenProvider implements ITokenProvider {
    private readonly fetchJWT: FetchJWT;

    constructor(
        private readonly tokenFunURL: string,
        private readonly user?: Pick<AzureMember, "userId" | "userName" | "additionalDetails">,
    ) {
        this.fetchJWT = new FetchJWT();
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

        // Construct the request URL
        const reqQuery = Object.entries(reqQueryParams)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");
        const reqURL = `${this.tokenFunURL}?${reqQuery}`;

        // Fetch the token
        const res = await this.fetchJWT.fetch(reqURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error(`Error fetching token: ${res.status} ${res.statusText}`);
        return { jwt: await res.text() };
    }
}

export default FluidTokenProvider;