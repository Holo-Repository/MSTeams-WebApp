import { AzureLiveShareHost, INtpTimeInfo } from "@microsoft/live-share";

/**
 * This class is just a factory for creating a LiveShareHost instance
 * and overriding the getNtpTime method to use the server timestamp
 */
class HoloLiveShareHost {
    private constructor() {}

    public static create(retries: number = 3, retryDelay: number = 1 * 1000): AzureLiveShareHost {
        const lsh = AzureLiveShareHost.create() as AzureLiveShareHost;

        const fetchRetry = require('fetch-retry')(global.fetch, { retries, retryDelay }) as typeof global.fetch;

        async function getNtpTime(): Promise<INtpTimeInfo> {
            // Fetch the time from the worldtimeapi.org API
            const time = await (await fetchRetry('https://worldtimeapi.org/api/timezone/Europe/London', {
                cache: 'no-cache'
            })).json();
            return {
                ntpTime: time.datetime,
                ntpTimeInUTC: time.unixtime
            } as INtpTimeInfo;
        }

        // Override the getNtpTime method to use the server timestamp
        lsh.getNtpTime = getNtpTime.bind(lsh);
        return lsh;
    }
}

export default HoloLiveShareHost;