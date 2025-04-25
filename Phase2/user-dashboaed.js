document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const recentApplicationsList = document.querySelector(
    ".recent-applications .job-list"
  );
  const applicationsStat = document.querySelector(
    ".dashboard-stats .stat-card:nth-child(1) .stat-value"
  );

  function loadApplications() {
    if (recentApplicationsList) {
      recentApplicationsList.innerHTML = ""; // Clear static content
      const applications =
        JSON.parse(localStorage.getItem("applications")) || [];
      const userApplications = applications
        .filter((app) => app.email === currentUser?.email)
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, 2); // Show up to 2 recent applications

      if (userApplications.length === 0) {
        recentApplicationsList.innerHTML = "<p>No recent applications.</p>";
      } else {
        userApplications.forEach((app) => {
          const appliedDate = new Date(app.appliedAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );
          const jobCard = `
            <div class="job-card">
              <div class="job-header">
                <h3>${app.jobTitle}</h3>
                <span class="company-name">${app.companyName}</span>
              </div>
              <p class="job-info">Applied: ${appliedDate}</p>
              <p class="application-status ${app.status
                .toLowerCase()
                .replace(" ", "-")}">Status: ${app.status}</p>
              <a href="job-details.html?id=${
                app.jobId
              }" class="btn-secondary">View Job</a>
            </div>
          `;
          recentApplicationsList.insertAdjacentHTML("beforeend", jobCard);
        });
      }
    }
  }

  function updateApplicationsCount() {
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    const userApplications = applications.filter(
      (app) => app.email === currentUser?.email
    );
    if (applicationsStat) {
      applicationsStat.textContent = userApplications.length;
    }
  }

  // Load applications and count on page load
  loadApplications();
  updateApplicationsCount();

  // Listen for the custom event and update the applications list and count
  window.addEventListener("applicationSubmitted", function (event) {
    const newApplication = event.detail;
    const appliedDate = new Date(newApplication.appliedAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    const jobCard = `
      <div class="job-card">
        <div class="job-header">
          <h3>${newApplication.jobTitle}</h3>
          <span class="company-name">${newApplication.companyName}</span>
        </div>
        <p class="job-info">Applied: ${appliedDate}</p>
        <p class="application-status ${newApplication.status
          .toLowerCase()
          .replace(" ", "-")}">Status: ${newApplication.status}</p>
        <a href="job-details.html?id=${
          newApplication.jobId
        }" class="btn-secondary">View Job</a>
      </div>
    `;
    recentApplicationsList.insertAdjacentHTML("afterbegin", jobCard);

    // Increment the applications count
    updateApplicationsCount();
  });
});
