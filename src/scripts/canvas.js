// Simple tab system
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");
function showTab(id) {
  panels.forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  tabButtons.forEach(b => b.classList.remove("active"));
  const btn = [...tabButtons].find(b => b.dataset.tab === id);
  if (btn) btn.classList.add("active");

  // Show tool dock features only on Canvas tab
  const toolDockElements = ["#sketchpad", "#viewer3d", "#notes", "#file-lock"];
  const onCanvas = id === "tab-canvas";
  toolDockElements.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (!onCanvas) el.classList.add("hidden");
    else {
      // Respect each tool's own visibility (checkboxes)
      if (sel !== "#file-lock") {
        const toggle = document.querySelector(`.tool-toggle[data-target="${sel}"]`);
        if (toggle && !toggle.checked) el.classList.add("hidden");
        else el.classList.remove("hidden");
      } else {
        el.classList.remove("hidden");
      }
    }
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

// Tool toggles
document.querySelectorAll(".tool-toggle").forEach(t => {
  t.addEventListener("change", (e) => {
    const sel = e.target.getAttribute("data-target");
    const el = document.querySelector(sel);
    if (!el) return;
    if (e.target.checked) el.classList.remove("hidden");
    else el.classList.add("hidden");
  });
});

// Comment log
const addBtn = document.getElementById("comment-add");
const input = document.getElementById("comment-input");
const log = document.getElementById("comment-log");

function addComment(text) {
  if (!text.trim()) return;
  // Remove "No comments yet." placeholder
  if (log.children.length === 1 && log.children[0].classList.contains("opacity-70")) {
    log.innerHTML = "";
  }
  const row = document.createElement("div");
  row.className = "flex items-start gap-2";
  const ts = new Date().toLocaleString();
  row.innerHTML = `
    <span class="text-xs opacity-50">${ts}</span>
    <span class="text-sm">${text}</span>
  `;
  log.prepend(row);
}

addBtn?.addEventListener("click", () => {
  addComment(input.value);
  input.value = "";
});

input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addComment(input.value);
    input.value = "";
  }
});

// Mark complete → unlock files (demo)
document.getElementById("mark-complete")?.addEventListener("click", () => {
  const lock = document.getElementById("file-lock");
  lock.classList.add("hidden");
  addComment("Job marked complete — files unlocked.");
});

// Boot: show Canvas tab by default
showTab("tab-canvas");
// Ensure tool dock is visible on Canvas tab
document.querySelectorAll(".tool-toggle").forEach(t => {
  const target = document.querySelector(t.getAttribute("data-target"));
  if (target) target.classList.remove("hidden");
});