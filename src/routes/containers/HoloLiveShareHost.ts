import { AzureLiveShareHost, INtpTimeInfo } from "@microsoft/live-share";

/**
 * This class is just a factory for creating a LiveShareHost instance
 * and overriding the getNtpTime method to use the server timestamp
 */
class HoloLiveShareHost {
    private constructor() {}

    public static create(): AzureLiveShareHost {
        const lsh = AzureLiveShareHost.create() as AzureLiveShareHost;

        async function getNtpTime(): Promise<INtpTimeInfo> {
            const now = new Date();
            return Promise.resolve({
                ntpTime: now.toUTCString(),
                ntpTimeInUTC: now.getTime(),
            });
        }

        // Override the getNtpTime method to use the server timestamp
        lsh.getNtpTime = getNtpTime.bind(lsh);
        return lsh;
    }
}

export default HoloLiveShareHost;