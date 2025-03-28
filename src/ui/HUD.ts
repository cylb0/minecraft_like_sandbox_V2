/**
 * Class responsible for rendering UI elements such as crosshair, position or menus.
 */
class HUD {
    /** Crosshair element if it exists. */
    static #crosshair: HTMLDivElement | null = null;

    /**
     * Initializes HUD by adding element to the screen.
     */
    static initialize(): void {
        this.addCrosshair();
    }

    /**
     * Adds a crosshair for aiming to the center of the screen.
     */
    static addCrosshair(): void {
        if (!this.#crosshair) {
            const crosshairContainer = document.createElement("div");
            crosshairContainer.style.position = "absolute";
            crosshairContainer.style.top = "50%";
            crosshairContainer.style.left = "50%";
            crosshairContainer.style.width = "0";
            crosshairContainer.style.height = "0";
            crosshairContainer.style.pointerEvents = "none";
            crosshairContainer.style.transform = "translate(-50%, -50%)";

            const crosshairSize = 12;
            const crosshairThickness = 2;

            const horizontalLine = document.createElement("div");
            horizontalLine.style.position = "absolute";
            horizontalLine.style.width = `${crosshairSize}px`;
            horizontalLine.style.height = `${crosshairThickness}px`;
            horizontalLine.style.backgroundColor = "grey";
            horizontalLine.style.left = `-${crosshairSize / 2}px`;
            horizontalLine.style.top = `-${crosshairThickness / 2}px`;

            const verticalLine = document.createElement("div");
            verticalLine.style.position = "absolute";
            verticalLine.style.width = `${crosshairThickness}px`;
            verticalLine.style.height = `${crosshairSize}px`;
            verticalLine.style.backgroundColor = "grey";
            verticalLine.style.left = `-${crosshairThickness / 2}px`;
            verticalLine.style.top = `-${crosshairSize / 2}px`;

            crosshairContainer.appendChild(horizontalLine);
            crosshairContainer.appendChild(verticalLine);

            document.body.appendChild(crosshairContainer);
            this.#crosshair = crosshairContainer;
        }
    }
}

export default HUD;
