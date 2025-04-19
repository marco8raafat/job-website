document.addEventListener("DOMContentLoaded", function () {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  // Check if we're on the job list page (user view)
  const userJobList = document.querySelector(".jobs-container .job-list");
  if (userJobList) {
    jobs.forEach((job) => {
      const jobCard = `
        <div class="job-card">
          <div class="job-header">
            <h3>${job.job_title}</h3>
            <span class="company-name">${job.company_name}</span>
          </div>
          <p class="job-info">${job.salary} • ${
        job.year_of_experience
      } Years Experience</p>
          <p class="job-description-preview">
            ${job.description.substring(0, 150)}...
          </p>
          <a href="job-details.html?id=${
            job.id
          }" class="btn-primary">View Details</a>
        </div>
      `;
      userJobList.insertAdjacentHTML("beforeend", jobCard);
    });
  }

  // Check if we're on the company dashboard page
  const companyJobList = document.querySelector(".recent-jobs .job-list");
  if (companyJobList) {
    // Only show the most recent 3 jobs
    const recentJobs = [...jobs].sort((a, b) => b.id - a.id).slice(0, 3);

    recentJobs.forEach((job) => {
      const jobCard = `
        <div class="job-card">
          <div class="job-header">
            <h3>${job.job_title}</h3>
            <span class="job-status ${job.status || "open"}">${
        job.status || "Open"
      }</span>
          </div>
          <p class="job-info">${job.salary} • ${
        job.year_of_experience
      } Years Experience</p>
          <div class="job-actions">
            <a href="edit-job.html?id=${job.id}" class="btn-secondary">Edit</a>
            <a href="#" class="btn-danger" onclick="deleteJob(${
              job.id
            }); return false;">Delete</a>
          </div>
        </div>
      `;
      companyJobList.insertAdjacentHTML("beforeend", jobCard);
    });

    // Update the active jobs count
    const activeJobsCount = document.querySelector(
      ".dashboard-stats .stat-card:nth-child(1) .stat-value"
    );
    if (activeJobsCount) {
      const openJobs = jobs.filter((job) => job.status !== "closed").length;
      activeJobsCount.textContent = openJobs;
    }
  }

  // Check if we're on the company jobs page (all company jobs)
  const companyAllJobsList = document.querySelector(".company-jobs-list");
  if (companyAllJobsList) {
    jobs.forEach((job) => {
      const jobCard = `
        <div class="job-card">
          <div class="job-header">
            <h3>${job.job_title}</h3>
            <span class="job-status ${job.status || "open"}">${
        job.status || "Open"
      }</span>
          </div>
          <p class="job-info">${job.salary} • ${
        job.year_of_experience
      } Years Experience</p>
          <p class="job-description-preview">
            ${job.description.substring(0, 150)}...
          </p>
          <div class="job-actions">
            <a href="edit-job.html?id=${job.id}" class="btn-secondary">Edit</a>
            <a href="#" class="btn-danger" onclick="deleteJob(${
              job.id
            }); return false;">Delete</a>
          </div>
        </div>
      `;
      companyAllJobsList.insertAdjacentHTML("beforeend", jobCard);
    });
  }

  // Check if we're on the job details page
  const jobDetailsContainer = document.querySelector(".job-details");
  if (jobDetailsContainer) {
    // Get the job ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("id");

    if (jobId) {
      // Find the job with the matching ID
      const job = jobs.find((job) => job.id == jobId);

      if (job) {
        jobDetailsContainer.innerHTML = `
          <div class="job-header-details">
            <div class="back-link">
              <a href="job-list.html">← Back to Jobs</a>
            </div>
            <h1>${job.job_title}</h1>
            <div class="company-info">
              <span class="company-name">${job.company_name}</span>
              <span class="job-status ${job.status || "open"}">${
          job.status || "Open"
        }</span>
            </div>
            <div class="job-meta">
              <p class="salary">${job.salary}</p>
              <p class="experience">${
                job.year_of_experience
              } Years Experience</p>
              <p class="date">Posted: ${
                job.posted_date || new Date().toLocaleDateString()
              }</p>
            </div>
          </div>

          <div class="job-description">
            <h2>Job Description</h2>
            <p>${job.description}</p>
          </div>

          <div class="apply-section">
            <button
              class="btn-primary btn-large"
              onclick="document.getElementById('popup').style.display='flex'"
            >
              Apply Now
            </button>
          </div>
        `;
      } else {
        jobDetailsContainer.innerHTML = `<p>Job not found.</p>`;
      }
    }
  }
});

// Function to delete a job
function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job?")) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs = jobs.filter((job) => job.id != jobId);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    // Refresh the page to show updated job list
    location.reload();
  }
}
document.addEventListener('DOMContentLoaded', function() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userNameElement = document.querySelector('.company-name1');
  
  if (currentUser && currentUser.username) {
      userNameElement.textContent = currentUser.username;
  } else {
      userNameElement.textContent = 'Guest';
  }
});