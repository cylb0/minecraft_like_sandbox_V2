import { computeOrbitPosition } from "@/helpers/MathUtils";
import { DayNightLightConfig } from "@/types/Config";
import { CameraHelper, DirectionalLight, Object3D, Vector3 } from "three";

/**
 * Creates a dynamic DirectionaLight that can be used to simulate astral lighting.
 */
class DayNightLight extends DirectionalLight {
    #config: DayNightLightConfig;
    center: Vector3;
    angle!: number;

    /**
     * Creates a new DaynNightLight instance.
     * 
     * - Initialize its angle based on current time ➜ in game time and compute its position.
     * - Toggles shadowing.
     * - Displays shadow camera helper if necessary.
     * 
     * @param container - The Object3D to render the light source in.
     * @param config - Configuration object.
     * @param center - The point around which the light source orbits.
     * @param helper - Wether or not to display CameraHelper for shadow visualization. 
     */
    constructor(
        container: Object3D,
        config: DayNightLightConfig,
        center: Vector3,
        helper: boolean
    ) {
        super(config.color, config.intensity);
        this.#config = config;
        this.center = center;

        this.update();

        this.#initShadows();
        
        if (helper) {
            const shadowHelper = new CameraHelper(this.shadow.camera);
            container.add(shadowHelper);
        }
        
        container.add(this);
    }

    /**
     * Updates the light source.
     *
     * - Computes the new angle based on the time of day.
     * - Updates the light's position.
     */
    update() {
        this.#updateAngle();
        this.#updatePosition();
    }

    /**
     * Computes a new angle for the light.
     *
     * - Retrieves the time of day in seconds.
     * - Leverages config's `dayDuration` to determine in game daytime.
     * - Transform the time in an angle (min = 0, max = 2PI).
     */
    #updateAngle() {
        let timeInSeconds = this.#computeCurrentTimeInSeconds();
        timeInSeconds %= this.#config.dayDuration;
        this.angle = (timeInSeconds / this.#config.dayDuration) * Math.PI * 2 - (Math.PI / 2);
    }

    /**
     * Updates the position of the light source based on it's current angle, radius and rotation center.
     */
    #updatePosition(): void {
        this.position.copy(computeOrbitPosition(this.center, this.#config.radius, this.angle));

        this.shadow.camera.position.copy(this.position);
        this.shadow.camera.updateProjectionMatrix();
        this.shadow.camera.updateMatrixWorld();
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

    /**
     * Computes the current time of the day in seconds using `Date.now()`.
     * @returns The time in seconds.
     */
    #computeCurrentTimeInSeconds() {
        const currentTime = new Date(Date.now());
        return (currentTime.getHours() * 3600) + (currentTime.getMinutes() * 60) + currentTime.getSeconds();
    }
}

export default DayNightLight;
