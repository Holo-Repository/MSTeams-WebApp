import { INtpTimeInfo } from "@microsoft/live-share";


export default async function globalTime(customFetch: typeof global.fetch = global.fetch): Promise<INtpTimeInfo> {
    // Fetch the time from the worldtimeapi.org API
    const time = await (await customFetch('https://worldtimeapi.org/api/timezone/Europe/London', {
        cache: 'no-cache'
    })).json();
    return {
        ntpTime: time.datetime,
        ntpTimeInUTC: time.unixtime
    } as INtpTimeInfo;
}