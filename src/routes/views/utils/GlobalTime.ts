import { INtpTimeInfo } from "@microsoft/live-share";


export default async function globalTime(customFetch: typeof global.fetch = global.fetch): Promise<INtpTimeInfo> {
    // Fetch the time from the worldtimeapi.org API
    const res = await customFetch('https://worldtimeapi.org/api/timezone/Europe/London', {
        cache: 'no-cache'
    });
    if (!res.ok) throw raiseGlobalError(new Error(`Failed to fetch time from worldtimeapi.org: ${res.status} ${res.statusText}`));

    try {
        const time = await res.json();

        return {
            ntpTime: time.datetime,
            ntpTimeInUTC: time.unixtime
        } as INtpTimeInfo;
    } catch (e: any) { throw raiseGlobalError(e); }
}