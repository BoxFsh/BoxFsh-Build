const listings = [
  {
    title: "Character Sculptor",
    description: "Custom fantasy miniatures from concept to print-ready STL.",
    type: "designer",
    rate: "$30/hr"
  },
  {
    title: "3D Printer Needed",
    description: "Customer seeking resin prints of 5 tabletop characters.",
    type: "job",
    rate: "$90 total"
  },
  {
    title: "Costume Props",
    description: "Looking for a designer to create fantasy armor in modular pieces.",
    type: "designer",
    rate: "$50/hr (negotiable)"
  },
  {
    title: "Custom Board Game Pieces",
    description: "Producer needed to manufacture prototype tiles and tokens.",
    type: "producer",
    rate: "Quote required"
  }
];

const listingsContainer = document.getElementById("listings");
const buttons = document.querySelectorAll(".filter-btn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalRate = document.getElementById("modal-rate");
const modalClose = document.getElementById("modal-close");

function openModal(listing) {
  modalTitle.textContent = listing.title;
  modalDesc.textContent = listing.description;
  modalRate.textContent = `Rate: ${listing.rate}`;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal(); // click outside closes
});

function renderListings(filterType = "all") {
  listingsContainer.innerHTML = "";

  const filtered = filterType === "all"
    ? listings
    : listings.filter(listing => listing.type === filterType);

  filtered.forEach(listing => {
    const card = document.createElement("div");
    card.className = "bg-slate-800 rounded-xl p-6 border border-slate-700 shadow hover:shadow-lg transition cursor-pointer";

    card.innerHTML = `
      <h2 class="text-xl font-semibold text-teal-400">${listing.title}</h2>
      <p class="text-slate-300 text-sm mt-2">${listing.description}</p>
      <p class="text-slate-500 text-xs mt-4">Rate: ${listing.rate}</p>
    `;

    card.addEventListener("click", () => openModal(listing));
    listingsContainer.appendChild(card);
  });
}

// Filter button clicks
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-type");
    renderListings(type);
  });
});

// Initial load
renderListings();
