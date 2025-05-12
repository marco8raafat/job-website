document.addEventListener("DOMContentLoaded", function () {
  const statusFilter = document.getElementById("status-filter");

  // Add event listener to the filter dropdown
  statusFilter.addEventListener("change", function () {
    filterJobsByStatus(this.value);
  });

  // Initial filter on page load
  filterJobsByStatus(statusFilter.value);
});

function filterJobsByStatus(status) {
  const jobCards = document.querySelectorAll(".job-card");

  jobCards.forEach((card) => {
    const jobStatus = card
      .querySelector(".job-status")
      .textContent.toLowerCase();

    if (status === "all" || jobStatus === status) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}
