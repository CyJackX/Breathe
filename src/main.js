const app = document.getElementById("app");
const gearButton = document.getElementById("gearButton");
const object = document.getElementById("object");
const objectImage = document.getElementById("objectImage");
const label = document.getElementById("label");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const colorInput = document.getElementById("color");
const showTextInput = document.getElementById("showText");
const pickImageButton = document.getElementById("pickImage");
const clearImageButton = document.getElementById("clearImage");
const controls = document.getElementById("controls");
const fileInput = document.getElementById("fileInput");

let inhaleSeconds = Number(speedInput.value);
let cycleStart = performance.now();

const updateAnimation = () => {
  const cycleSeconds = inhaleSeconds * 2;
  object.style.animationDuration = `${cycleSeconds}s`;
  speedValue.textContent = `${inhaleSeconds.toFixed(1)}s`;
  cycleStart = performance.now();
};

const updateLabel = () => {
  const elapsed = (performance.now() - cycleStart) / 1000;
  const phase = elapsed % (inhaleSeconds * 2);
  label.textContent = phase < inhaleSeconds ? "Inhale" : "Exhale";
};

speedInput.addEventListener("input", () => {
  inhaleSeconds = Number(speedInput.value);
  updateAnimation();
});

colorInput.addEventListener("input", () => {
  const color = colorInput.value;
  object.style.background = color;
  object.style.boxShadow = `0 0 24px ${color}80`;
});

showTextInput.addEventListener("change", () => {
  label.style.display = showTextInput.checked ? "block" : "none";
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
  };
  reader.readAsDataURL(file);
});

clearImageButton.addEventListener("click", () => {
  objectImage.removeAttribute("src");
  objectImage.alt = "";
  object.classList.remove("has-image");
  fileInput.value = "";
});

updateAnimation();
setSettingsOpen(false);
setInterval(updateLabel, 120);
