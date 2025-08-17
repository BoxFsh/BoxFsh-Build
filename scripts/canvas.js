// Simple tab system
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

function showTab(id) {
  panels.forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  tabButtons.forEach(b => b.classList.remove("active"));
  const btn = [...tabButtons].find(b => b.dataset.tab === id);
  if (btn) btn.classList.add("active");

  // Only show these on Canvas tab
  const toolDockElements = ["#sketchpad", "#viewer3d", "#notes", "#file-lock"];
  const onCanvas = id === "tab-canvas";
  toolDockElements.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (!onCanvas) el.classList.add("hidden");
    else {
      if (sel !== "#file-lock") {
        const toggle = document.querySelector(`.tool-toggle[data-target="${sel}"]`);
        if (toggle && !toggle.checked) el.classList.add("hidden");
        else el.classList.remove("hidden");
      } else el.classList.remove("hidden");
    }
  });
}

tabButtons.forEach(btn => btn.addEventListener("click", () => showTab(btn.dataset.tab)));

// Tool toggles
document.querySelectorAll(".tool-toggle").forEach(t => {
  t.addEventListener("change", (e) => {
    const sel = e.target.getAttribute("data-target");
    const el = document.querySelector(sel);
    if (!el) return;
    el.classList.toggle("hidden", !e.target.checked);
  });
});

// Comment log
const addBtn = document.getElementById("comment-add");
const input = document.getElementById("comment-input");
const log = document.getElementById("comment-log");

function addComment(text) {
  if (!text.trim()) return;
  if (log.children.length === 1 && log.children[0].classList.contains("opacity-70")) log.innerHTML = "";
  const row = document.createElement("div");
  row.className = "flex items-start gap-2";
  const ts = new Date().toLocaleString();
  row.innerHTML = `<span class="text-xs opacity-50">${ts}</span><span class="text-sm">${text}</span>`;
  log.prepend(row);
}

addBtn?.addEventListener("click", () => { addComment(input.value); input.value = ""; });
input?.addEventListener("keydown", (e) => { if (e.key === "Enter") { addComment(input.value); input.value = ""; }});

// Complete → unlock files
document.getElementById("mark-complete")?.addEventListener("click", () => {
  document.getElementById("file-lock")?.classList.add("hidden");
  addComment("Job marked complete — files unlocked.");
});

// Step 3 extras
const focusOnCanvas = () => document.getElementById("comment-input")?.focus();
document.querySelector('[data-tab="tab-canvas"]')?.addEventListener("click", focusOnCanvas);
focusOnCanvas();

// Toast hook for Request Review
document.querySelectorAll("button").forEach(b => {
  if (b.textContent.includes("Request Review")) {
    b.addEventListener("click", () => window.bfToast?.("Review requested"));
  }
});

// Boot
showTab("tab-canvas");
