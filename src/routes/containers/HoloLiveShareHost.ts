import { AzureLiveShareHost, INtpTimeInfo } from "@microsoft/live-share";
import globalTime from "../views/utils/GlobalTime";

/**
 * This class is just a factory for creating a LiveShareHost instance
 * and overriding the getNtpTime method to use the server timestamp
 */
class HoloLiveShareHost {
    private constructor() {}

    public static create(retries: number = 3, retryDelay: number = 1 * 1000): AzureLiveShareHost {
        const lsh = AzureLiveShareHost.create();

        const fetchRetry = require('fetch-retry')(global.fetch, { retries, retryDelay }) as typeof global.fetch;

        function getNtpTime(): Promise<INtpTimeInfo> { return globalTime(fetchRetry) }

        // Override the getNtpTime method to use the server timestamp
        lsh.getNtpTime = getNtpTime.bind(lsh);
        return lsh;
    }
}

export default HoloLiveShareHost;