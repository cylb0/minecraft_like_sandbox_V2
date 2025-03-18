import Clock from "@/helpers/Clock";
import { computeOrbitPosition, computeVariationProgress } from "@/helpers/MathUtils";
import { DayNightLightConfig, LightVariation } from "@/types/Config";
import { CameraHelper, Color, DirectionalLight, MathUtils, Vector3 } from "three";

/**
 * Creates a dynamic DirectionaLight that can be used to simulate astral lighting.
 */
class DayNightLight extends DirectionalLight {
    #angle!: number;
    center: Vector3;
    #clock: Clock;
    #config: DayNightLightConfig;
    shadowHelper: CameraHelper | null = null;

    /**
     * Creates a new DaynNightLight instance.
     * 
     * - Initialize its angle based on current time ➜ in game time and compute its position.
     * - Toggles shadowing.
     * - Displays shadow camera helper if necessary.
     * 
     * @param config - Configuration object.
     * @param center - The point around which the light source orbits.
     * @param helper - Wether or not to display CameraHelper for shadow visualization. 
     */
    constructor(
        clock: Clock,
        config: DayNightLightConfig,
        center: Vector3,
        helper: boolean
    ) {
        super(config.defaultColor, config.defaultIntensity);
        this.#clock = clock;
        this.#config = config;
        this.center = center;

        this.update();

        this.#initShadows();
        
        if (helper) {
            this.shadowHelper = new CameraHelper(this.shadow.camera);
            this.add(this.shadowHelper);
        }
    }

    /**
     * Updates the light source.
     *
     * - Computes the new angle based on the time of day.
     * - Updates the light's position.
     */
    update() {
        const inGameTime = this.#clock.getInGameTimeInHours();
        this.#updateAngle(inGameTime);

        this.#updatePosition();
        this.#updateColorAndIntensity(inGameTime);
    }

    /**
     * Computes a new angle for the light.
     *
     * - Retrieves the time of day in seconds.
     * - Leverages config's `dayDuration` to determine in game daytime.
     * - Transform the time in an angle (min = 0, max = 2PI).
     *
     * @param inGameTime - The in-game time used to compute angle.
     */
    #updateAngle(inGameTime: number): void {
        let angle = (inGameTime / 24) * Math.PI * 2 - (Math.PI / 2);
        angle = (angle % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
        this.#angle = angle;
    }

    /**
     * Updates the position of the light source based on it's current angle, radius and rotation center.
     */
    #updatePosition(): void {
        this.position.copy(computeOrbitPosition(this.center, this.#config.radius, this.#angle));

        this.shadow.camera.position.copy(this.position);
        this.shadow.camera.updateProjectionMatrix();
        this.shadow.camera.updateMatrixWorld();
    }

    /**
     * Computes both color and intensity of the light based on config and current in-game time.
     * 
     * - Gets both previous and next `LightVariation` from config object if they exist.
     * - Interpolates color and intensity based on progress between two variations.
     * 
     * @param inGameTime - The in-game time used to compute color and intensity.
     */
    #updateColorAndIntensity(inGameTime: number): void {
        const variations = this.#getLightingVariations(inGameTime);
        if (!Object.keys(variations).length) return;

        const { previous, next } = variations as {
            previous: { time: number, variation: LightVariation },
            next: { time: number, variation: LightVariation },
        };

        let progress = computeVariationProgress(inGameTime, previous.time, next.time);

        const color = new Color().lerpColors(
            new Color(previous.variation.color),
            new Color(next.variation.color),
            progress
        );
        this.color.set(color);

        const intensity = MathUtils.lerp(previous.variation.intensity, next.variation.intensity, progress);
        this.intensity = intensity;
    }

    /**
     * Retrieves both previous and next recorded variations for lighting if they exist.
     * 
     * @param time - The in-game time to retrieve variations of. 
     * @returns An object containing both previous and next variations or an empty object if less than 2 record exist.
     */
    #getLightingVariations(time: number): {
        previous: {
            time: number,
            variation: LightVariation,
        },
        next: {
            time: number,
            variation: LightVariation,
        }
    } | {} {
        const keys = Array.from(this.#config.variations.keys()).sort((a, b) => a - b);

        if (keys.length <= 1) return {};

        let previousKey: number | undefined;
        let nextKey: number | undefined;

        for (const key of keys) {
            if (key <= time) {
                previousKey = key;
            } else {
                nextKey = key;
                break;
            }
        }

        if (nextKey === undefined) {
            nextKey = keys[0];
        }

        if (previousKey === undefined) {
            previousKey = keys[keys.length - 1];
        }

        const previousVariation = this.#config.variations.get(previousKey)!;
        const nextVariation = this.#config.variations.get(nextKey)!;

        return { 
            previous: {
                time: previousKey,
                variation: previousVariation,
            }, next: {
                time: nextKey,
                variation: nextVariation,
            }
        };
    }

    /**
     * Configures shadow frustum and mapSize, toggles shadow casting.
     */
    #initShadows(): void {
        this.shadow.camera.left = -this.#config.shadow.frustum;
        this.shadow.camera.top = this.#config.shadow.frustum;
        this.shadow.camera.right = this.#config.shadow.frustum;
        this.shadow.camera.bottom = -this.#config.shadow.frustum;

        this.shadow.mapSize.height = this.#config.shadow.mapSize;
        this.shadow.mapSize.width = this.#config.shadow.mapSize;

        this.castShadow = true;
    }

    get angle(): number {
        return this.#angle;
    }
}

export default DayNightLight;
