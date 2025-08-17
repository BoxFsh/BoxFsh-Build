(function () {
  function toast(msg) {
    let wrap = document.getElementById("bf-toast");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "bf-toast";
      wrap.className = "fixed bottom-4 right-4 z-[1000] space-y-2";
      document.body.appendChild(wrap);
    }
    const card = document.createElement("div");
    card.className = "rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-2 text-sm shadow-lg";
    card.textContent = msg;
    wrap.appendChild(card);
    setTimeout(() => card.remove(), 3000);
  }
  function openModal(id){ document.getElementById(id)?.classList.remove("hidden"); }
  function closeModal(id){ document.getElementById(id)?.classList.add("hidden"); }
  window.bfToast = toast;
  window.bfOpenModal = openModal;
  window.bfCloseModal = closeModal;
})();
