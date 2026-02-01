const SETTINGS_EVENT = "settings:changed";
const STORE_FILE = "settings.json";

const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const minScaleInput = document.getElementById("minScale");
const minScaleValue = document.getElementById("minScaleValue");
const accentColorInput = document.getElementById("accentColor");
const pickImageButton = document.getElementById("pickImage");
const clearImageButton = document.getElementById("clearImage");
const fileInput = document.getElementById("fileInput");
const imageHint = document.getElementById("imageHint");

const { load } = window.__TAURI__.store;
const { emit } = window.__TAURI__.event;
const { getCurrentWindow } = window.__TAURI__.window;

const defaultSettings = () => ({
  speedSeconds: 4,
  minScale: 0.35,
  accentColor: "#7dd3fc",
  imageDataUrl: null
});

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

let store;
let settings = defaultSettings();

const updateUiFromSettings = () => {
  speedInput.value = String(settings.speedSeconds);
  speedValue.textContent = `${Number(speedInput.value).toFixed(1)}s`;

  minScaleInput.value = String(settings.minScale);
  minScaleValue.textContent = `${Math.round(settings.minScale * 100)}%`;

  accentColorInput.value = settings.accentColor;

  imageHint.textContent = settings.imageDataUrl ? "Image selected." : "No image selected.";
};

const emitAndPersist = async () => {
  await store.set("settings", settings);
  await store.save();
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
    await currentWindow.hide();
  });

  store = await load(STORE_FILE, { autoSave: false });
  const stored = await store.get("settings");
  if (stored && typeof stored === "object") {
    settings = { ...settings, ...stored };
  }

  updateUiFromSettings();
  await emitAndPersist();

  speedInput.addEventListener("input", async () => {
    settings.speedSeconds = clamp(Number(speedInput.value), 1, 10);
    speedValue.textContent = `${settings.speedSeconds.toFixed(1)}s`;
    await emitAndPersist();
  });

  minScaleInput.addEventListener("input", async () => {
    settings.minScale = clamp(Number(minScaleInput.value), 0.1, 0.99);
    minScaleValue.textContent = `${Math.round(settings.minScale * 100)}%`;
    await emitAndPersist();
  });

  accentColorInput.addEventListener("input", async () => {
    settings.accentColor = accentColorInput.value;
    await emitAndPersist();
  });

  pickImageButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const dataUrl = await readImageAsDataUrl(file);
    if (typeof dataUrl !== "string") return;
    settings.imageDataUrl = dataUrl;
    imageHint.textContent = "Image selected.";
    await emitAndPersist();
  });

  clearImageButton.addEventListener("click", async () => {
    settings.imageDataUrl = null;
    fileInput.value = "";
    imageHint.textContent = "No image selected.";
    await emitAndPersist();
  });
});

