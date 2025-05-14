document.addEventListener("DOMContentLoaded", function () {
  const recentApplicationsList = document.querySelector(
    ".recent-applications .job-list"
  );
  const applicationsStat = document.querySelector(
    ".dashboard-stats .stat-card:nth-child(1) .stat-value"
  );

  function loadApplications() {
    if (recentApplicationsList) {
      recentApplicationsList.innerHTML = ""; // Clear static content
      // Applications would now come from server-side rendering or API calls
      recentApplicationsList.innerHTML = "<p>No recent applications.</p>";
    }
  }

  function updateApplicationsCount() {
    if (applicationsStat) {
      applicationsStat.textContent = "0"; // Default to 0 when no server data
    }
  }

  // Load applications and count on page load
  loadApplications();
  updateApplicationsCount();

  // Listen for the custom event (would need to be replaced with server-side logic)
  window.addEventListener("applicationSubmitted", function (event) {
    // This would need to be replaced with actual server-side integration
    console.log("Application submitted event received, but no localStorage handling");
  });
});