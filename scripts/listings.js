const elResults = document.getElementById("results");
const elSearch = document.getElementById("search");
const filterBtns = document.querySelectorAll("[data-filter]");
let DATA = [];
let activeType = "all";
let q = "";

function render(list) {
  elResults.innerHTML = "";
  if (!list.length) {
    elResults.append(document.getElementById("tpl-empty").content.cloneNode(true));
    return;
  }
  list.forEach(job => {
    const card = document.createElement("article");
    card.className = "bf-card p-4 space-y-2";
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">${job.title}</h3>
        <span class="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700">${job.type}</span>
      </div>
      <p class="text-sm opacity-80 line-clamp-3">${job.summary ?? ""}</p>
      <div class="flex items-center justify-between text-xs opacity-70">
        <span>Budget: ${job.budget ?? "—"}</span>
        <span>Due: ${job.deadline ?? "—"}</span>
      </div>
      <div class="flex flex-wrap gap-1 text-xs">
        ${(job.tags || []).map(t=>`<span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">${t}</span>`).join("")}
      </div>
      <div class="pt-2">
        <a href="./job.html?id=${encodeURIComponent(job.id)}" class="bf-btn-primary">View</a>
      </div>
    `;
    elResults.append(card);
  });
}

function applyFilters() {
  const term = q.trim().toLowerCase();
  const list = DATA.filter(j => {
    const hitType = activeType === "all" ? true : (j.type?.toLowerCase() === activeType);
    const hay = `${j.title} ${j.summary} ${(j.tags||[]).join(" ")}`.toLowerCase();
    const hitSearch = !term || hay.includes(term);
    return hitType && hitSearch;
  });
  render(list);
}

async function load() {
  try {
    const resp = await fetch("../data/jobs.json", { cache: "no-store" });
    if (!resp.ok) throw new Error(resp.statusText);
    DATA = await resp.json();
    applyFilters();
  } catch (e) {
    console.error(e);
    elResults.innerHTML = "";
    elResults.append(document.getElementById("tpl-error").content.cloneNode(true));
  }
}

elSearch?.addEventListener("input", (e) => { q = e.target.value; applyFilters(); });
filterBtns.forEach(b=>{
  b.addEventListener("click", ()=>{
    filterBtns.forEach(x=>x.classList.remove("ring-2","ring-emerald-500"));
    b.classList.add("ring-2","ring-emerald-500");
    activeType = b.dataset.filter;
    applyFilters();
  });
});

load();
