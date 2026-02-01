const SETTINGS_EVENT = "settings:changed";
const STORE_FILE = "settings.json";

const app = document.getElementById("app");
const gearButton = document.getElementById("gearButton");
const exitButton = document.getElementById("exitButton");
const object = document.getElementById("object");
const objectImage = document.getElementById("objectImage");

const { load } = window.__TAURI__.store;
const { listen } = window.__TAURI__.event;
const tauriWindowNs = window.__TAURI__.window;
const tauriWebviewWindowNs = window.__TAURI__.webviewWindow;

const getWindowByLabel = async (label) => {
  // Tauri v2 global API shape can vary a bit; try the common ones.
  if (tauriWindowNs?.getByLabel) return await tauriWindowNs.getByLabel(label);
  if (tauriWindowNs?.Window?.getByLabel) return await tauriWindowNs.Window.getByLabel(label);
  if (tauriWebviewWindowNs?.getByLabel) return await tauriWebviewWindowNs.getByLabel(label);
  if (tauriWebviewWindowNs?.WebviewWindow?.getByLabel) {
    return await tauriWebviewWindowNs.WebviewWindow.getByLabel(label);
  }
  return null;
};

const defaultSettings = () => ({
  speedSeconds: 4,
  minScale: 0.35,
  accentColor: "#7dd3fc",
  imageDataUrl: null
});

const clearAccent = () => {
  object.style.removeProperty("background");
  object.style.removeProperty("box-shadow");
};

const applySettings = (settings) => {
  const speedSeconds = Number(settings.speedSeconds ?? 4);
  const minScale = Number(settings.minScale ?? 0.35);
  const accentColor = String(settings.accentColor ?? "#7dd3fc");
  const imageDataUrl = settings.imageDataUrl ?? null;

  object.style.animationDuration = `${speedSeconds * 2}s`;
  object.style.setProperty("--breathe-min-scale", String(minScale));

  if (typeof imageDataUrl === "string" && imageDataUrl.length > 0) {
    objectImage.src = imageDataUrl;
    objectImage.alt = "Breathing object";
    object.classList.add("has-image");
    clearAccent();
    return;
  }

  objectImage.removeAttribute("src");
  objectImage.alt = "";
  object.classList.remove("has-image");
  object.style.background = accentColor;
  object.style.boxShadow = `0 0 24px ${accentColor}80`;
};

const openSettingsWindow = async () => {
  const existing = await getWindowByLabel("settings");
  if (existing) {
    await existing.show();
    await existing.setFocus();
    await existing.center();
    return;
  }

  const WebviewWindowCtor =
    tauriWebviewWindowNs?.WebviewWindow ?? tauriWebviewWindowNs?.WebviewWindow;
  if (!WebviewWindowCtor) return;

  const win = new WebviewWindowCtor("settings", {
    url: "settings.html",
    title: "BreatheWidget Settings",
    decorations: true,
    resizable: true,
    width: 520,
    height: 520
  });
  win.once("tauri://created", async () => {
    await win.show();
    await win.setFocus();
    await win.center();
  });
};

const exitApp = async () => {
  // Close settings window if it exists (use destroy to bypass the "hide on close" handler).
  const settingsWin = await getWindowByLabel("settings");
  if (settingsWin) {
    try {
      await settingsWin.destroy();
    } catch {
      // ignore
    }
  }

  // Destroy the widget window (current window).
  const currentWindow =
    tauriWindowNs?.getCurrentWindow ? tauriWindowNs.getCurrentWindow() : null;
  if (currentWindow) {
    await currentWindow.destroy();
  }
};

gearButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  openSettingsWindow();
});

exitButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  exitApp();
});

window.addEventListener("DOMContentLoaded", async () => {
  const store = await load(STORE_FILE, { autoSave: false });
  const stored = await store.get("settings");
  const initial = { ...defaultSettings(), ...(stored ?? {}) };
  applySettings(initial);

  await listen(SETTINGS_EVENT, (event) => {
    applySettings(event.payload);
  });
});
