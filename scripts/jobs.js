// /scripts/job.js
(function () {
  const $ = (sel, all = false) => all ? document.querySelectorAll(sel) : document.querySelector(sel);
  const jobDataEl = $("#job-data");
  if (!jobDataEl) return;
  const data = JSON.parse(jobDataEl.textContent);

  // Fill header bits
  $("#job-title").textContent = data.title;
  $("#job-id").textContent = data.id;

  const statusDot = document.createElement("span");
  statusDot.className = "h-2.5 w-2.5 rounded-full " + (data.status === "complete" ? "bg-emerald-400" : "bg-amber-400");

  const jobStatus = $("#job-status");
  jobStatus.innerHTML = "";
  jobStatus.append(statusDot, document.createTextNode(" " + (data.status === "complete" ? "Complete" : "In Progress")));

  const visMap = { public: "Public", pro: "Pro-Only", invite: "Invite-Only" };
  $("#job-visibility").lastChild && $("#job-visibility").lastChild.remove(); // clear old text node
  $("#job-visibility").append(" " + (visMap[data.visibility] || "Pro-Only"));

  // Quick facts
  const fmtMoney = (n) => (typeof n === "number" ? `$${n.toFixed(0)}` : "—");
  $("#job-budget").textContent = fmtMoney(data.budget);
  $("#job-created").textContent = data.created || "—";
  $("#job-due").textContent = data.due || "—";
  $("#job-category").textContent = data.category || "—";

  // Summary
  $("#job-summary").textContent = data.summary;

  // Scope
  const scopeEl = $("#job-scope");
  if (Array.isArray(data.scope)) {
    const ul = document.createElement("ul");
    ul.className = "list-disc pl-6";
    data.scope.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    scopeEl.appendChild(ul);
  }

  // Milestones
  const msWrap = $("#milestones");
  data.milestones.forEach(ms => {
    const li = document.createElement("li");
    li.className = "rounded-xl border border-slate-700 bg-slate-900/60 p-3 flex items-center gap-3";
    li.innerHTML = `
      <span class="h-2.5 w-2.5 rounded-full ${ms.done ? "bg-emerald-400" : "bg-slate-600"}"></span>
      <span class="${ms.done ? "line-through text-slate-400" : ""}">${ms.label}</span>
    `;
    msWrap.appendChild(li);
  });

  // --- TABS (bulletproof global listener) ---
(() => {
  const panels = document.querySelectorAll('.tab-panel');

  const showTab = (name) => {
    panels.forEach(p => {
      const isActive = p.getAttribute('data-panel') === name;
      p.classList.toggle('hidden', !isActive);
    });

    document.querySelectorAll('.tab-btn').forEach(b => {
      const active = b.getAttribute('data-tab') === name;
      b.classList.toggle('bg-slate-900', active);
      b.classList.toggle('hover:bg-slate-900', !active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  // Global delegate: any .tab-btn click anywhere
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    e.preventDefault(); // keep it from doing anything funky
    const target = btn.getAttribute('data-tab');
    if (target) showTab(target);
  });

  // Default open
  showTab('overview');
})();


  // Files (lock until complete)
  const filesLocked = data.filesLocked && data.status !== "complete";
  const fileList = $("#file-list");
  const lockBanner = $("#file-lock-banner");
  if (filesLocked) lockBanner.classList.remove("hidden");

  (data.files || []).forEach(f => {
    const li = document.createElement("li");
    li.className = "group rounded-xl border border-slate-700 bg-slate-900/60 p-3 flex items-center gap-3";
    li.innerHTML = `
      <div class="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
        <span class="text-xs opacity-70">${(f.type || "FILE")}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="truncate">${f.name}</p>
        <p class="text-xs text-slate-400">${f.size || ""}</p>
      </div>
      <button class="px-3 py-1 rounded-lg border border-slate-700 ${filesLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-800"}">
        ${filesLocked ? "Locked" : "Download"}
      </button>
    `;
    if (filesLocked) {
      li.title = "Locked until job completion";
    }
    fileList.appendChild(li);
  });

  // Updates (simple list + add)
  const updatesList = $("#updates-list");
  const renderUpdate = (u) => {
    const li = document.createElement("li");
    li.className = "rounded-xl border border-slate-700 bg-slate-900/60 p-3";
    li.innerHTML = `<p class="text-xs text-slate-400 mb-1">${u.t}</p><p>${u.m}</p>`;
    updatesList.prepend(li);
  };
  (data.updates || []).forEach(renderUpdate);

  $("#update-add").addEventListener("click", () => {
    const input = $("#update-input");
    const txt = input.value.trim();
    if (!txt) return;
    const now = new Date();
    const stamp = now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0") + " " +
      String(now.getHours()).padStart(2, "0") + ":" +
      String(now.getMinutes()).padStart(2, "0");
    renderUpdate({ t: stamp, m: txt });
    input.value = "";
  });

  // --- COMPLETE TOGGLE (stubborn-proof) ---
(() => {
  const confirmScope = document.getElementById('confirm-scope');
  const completeBtn = document.getElementById('btn-complete');
  if (!confirmScope || !completeBtn) return;

  const sync = () => {
    completeBtn.disabled = !confirmScope.checked;
  };

  // cover all bases (checkbox via label, keyboard, etc.)
  ['change', 'input', 'click'].forEach(evt =>
    confirmScope.addEventListener(evt, sync)
  );

  // run once on load
  sync();

  completeBtn.addEventListener('click', () => {
    // Flip to complete
    const jobStatus = document.getElementById('job-status');
    if (jobStatus) {
      jobStatus.innerHTML = '';
      const dot = document.createElement('span');
      dot.className = 'h-2.5 w-2.5 rounded-full bg-emerald-400';
      jobStatus.append(dot, document.createTextNode(' Complete'));
    }

    // Unlock files visually
    const lockBanner = document.getElementById('file-lock-banner');
    lockBanner && lockBanner.classList.add('hidden');
    document.querySelectorAll('#file-list button').forEach(b => {
      b.textContent = 'Download';
      b.classList.remove('opacity-50', 'cursor-not-allowed');
      b.classList.add('hover:bg-slate-800');
      b.removeAttribute('title');
    });

    // Mark final milestone done if present
    const ms = document.querySelectorAll('#milestones li');
    if (ms.length) {
      const last = ms[ms.length - 1];
      const dot = last.querySelector('span');
      if (dot) dot.className = 'h-2.5 w-2.5 rounded-full bg-emerald-400';
      const label = last.querySelector('span + span');
      if (label) label.className = 'line-through text-slate-400';
    }
  });
})();


  // Visibility radio (demo only)
  document.querySelectorAll('input[name="vis"]').forEach(r => {
    r.addEventListener("change", () => {
      const value = document.querySelector('input[name="vis"]:checked').value;
      $("#job-visibility").lastChild && $("#job-visibility").lastChild.remove();
      const visMap = { public: "Public", pro: "Pro-Only", invite: "Invite-Only" };
      $("#job-visibility").append(" " + (visMap[value] || "Pro-Only"));
    });
  });

  // Wire Canvas links with job id as query (?job=J-XXXX)
  const canvasURL = `./canvas.html?job=${encodeURIComponent(data.id)}`;
  $("#open-canvas").setAttribute("href", canvasURL);
  $("#open-canvas-cta").setAttribute("href", canvasURL);
})();
