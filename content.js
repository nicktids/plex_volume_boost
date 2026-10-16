// Routes every <video>/<audio> on app.plex.tv through a Web Audio GainNode
// so the volume can go above 100%.

let ctx = null;
let boost = 1; // 1 = 100%
const hooked = new WeakMap(); // media element -> GainNode

function ensureContext() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function hook(el) {
  if (hooked.has(el)) return;
  try {
    const ac = ensureContext();
    // createMediaElementSource can only be called once per element, hence the WeakMap.
    const source = ac.createMediaElementSource(el);
    const gain = ac.createGain();
    gain.gain.value = boost;
    source.connect(gain).connect(ac.destination);
    hooked.set(el, gain);
    el.addEventListener("play", () => ensureContext());
  } catch (e) {
    console.warn("[Plex Volume Boost] could not hook media element", e);
  }
}

function hookAll() {
  // Don't touch audio routing until a boost is actually requested.
  if (boost === 1 && !ctx) return;
  document.querySelectorAll("video, audio").forEach(hook);
}

function applyBoost(value) {
  boost = value;
  hookAll();
  document.querySelectorAll("video, audio").forEach((el) => {
    const gain = hooked.get(el);
    if (gain && ctx) gain.gain.setTargetAtTime(boost, ctx.currentTime, 0.02);
  });
}

// Plex swaps player elements in and out as you navigate.
new MutationObserver(hookAll).observe(document.documentElement, {
  childList: true,
  subtree: true,
});

chrome.storage.local.get({ boost: 1 }, (data) => applyBoost(data.boost));

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.boost) applyBoost(changes.boost.newValue);
});
