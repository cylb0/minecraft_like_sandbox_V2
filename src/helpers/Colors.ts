import { Color } from "three";

/**
 * Returns the hexadecimal value of an interpolated color.
 *
 * @param color1 - The hexadecimal value of first color.
 * @param color2 - The hexadecimal value of second color.
 * @param alpha - The alpha progress between those 2 (from 0 to 1).
 * @returns - The interpolated color hexadecimal value.
 */
export function lerpColor(color1: number, color2: number, alpha: number): number {
    const c1 = new Color(color1);
    const c2 = new Color(color2);
    return new Color().lerpColors(c1, c2, alpha).getHex();
}