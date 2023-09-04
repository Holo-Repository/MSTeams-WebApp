import { INtpTimeInfo } from "@microsoft/live-share";


/**
 * Provide a global time signature for the current time retrieved from worldtimeapi.org
 * @param customFetch - A custom fetch function to use instead of the global fetch
 * @param location - The location to get the time from as specified in the [official API](http://worldtimeapi.org/timezones)
 * @returns - The current time in UTC and ISO format
 */
export default async function globalTime(customFetch: typeof global.fetch = global.fetch, location: string = "Europe/London"): Promise<INtpTimeInfo> {
    // Fetch the time from the worldtimeapi.org API
    const res = await customFetch('https://worldtimeapi.org/api/timezone/'+location, {
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