import { epsilonSign } from "@/helpers/MathUtils";

describe("MathUtils", () => {
    describe("epsilonSign", () => {
        it("should return a correct sign for positive value", () => {
            expect(epsilonSign(3)).toBe(1);
        });

        it("should return a correct sign for negative value", () => {
            expect(epsilonSign(-3)).toBe(-1);
        });

        it("should handle zero", () => {
            expect(epsilonSign(0)).toBe(1);
        });

        it("should handle negative zero", () => {
            expect(epsilonSign(-0)).toBe(1);
        });
    });
});
