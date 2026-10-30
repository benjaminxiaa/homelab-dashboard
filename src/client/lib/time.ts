const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const JUST_NOW_SECONDS = 5;

export function formatTimeAgo(checkTime: number, current: number): string {
    const seconds = Math.max(0, Math.floor((current - checkTime) / MS_PER_SECOND));
    if (seconds < JUST_NOW_SECONDS) {
        return "just now";
    }
    if (seconds < SECONDS_PER_MINUTE) {
        return `${seconds}s ago`;
    }

    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    if (minutes < MINUTES_PER_HOUR) {
        return `${minutes}m ago`;
    }

    return `${Math.floor(minutes / MINUTES_PER_HOUR)}h ago`;
}
