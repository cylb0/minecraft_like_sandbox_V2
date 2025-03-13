/**
 * Used for generating a predefined series of pseudo-random numbers.
 */
class PseudoRandomGenerator {
    static readonly MULTIPLIER = 9301;
    static readonly INCREMENT = 49297;
    static readonly MODULUS = 233280;

    /** The current seed value used by the pseudo-random generator. */
    #seed: number;

    /**
     * Creates a new pseudo-random number generator with the given initial seed.
     * @param seed - The initial seed value.
     */
    constructor(seed: number) {
        this.#seed = seed;
    }

    /**
     * Generates pseudo-random number between 0 and 1.
     * - Each subsequent call of this method returns a predefined result based on the last call.
     * @returns A pseudo random number.
     */
    public random(): number {
        this.#seed = (this.#seed * PseudoRandomGenerator.MULTIPLIER + PseudoRandomGenerator.INCREMENT) % PseudoRandomGenerator.MODULUS;
        return this.#seed / PseudoRandomGenerator.MODULUS;
    }
}

export default PseudoRandomGenerator;

