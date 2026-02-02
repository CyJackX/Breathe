// @ts-check

import {
  SETTINGS_EVENT,
  STORE_FILE,
  STORE_KEY,
  normalizeSettings
} from "./settingsModel.js";

/**
 * @template {HTMLElement} T
 * @param {string} id
 * @returns {T}
 */
const mustGet = (id) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return /** @type {T} */ (el);
};

/** @type {HTMLInputElement} */ const speedInput = mustGet("speed");
/** @type {HTMLSpanElement} */ const speedValue = mustGet("speedValue");
/** @type {HTMLInputElement} */ const minScaleInput = mustGet("minScale");
/** @type {HTMLSpanElement} */ const minScaleValue = mustGet("minScaleValue");
/** @type {HTMLInputElement} */ const widgetOpacityInput = mustGet("widgetOpacity");
/** @type {HTMLSpanElement} */ const widgetOpacityValue = mustGet("widgetOpacityValue");
/** @type {HTMLInputElement} */ const accentColorInput = mustGet("accentColor");
/** @type {HTMLButtonElement} */ const pickImageButton = mustGet("pickImage");
/** @type {HTMLButtonElement} */ const clearImageButton = mustGet("clearImage");
/** @type {HTMLInputElement} */ const fileInput = mustGet("fileInput");
/** @type {HTMLParagraphElement} */ const imageHint = mustGet("imageHint");

const tauri = /** @type {any} */ (window).__TAURI__;
const { load } = tauri.store;
const { emit } = tauri.event;
const { getCurrentWindow } = tauri.window;

let store;
let settings = normalizeSettings({});
let saveTimer = null;
const SAVE_DEBOUNCE_MS = 400;

const updateUiFromSettings = () => {
  speedInput.value = String(settings.speedSeconds);
  speedValue.textContent = `${Number(speedInput.value).toFixed(1)}s`;

  minScaleInput.value = String(settings.minScale);
  minScaleValue.textContent = `${Math.round(settings.minScale * 100)}%`;

  widgetOpacityInput.value = String(settings.widgetOpacity);
  widgetOpacityValue.textContent = `${Math.round(settings.widgetOpacity * 100)}%`;

  accentColorInput.value = settings.accentColor;

  imageHint.textContent = settings.imageDataUrl ? "Image selected." : "No image selected.";
};

const scheduleSave = () => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await store.save();
    } catch {
      // ignore
    }
  }, SAVE_DEBOUNCE_MS);
};

const flushSave = async () => {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  try {
    await store.save();
  } catch {
    // ignore
  }
};

const emitAndPersist = async () => {
  settings = normalizeSettings(settings);
  await store.set(STORE_KEY, settings);
  scheduleSave();
  await emit(SETTINGS_EVENT, settings);
};

const readImageAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

window.addEventListener("DOMContentLoaded", async () => {
  // UX: don't destroy settings window on X; hide it.
  const currentWindow = getCurrentWindow();
  await currentWindow.onCloseRequested(async (event) => {
    event.preventDefault();
    await flushSave();
    await currentWindow.hide();
  });

  store = await load(STORE_FILE, { autoSave: false });
  const stored = await store.get(STORE_KEY);
  settings = normalizeSettings(stored);

  updateUiFromSettings();
  await emit(SETTINGS_EVENT, settings);

  speedInput.addEventListener("input", async () => {
    settings = normalizeSettings({ ...settings, speedSeconds: Number(speedInput.value) });
    speedValue.textContent = `${settings.speedSeconds.toFixed(1)}s`;
    await emitAndPersist();
  });

  minScaleInput.addEventListener("input", async () => {
    settings = normalizeSettings({ ...settings, minScale: Number(minScaleInput.value) });
    minScaleValue.textContent = `${Math.round(settings.minScale * 100)}%`;
    await emitAndPersist();
  });

  widgetOpacityInput.addEventListener("input", async () => {
    settings = normalizeSettings({
      ...settings,
      widgetOpacity: Number(widgetOpacityInput.value)
    });
    widgetOpacityValue.textContent = `${Math.round(settings.widgetOpacity * 100)}%`;
    await emitAndPersist();
  });

  accentColorInput.addEventListener("input", async () => {
    settings = normalizeSettings({ ...settings, accentColor: accentColorInput.value });
    await emitAndPersist();
  });

  pickImageButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const dataUrl = await readImageAsDataUrl(file);
    if (typeof dataUrl !== "string") return;
    settings = normalizeSettings({ ...settings, imageDataUrl: dataUrl });
    imageHint.textContent = "Image selected.";
    await emitAndPersist();
  });

  clearImageButton.addEventListener("click", async () => {
    settings = normalizeSettings({ ...settings, imageDataUrl: null });
    fileInput.value = "";
    imageHint.textContent = "No image selected.";
    await emitAndPersist();
  });
});

