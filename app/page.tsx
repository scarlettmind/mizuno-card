"use client";

const profile = {
  name: "Yuta Mizuno",
  title: "Head of Business Development, Public Relations & President’s Office",
  company: "airweave inc.",
  email: "yuta_mizuno@airweave.jp",
  phone: "090 9967 7937",
  website: "https://airweave.jp/",
};

export default function Home() {
  const saveContact = async () => {
    let photoLines: string[] = [];
    try {
      const response = await fetch("/mizuno-yuta.jpg", { cache: "no-store" });
      if (!response.ok) throw new Error("Portrait unavailable");
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = "";
      for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      }
      const encoded = btoa(binary);
      const prefix = "PHOTO;ENCODING=b;TYPE=JPEG:";
      const firstChunkLength = 75 - prefix.length;
      photoLines = [prefix + encoded.slice(0, firstChunkLength)];
      for (let i = firstChunkLength; i < encoded.length; i += 74) {
        photoLines.push(` ${encoded.slice(i, i + 74)}`);
      }
    } catch { /* The contact still saves if the portrait cannot be loaded. */ }

    const card = [
      "BEGIN:VCARD", "VERSION:3.0", `FN:${profile.name}`, "N:Mizuno;Yuta;;;",
      `ORG:${profile.company}`, `TITLE:${profile.title}`,
      `TEL;TYPE=CELL:${profile.phone}`, `EMAIL;TYPE=INTERNET,WORK:${profile.email}`,
      `URL;TYPE=WORK:${profile.website}`, ...photoLines, "END:VCARD", "",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([card], { type: "text/vcard;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "Yuta-Mizuno.vcf";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  const fluidPress = (event: React.PointerEvent<HTMLButtonElement>) => {
    const wave = event.currentTarget.querySelector<HTMLElement>(".ripple");
    if (!wave) return;
    const rect = event.currentTarget.getBoundingClientRect();
    wave.style.setProperty("--x", `${event.clientX - rect.left}px`);
    wave.style.setProperty("--y", `${event.clientY - rect.top}px`);
    wave.classList.remove("play");
    window.requestAnimationFrame(() => wave.classList.add("play"));
  };

  return (
    <main className="card" aria-label="Yuta Mizuno digital business card">
      <div className="background" aria-hidden="true" />
      <div className="flow flow-a" aria-hidden="true" />
      <div className="flow flow-b" aria-hidden="true" />
      <div className="shade" aria-hidden="true" />

      <section className="intro" aria-hidden="true">
        <div className="fiber-mark">
          <svg className="fibers" viewBox="0 0 520 160" role="presentation">
            <path d="M22 92C112 18 173 137 259 79S408 25 498 78" />
            <path d="M25 111C117 36 190 151 276 91S414 42 494 60" />
            <path d="M32 68C125 6 182 115 248 66S393 8 488 91" />
          </svg>
          <img src="/airweave-official-logo.png" alt="" />
        </div>
      </section>

      <header className="brand"><img src="/airweave-official-logo.png" alt="airweave" /></header>

      <section className="content">
        <div className="identity">
          <h1><span>Yuta</span> Mizuno</h1>
          <p>Head of Business Development,<br className="mobile-break" /> Public Relations &amp; President’s Office</p>
        </div>
        <button className="save" type="button" onPointerDown={fluidPress} onClick={saveContact}>
          <span>SAVE CONTACT</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v15m0 0-5-5m5 5 5-5" /></svg>
          <i className="ripple" aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}
