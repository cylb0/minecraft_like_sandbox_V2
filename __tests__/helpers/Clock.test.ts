import Clock, { DayDurationTooLongError, DayDurationTooShortError } from "@/helpers/Clock";

describe("Clock", () => {
    let clock: Clock;
    let dateMock: Date;
    let dateSpy: jest.SpyInstance | undefined;

    beforeAll(() => {
        dateMock = new Date(2025, 3, 17, 14, 31, 30);
    });

    afterEach(() => {
        if (dateSpy) dateSpy.mockRestore();
    });

    it("should create a day with correct dayInSecondsDuration", () => {
        clock = new Clock(60);

        expect(clock).toBeDefined();
        expect(clock.dayDurationInSeconds).toBe(60);
    });

    it("should throw DayDurationTooShortError if dayInSecondsDuration is is too low", () => {
        expect(() => {
            clock = new Clock(-10);
        }).toThrow(DayDurationTooShortError);
    });

    it("should throw DayDurationTooShortError if dayInSecondsDuration is too high", () => {
        expect(() => {
            clock = new Clock(100000);
        }).toThrow(DayDurationTooLongError);
    });

    describe("getRealWorldTimeInSeconds", () => {
        beforeAll(() => {
            clock = new Clock(60);
        });

        it("should compute real-world time in seconds", () => {
            jest.spyOn(global.Date, "now").mockReturnValue(dateMock.getTime());

            const expectedSeconds = ((14 * 3600) + (31 * 60) + 30);
            const result = clock.getRealWorldTimeInSeconds();

            expect(result).toBe(expectedSeconds);
        });

        it("should handle midnight", () => {
            const midnightMock = new Date(2025, 3, 17, 0, 0, 0);
            jest.spyOn(global.Date, "now").mockReturnValue(midnightMock.getTime());

            const expectedSeconds = 0;
            const result = clock.getRealWorldTimeInSeconds();

            expect(result).toBe(expectedSeconds);
        });
    });

    describe("getInGameTimeInHours", () => {
        it("should compute in-game time correctly", () => {
            jest.spyOn(global.Date, "now").mockReturnValue(dateMock.getTime());
            const realWorldSeconds = (14 * 3600) + (31 * 60) + 30;
            const inGameTime = (realWorldSeconds % 60) / 60 * 24;

            const result = clock.getInGameTimeInHours();
            
            expect(result).toBe(inGameTime);
        });

        it("should handle midnight", () => {
            const midnightMock = new Date(2025, 3, 17, 0, 0, 0);
            jest.spyOn(global.Date, "now").mockReturnValue(midnightMock.getTime());
            const realWorldSeconds = 0;
            const inGameTime = (realWorldSeconds % 60) / 60 * 24;

            const result = clock.getInGameTimeInHours();

            expect(result).toBe(inGameTime);
        });
    });
});
