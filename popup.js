const slider = document.getElementById("slider");
const label = document.getElementById("value");
const reset = document.getElementById("reset");

function show(percent) {
  slider.value = percent;
  label.textContent = percent + "%";
  chrome.action.setBadgeText({ text: percent > 100 ? String(percent) : "" });
  chrome.action.setBadgeBackgroundColor({ color: "#e5a00d" });
}

function save(percent) {
  show(percent);
  chrome.storage.local.set({ boost: percent / 100 });
}

chrome.storage.local.get({ boost: 1 }, (data) => show(Math.round(data.boost * 100)));

slider.addEventListener("input", () => save(Number(slider.value)));
reset.addEventListener("click", () => save(100));
