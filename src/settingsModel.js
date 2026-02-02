// @ts-check

/**
 * Canonical settings shape used across windows.
 * Keep this in sync with `defaultSettings()` and `normalizeSettings()`.
 *
 * @typedef {Object} Settings
 * @property {number} settingsVersion
 * @property {number} speedSeconds
 * @property {number} minScale
 * @property {number} widgetOpacity
 * @property {string} accentColor
 * @property {string|null} imageDataUrl
 */

export const SETTINGS_EVENT = "settings:changed";
export const STORE_FILE = "settings.json";
export const STORE_KEY = "settings";

export const SETTINGS_VERSION = 1;

/**
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** @returns {Settings} */
export const defaultSettings = () => ({
  settingsVersion: SETTINGS_VERSION,
  speedSeconds: 4,
  minScale: 0.35,
  widgetOpacity: 1,
  accentColor: "#7dd3fc",
  imageDataUrl: null
});

/**
 * @param {unknown} stored
 * @returns {Partial<Settings>}
 */
export const migrateSettings = (stored) => {
  // Future-proofing: if we ever change schema, handle upgrades here.
  if (!stored || typeof stored !== "object") return {};
  return stored;
};

/**
 * Coerces/clamps settings and fills defaults.
 * Accepts unknown input (from store/event payload) and returns a valid Settings object.
 *
 * @param {unknown} partial
 * @returns {Settings}
 */
export const normalizeSettings = (partial) => {
  const base = defaultSettings();
  const input =
    partial && typeof partial === "object" ? migrateSettings(partial) : {};

  const speedSeconds = clamp(Number(input.speedSeconds ?? base.speedSeconds), 1, 10);
  const minScale = clamp(Number(input.minScale ?? base.minScale), 0, 0.99);
  const widgetOpacity = clamp(Number(input.widgetOpacity ?? base.widgetOpacity), 0.1, 1);
  const accentColor = String(input.accentColor ?? base.accentColor);
  const imageDataUrl =
    typeof input.imageDataUrl === "string" && input.imageDataUrl.length > 0
      ? input.imageDataUrl
      : null;

  return {
    settingsVersion: SETTINGS_VERSION,
    speedSeconds,
    minScale,
    widgetOpacity,
    accentColor,
    imageDataUrl
  };
};

