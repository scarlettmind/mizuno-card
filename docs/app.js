const button = document.querySelector("#save-contact");
const ripple = button.querySelector(".ripple");

button.addEventListener("pointerdown", (event) => {
  const rect = button.getBoundingClientRect();
  ripple.style.setProperty("--x", `${event.clientX - rect.left}px`);
  ripple.style.setProperty("--y", `${event.clientY - rect.top}px`);
  ripple.classList.remove("play");
  requestAnimationFrame(() => ripple.classList.add("play"));
});
