export const SETTINGS_EVENT = "settings:changed";
export const STORE_FILE = "settings.json";
export const STORE_KEY = "settings";

export const SETTINGS_VERSION = 1;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const defaultSettings = () => ({
  settingsVersion: SETTINGS_VERSION,
  speedSeconds: 4,
  minScale: 0.35,
  accentColor: "#7dd3fc",
  imageDataUrl: null
});

export const migrateSettings = (stored) => {
  // Future-proofing: if we ever change schema, handle upgrades here.
  if (!stored || typeof stored !== "object") return {};
  return stored;
};

export const normalizeSettings = (partial) => {
  const base = defaultSettings();
  const input =
    partial && typeof partial === "object" ? migrateSettings(partial) : {};

  const speedSeconds = clamp(Number(input.speedSeconds ?? base.speedSeconds), 1, 10);
  const minScale = clamp(Number(input.minScale ?? base.minScale), 0, 0.99);
  const accentColor = String(input.accentColor ?? base.accentColor);
  const imageDataUrl =
    typeof input.imageDataUrl === "string" && input.imageDataUrl.length > 0
      ? input.imageDataUrl
      : null;

  return {
    settingsVersion: SETTINGS_VERSION,
    speedSeconds,
    minScale,
    accentColor,
    imageDataUrl
  };
};

