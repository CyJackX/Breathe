const circle = document.getElementById("circle");
const label = document.getElementById("label");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const colorInput = document.getElementById("color");
const showTextInput = document.getElementById("showText");

let inhaleSeconds = Number(speedInput.value);
let cycleStart = performance.now();

const updateAnimation = () => {
  const cycleSeconds = inhaleSeconds * 2;
  circle.style.animationDuration = `${cycleSeconds}s`;
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
  circle.style.background = color;
  circle.style.boxShadow = `0 0 24px ${color}80`;
});

showTextInput.addEventListener("change", () => {
  label.style.display = showTextInput.checked ? "block" : "none";
});

updateAnimation();
setInterval(updateLabel, 120);
