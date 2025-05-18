document.addEventListener("DOMContentLoaded", function () {
  // USER JOB LIST PAGE
  const userJobList = document.querySelector(".jobs-container .job-list");
  if (userJobList) {
    userJobList.innerHTML = "<p>No jobs available.</p>";
  }

  // COMPANY DASHBOARD (RECENT JOBS)
  const companyJobList = document.querySelector(".jobs-container1 .job-list1");
  if (companyJobList) {
    companyJobList.innerHTML = "<p>No recent jobs.</p>";
  }

  const companyJobList1 = document.querySelector(".recent-jobs .job-list");
  if (companyJobList1) {
    companyJobList1.innerHTML = "<p>No recent jobs.</p>";
  }

  const activeJobsCount = document.querySelector(
    ".dashboard-stats .stat-card:nth-child(1) .stat-value"
  );
  if (activeJobsCount) {
    activeJobsCount.textContent = "0";
  }

  // COMPANY JOBS PAGE (ALL JOBS)
  const companyAllJobsList = document.querySelector(".company-jobs-list");
  if (companyAllJobsList) {
    companyAllJobsList.innerHTML = "<p>No jobs posted yet.</p>";
  }

  // JOB DETAILS PAGE
  const jobDetailsContainer = document.querySelector(".job-details");
  if (jobDetailsContainer) {
    jobDetailsContainer.innerHTML = `
      <div class="job-header-details">
        <div class="back-link">
          <a href="#" id="backLink">← Back to Jobs</a>
        </div>
        <h1>Job Not Found</h1>
        <div class="company-info">
          <span class="company-name">Unknown Company</span>
          <span class="job-status">Closed</span>
        </div>
      </div>
      <div class="job-description">
        <p>The requested job could not be found.</p>
      </div>
    `;

    const backLink = document.getElementById("backLink");
    if (backLink) {
      backLink.addEventListener("click", function (e) {
        e.preventDefault();
        window.history.back();
      });
    }

    const applyBtn1 = document.getElementById("applyBtn");
    const cvInput = document.getElementById("cvInput");

    if (applyBtn1 && cvInput) {
      applyBtn1.addEventListener("click", function () {
        showToast("Please log in to apply for jobs", "warning");
      });
    }
  }
});

function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job?")) {
    showToast("Job deletion would be processed server-side", "info");
  }
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  
  toast.textContent = message;
  toast.style.backgroundColor =
    type === "error" ? "var(--danger-color)" :
    type === "warning" ? "var(--warning-color)" :
    "var(--success-color)";
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function saveJob(jobId) {
  showToast("Please log in to save jobs", "warning");
}