document.addEventListener("DOMContentLoaded", function () {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  // USER JOB LIST PAGE
  const userJobList = document.querySelector(".jobs-container .job-list");
  if (userJobList) {
    jobs.forEach((job) => {
      const jobCard = `
        <div class="job-card">
          <div class="job-header">
            <h3>${job.job_title}</h3>
            <span class="company-name">${job.company_name}</span>
          </div>
          <p class="job-info">${job.salary} • ${job.year_of_experience} Years Experience</p>
          <p class="job-description-preview">${job.description.substring(0, 150)}...</p>
          <a href="job-details.html?id=${job.id}" class="btn-primary">View Details</a>
        </div>
      `;
      userJobList.insertAdjacentHTML("beforeend", jobCard);
    });
  }

  // COMPANY DASHBOARD (RECENT JOBS)
  const companyJobList = document.querySelector(".recent-jobs .job-list");
  if (companyJobList) {
    const recentJobs = [...jobs].sort((a, b) => b.id - a.id).slice(0, 3);
    recentJobs.forEach((job) => {
      const jobCard = `
        <div class="job-card">
          <div class="job-header">
            <h3>${job.job_title}</h3>
            <span class="job-status ${job.status || "open"}">${job.status || "Open"}</span>
          </div>
          <p class="job-info">${job.salary} • ${job.year_of_experience} Years Experience</p>
          <div class="job-actions">
            <a href="edit-job.html?id=${job.id}" class="btn-secondary">Edit</a>
            <a href="#" class="btn-danger" onclick="deleteJob(${job.id}); return false;">Delete</a>
          </div>
        </div>
      `;
      companyJobList.insertAdjacentHTML("beforeend", jobCard);
    });

    const activeJobsCount = document.querySelector(".dashboard-stats .stat-card:nth-child(1) .stat-value");
    if (activeJobsCount) {
      const openJobs = jobs.filter((job) => job.status !== "closed").length;
      activeJobsCount.textContent = openJobs;
    }
  }

  // COMPANY JOBS PAGE (ALL JOBS)
  const companyAllJobsList = document.querySelector(".company-jobs-list");
  if (companyAllJobsList) {
    jobs.forEach((job) => {
      const jobCard = `
        <div class="job-card">
          <div class="job-header">
            <h3>${job.job_title}</h3>
            <span class="job-status ${job.status || "open"}">${job.status || "Open"}</span>
          </div>
          <p class="job-info">${job.salary} • ${job.year_of_experience} Years Experience</p>
          <p class="job-description-preview">${job.description.substring(0, 150)}...</p>
          <div class="job-actions">
            <a href="edit-job.html?id=${job.id}" class="btn-secondary">Edit</a>
            <a href="#" class="btn-danger" onclick="deleteJob(${job.id}); return false;">Delete</a>
          </div>
        </div>
      `;
      companyAllJobsList.insertAdjacentHTML("beforeend", jobCard);
    });
  }

  // JOB DETAILS PAGE
  const jobDetailsContainer = document.querySelector(".job-details");
  if (jobDetailsContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("id");
    if (jobId) {
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
              <span class="job-status ${job.status || "open"}">${job.status || "Open"}</span>
            </div>
            <div class="job-meta">
              <p class="salary">${job.salary}</p>
              <p class="experience">${job.year_of_experience} Years Experience</p>
              <p class="date">Posted: ${job.posted_date || new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div class="job-description">
            <h2>Job Description</h2>
            <p>${job.description}</p>
          </div>

          <div class="apply-section">
            <button id="applyBtn" class="btn-primary btn-large">Apply Now</button>
          </div>

          <div id="popup" class="popup">
            <div class="popup-content">
              <span class="close" onclick="document.getElementById('popup').style.display='none'">&times;</span>
              <h2>Application Form</h2>
              <p>Please fill out your details.</p>

              <form class="application-form">
                <div class="form-group">
                  <label for="name">Full Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div class="form-group">
                  <label for="resume">Resume</label>
                  <input type="file" id="resume" name="resume" required />
                </div>
                <div class="form-buttons">
                  <button type="submit" class="btn-submit">Submit</button>
                  <button type="button" class="btn-cancel">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        `;

        const applyBtn = document.getElementById("applyBtn");
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const applications = JSON.parse(localStorage.getItem("applications")) || [];

        const alreadyApplied = applications.some(
          (app) => app.jobId == job.id && app.email === currentUser?.email
        );

        if (alreadyApplied) {
          applyBtn.textContent = "Applied";
          applyBtn.disabled = true;
          applyBtn.style.cursor = "not-allowed";
        } else {
          applyBtn.addEventListener("click", () => {
            const popup = document.getElementById("popup");
            popup.style.display = "flex";

            const form = document.querySelector(".application-form");

            if (form) {
              form.onsubmit = null;

              form.onsubmit = function (e) {
                e.preventDefault();

                const name = document.getElementById("name").value.trim();
                const email = document.getElementById("email").value.trim();
                const resume = document.getElementById("resume").files[0];

                if (!name || !email || !resume) {
                  alert("Please fill out all fields.");
                  return;
                }

                const reader = new FileReader();
                reader.onload = function () {
                  const applications = JSON.parse(localStorage.getItem("applications")) || [];

                  applications.push({
                    jobId: job.id,
                    jobTitle: job.job_title,
                    applicantName: name,
                    email: email,
                    resumeData: reader.result,
                    appliedAt: new Date().toISOString(),
                  });

                  localStorage.setItem("applications", JSON.stringify(applications));

                  alert("Application submitted!");
                  form.reset();
                  popup.style.display = "none";
                  applyBtn.textContent = "Applied";
                  applyBtn.disabled = true;
                  applyBtn.style.cursor = "not-allowed";
                };

                reader.readAsDataURL(resume);
              };

              const cancelBtn = document.querySelector(".btn-cancel");
              if (cancelBtn) {
                cancelBtn.addEventListener("click", () => {
                  popup.style.display = "none";
                  form.onsubmit = null;
                });
              }
            }
          });
        }
      } else {
        jobDetailsContainer.innerHTML = `<p>Job not found.</p>`;
      }
    }
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userNameElement = document.querySelector(".company-name1");
  if (userNameElement) {
    userNameElement.textContent = currentUser?.username || "Guest";
  }
});

function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job?")) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs = jobs.filter((job) => job.id != jobId);
    localStorage.setItem("jobs", JSON.stringify(jobs));
    location.reload();
  }
}
