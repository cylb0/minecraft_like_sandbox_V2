export class InvalidDayDurationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidDayDurationError";
    }
}

export class DayDurationTooShortError extends InvalidDayDurationError {
    constructor(dayDuration: number) {
        super(`Day duration must be greater than ${Clock.MIN_DAY_DURATION} seconds. Received ${dayDuration}.`)
    }
}

export class DayDurationTooLongError extends InvalidDayDurationError {
    constructor(dayDuration: number) {
        super(`Day duration must be lower than ${Clock.MAX_DAY_DURATION} seconds. Received ${dayDuration}.`)
    }
}

/**
 * Clock class designed to act as an interface between real-time and in-game-time.
 */
class Clock {
    dayDurationInSeconds: number;
    static readonly MIN_DAY_DURATION = 10;
    static readonly MAX_DAY_DURATION = 86400;

    /**
     * Creates a new entity. Control param value as a day cannot exceed 24h in real life.
     * @param dayDurationInSeconds 
     */
    constructor(dayDurationInSeconds: number) {
        if (dayDurationInSeconds <= Clock.MIN_DAY_DURATION) {
            throw new DayDurationTooShortError(dayDurationInSeconds);
        }
        if (dayDurationInSeconds > Clock.MAX_DAY_DURATION) {
            throw new DayDurationTooLongError(dayDurationInSeconds);
        }
        this.dayDurationInSeconds = Math.min(dayDurationInSeconds, 86400);
    };

    /**
     * Computes the current time of the day in seconds using `Date.now()`.
     * @returns The time in seconds.
     */
    getRealWorldTimeInSeconds(): number {
        const currentTime = new Date(Date.now());
        return (currentTime.getHours() * 3600) + (currentTime.getMinutes() * 60) + currentTime.getSeconds();
    };

    /**
     * Converts a real-world time in seconds to in-game time (hours) scaled to a 0-24h range.
     * 
     * - Wraps time around `dayDurationInSeconds` to simulate daytime rotation.
     */
    getInGameTimeInHours(): number {
        let currentTimeInSeconds = this.getRealWorldTimeInSeconds()
        return ((currentTimeInSeconds %= this.dayDurationInSeconds) / this.dayDurationInSeconds) * 24;
    };
}

export default Clock;
