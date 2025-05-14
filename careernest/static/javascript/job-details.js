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
          <p class="job-info">${job.salary} • ${
        job.year_of_experience
      } Years Experience</p>
          <p class="job-description-preview">${job.description.substring(
            0,
            150
          )}...</p>
          <div class="job-buttons">
            <a href="job-details.html?id=${job.id}" class="btn-primary">View Details</a>
            <button onclick="saveJob(${job.id})" class="btn-primary">Save</button>
          </div>
        </div>
      `;
      userJobList.insertAdjacentHTML("beforeend", jobCard);
    });
  }

  // COMPANY DASHBOARD (RECENT JOBS)
  const companyJobList = document.querySelector(".jobs-container1 .job-list1");
  if (companyJobList) {
    const recentJobs = [...jobs].sort((a, b) => b.id - a.id);
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
  }
  const companyJobList1 = document.querySelector(".recent-jobs .job-list");
  if (companyJobList1) {
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
      companyJobList1.insertAdjacentHTML("beforeend", jobCard);
    });

    const activeJobsCount = document.querySelector(
      ".dashboard-stats .stat-card:nth-child(1) .stat-value"
    );
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
            <span class="job-status ${job.status || "open"}">${
        job.status || "Open"
      }</span>
          </div>
          <p class="job-info">${job.salary} • ${
        job.year_of_experience
      } Years Experience</p>
          <p class="job-description-preview">${job.description.substring(
            0,
            150
          )}...</p>
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
            <a href="#" id="backLink">← Back to Jobs</a>
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
          <div id="applyForm">
            <div class="cv-input">
              <h3>Input your CV here:</h3>
              <input type="file" id="cvInput" name="cv" accept=".pdf,.doc,.docx" required />
              <p class="cv-note">Please upload your CV in PDF or Word format.</p>
            </div>
                      
            <div class="apply-section">
              <button id="applyBtn" type="submit" class="btn-primary btn-large">Apply Now</button>
            </div>
          </div>

          </div>
        `;
        const backLink = document.getElementById("backLink");
        if (backLink) {
          backLink.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            window.history.back(); // Go back one page.
          });
        }

        const applyBtn1 = document.getElementById("applyBtn");
        const cvInput = document.getElementById("cvInput");

        if (applyBtn1 && cvInput) {
          applyBtn1.addEventListener("click", function () {
            if (!cvInput.files.length) {
              showToast(
                "Please upload your CV before applying for this job",
                "warning"
              );
              return;
            }

            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser) {
              showToast("Please log in to apply for this job.", "warning");
              return;
            }

            const applications =
              JSON.parse(localStorage.getItem("applications")) || [];
            const alreadyApplied = applications.some(
              (app) => app.jobId == job.id && app.email === currentUser.email
            );

            if (alreadyApplied) {
              showToast("You have already applied for this job.", "warning");
              return;
            }

            const newApplication = {
              jobId: job.id,
              jobTitle: job.job_title,
              companyName: job.company_name,
              email: currentUser.email,
              appliedAt: new Date().toISOString(),
              status: "Pending Review",
            };

            applications.push(newApplication);
            localStorage.setItem("applications", JSON.stringify(applications));

            showToast("Application submitted successfully!", "success");

            const applicationEvent = new CustomEvent("applicationSubmitted", {
              detail: newApplication,
            });
            window.dispatchEvent(applicationEvent);
          });
        }
      } else {
        jobDetailsContainer.innerHTML = `<p>Job not found.</p>`;
      }
    } else {
      jobDetailsContainer.innerHTML = `<p>No job ID provided.</p>`;
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
///////////////////////////////////////////////////////////////////////////

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.backgroundColor =
    type === "error"
      ? "var(--danger-color)"
      : type === "warning"
      ? "var(--danger-color)"
      : "var(--success-color)";
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function saveJob(jobId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showToast("Please log in to save jobs", "warning");
        return;
    }

    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const alreadySaved = savedJobs.some(saved => saved.jobId === jobId && saved.userId === currentUser.id);

    if (alreadySaved) {
        showToast("Job already saved!", "warning");
        return;
    }

    savedJobs.push({
        jobId: jobId,
        userId: currentUser.id,
        savedAt: new Date().toISOString()
    });

    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    // console.log('Saved Jobs:', savedJobs); // For debugging purposes
    showToast("Job saved successfully!", "success");
}
