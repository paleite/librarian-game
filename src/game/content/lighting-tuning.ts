/**
 * Source behavior is verified: normal play uses a dynamic day/night cycle and
 * lamps become prominent at night; Cozy/disabled-cycle play stays daytime.
 *
 * The public sources do not document the exact transition duration. Keep this
 * single value isolated until video timing or game data provides the real value.
 */
export const PROVISIONAL_DAY_TO_NIGHT_MILLISECONDS = 90 * 60 * 1000;
