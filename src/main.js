const app = document.getElementById("app");
const gearButton = document.getElementById("gearButton");
const object = document.getElementById("object");
const objectImage = document.getElementById("objectImage");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const colorInput = document.getElementById("color");
const pickImageButton = document.getElementById("pickImage");
const clearImageButton = document.getElementById("clearImage");
const controls = document.getElementById("controls");
const fileInput = document.getElementById("fileInput");

let inhaleSeconds = Number(speedInput.value);
let cycleStart = performance.now();
let accentColor = colorInput.value;

const updateAnimation = () => {
  const cycleSeconds = inhaleSeconds * 2;
  object.style.animationDuration = `${cycleSeconds}s`;
  speedValue.textContent = `${inhaleSeconds.toFixed(1)}s`;
  cycleStart = performance.now();
};

const applyAccent = () => {
  if (object.classList.contains("has-image")) {
    return;
  }
  object.style.background = accentColor;
  object.style.boxShadow = `0 0 24px ${accentColor}80`;
};

const clearAccent = () => {
  object.style.removeProperty("background");
  object.style.removeProperty("box-shadow");
};

speedInput.addEventListener("input", () => {
  inhaleSeconds = Number(speedInput.value);
  updateAnimation();
});

colorInput.addEventListener("input", () => {
  accentColor = colorInput.value;
  applyAccent();
});

const setSettingsOpen = (isOpen) => {
  app.classList.toggle("settings-open", isOpen);
  controls.setAttribute("aria-hidden", String(!isOpen));
};

gearButton.addEventListener("click", (event) => {
  event.stopPropagation();
  setSettingsOpen(!app.classList.contains("settings-open"));
});

document.addEventListener("pointerdown", (event) => {
  if (!app.classList.contains("settings-open")) {
    return;
  }
  const target = event.target;
  const clickedInsideControls = target.closest(".controls");
  const clickedGear = target.closest("#gearButton");
  if (!clickedInsideControls && !clickedGear) {
    setSettingsOpen(false);
  }
});

pickImageButton.addEventListener("click", async () => {
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (typeof result !== "string") return;
    objectImage.src = result;
    objectImage.alt = "Custom breathing object";
    object.classList.add("has-image");
    clearAccent();
  };
  reader.readAsDataURL(file);
});

clearImageButton.addEventListener("click", () => {
  objectImage.removeAttribute("src");
  objectImage.alt = "";
  object.classList.remove("has-image");
  fileInput.value = "";
  applyAccent();
});

updateAnimation();
applyAccent();
setSettingsOpen(false);
