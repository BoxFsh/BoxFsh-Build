// Generate 9 placeholder listings
const listings = Array.from({ length: 9 }, (_, i) => ({
  title: "This Spot Is Available",
  description: "When someone joins BoxFsh, their listing will appear here.",
  type: "placeholder",
  rate: "Coming Soon"
}));

// DOM
const listingsContainer = document.getElementById("listings");
const buttons = document.querySelectorAll(".filter-btn");

// Render Listings
function renderListings(type = "all") {
  listingsContainer.innerHTML = "";

  // Show placeholders on all tabs (not just "all")
  const filtered = listings;

  filtered.forEach((listing, index) => {
    const card = document.createElement("div");
    card.className = "bg-slate-800 p-6 rounded-xl border border-slate-700 shadow transition flex flex-col items-center text-center";

    card.innerHTML = `
      <img src="https://via.placeholder.com/150" alt="Generic User" class="rounded-full border border-slate-600 w-1/2 h-auto mb-4">
      <h2 class="text-xl font-semibold text-slate-300">${listing.title}</h2>
      <p class="text-sm text-slate-500">${listing.rate}</p>
      <p class="text-slate-400 text-sm mt-2">${listing.description}</p>
      <p class="text-sm text-slate-500 italic mt-4">Join now to claim this spot</p>
    `;

    listingsContainer.appendChild(card);
  });
}

// Filter buttons (kept in place for future use)
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-type");
    renderListings(type);
  });
});

// Start with all placeholders
document.addEventListener("DOMContentLoaded", () => {
  renderListings();
});
