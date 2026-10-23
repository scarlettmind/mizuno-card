const profile = {
  name: "Yuta Mizuno",
  title: "Head of Business Development, Public Relations & President’s Office",
  company: "airweave inc.",
  email: "yuta_mizuno@airweave.jp",
  phone: "090 9967 7937",
  website: "https://airweave.jp/"
};

const button = document.querySelector("#save-contact");
const ripple = button.querySelector(".ripple");

button.addEventListener("pointerdown", (event) => {
  const rect = button.getBoundingClientRect();
  ripple.style.setProperty("--x", `${event.clientX - rect.left}px`);
  ripple.style.setProperty("--y", `${event.clientY - rect.top}px`);
  ripple.classList.remove("play");
  requestAnimationFrame(() => ripple.classList.add("play"));
});

button.addEventListener("click", async () => {
  let photo = [];
  try {
    const response = await fetch("assets/yuta-mizuno.jpg");
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    const encoded = btoa(binary);
    const prefix = "PHOTO;ENCODING=b;TYPE=JPEG:";
    photo.push(prefix + encoded.slice(0, 75 - prefix.length));
    for (let i = 75 - prefix.length; i < encoded.length; i += 74) photo.push(` ${encoded.slice(i, i + 74)}`);
  } catch (_) {}

  const vcard = [
    "BEGIN:VCARD", "VERSION:3.0", `FN:${profile.name}`, "N:Mizuno;Yuta;;;",
    `ORG:${profile.company}`, `TITLE:${profile.title}`, `TEL;TYPE=CELL:${profile.phone}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`, `URL:${profile.website}`, ...photo, "END:VCARD", ""
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([vcard], {type:"text/vcard;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = "Yuta-Mizuno.vcf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
});
