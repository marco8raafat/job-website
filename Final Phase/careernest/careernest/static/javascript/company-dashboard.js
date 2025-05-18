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
    // Fetch jobs for this company
    fetch('/api/get-jobs/')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.jobs && data.jobs.length > 0) {
          // Update active jobs count
          const activeJobsCount = document.querySelector(
            ".dashboard-stats .stat-card:nth-child(1) .stat-value"
          );
          if (activeJobsCount) {
            const openJobs = data.jobs.filter(job => job.status === 'open').length;
            activeJobsCount.textContent = openJobs;
          }
          
          // Update recent jobs count
          const recentJobsCount = document.querySelector(
            ".dashboard-stats .stat-card:nth-child(3) .stat-value"
          );
          if (recentJobsCount) {
            recentJobsCount.textContent = data.jobs.length;
          }
          
          // Display recent jobs (up to 5)
          const recentJobs = data.jobs.slice(0, 5);
          companyJobList1.innerHTML = recentJobs.map(job => `
            <div class="job-card">
              <div class="job-card-header">
                <h3>${job.job_title}</h3>
                <span class="job-status ${job.status}">${job.status}</span>
              </div>
              <div class="job-card-body">
                <p class="job-company">${job.company_name}</p>
                <p class="job-salary">${job.salary}</p>
                <p class="job-experience">${job.year_of_experience} Years Experience</p>
              </div>
              <div class="job-card-footer">
                <p class="job-date">Posted: ${job.posted_date}</p>
                <a href="/edit-job/${job.id}" class="btn-secondary">Edit</a>
              </div>
            </div>
          `).join('');
          
          // Remove loading message
          const loadingMessage = companyJobList1.querySelector('.loading');
          if (loadingMessage) {
            loadingMessage.remove();
          }
        } else {
          companyJobList1.innerHTML = "<p>No recent jobs.</p>";
        }
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        companyJobList1.innerHTML = "<p>Error loading jobs.</p>";
      });
  }

  // COMPANY JOBS PAGE (ALL JOBS)
  const companyJobsList = document.querySelector(".job-list1");
  if (companyJobsList) {
    // Show loading
    companyJobsList.innerHTML = '<p class="loading">Loading jobs...</p>';

    fetch('/api/get-jobs/')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.jobs && data.jobs.length > 0) {
          companyJobsList.innerHTML = data.jobs.map(job => `
            <div class="job-card">
              <div class="job-card-header">
                <h3>${job.job_title}</h3>
                <span class="job-status ${job.status}">${job.status}</span>
              </div>
              <div class="job-card-body">
                <p class="job-company">${job.company_name}</p>
                <p class="job-salary">${job.salary}</p>
                <p class="job-experience">${job.year_of_experience} Years Experience</p>
              </div>
              <div class="job-card-footer">
                <p class="job-date">Posted: ${job.posted_date}</p>
                <a href="/edit-job/${job.id}/" class="btn-secondary">Edit</a>
                <button onclick="deleteJob(${job.id})" class="btn-danger">Delete</button>
              </div>
            </div>
          `).join('');
        } else {
          companyJobsList.innerHTML = '<p class="no-jobs">No jobs posted yet. <a href="/add-job/">Post your first job</a></p>';
        }
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        companyJobsList.innerHTML = '<p class="no-jobs">Failed to load jobs. Please try again later.</p>';
      });
  }

  // JOB DETAILS PAGE
  const jobDetailsContainer = document.querySelector(".job-details");
  if (jobDetailsContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("id");
    
    if (jobId) {
      fetch(`/api/get-job/${jobId}/`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const job = data;
            jobDetailsContainer.innerHTML = `
              <div class="job-header-details">
                <div class="back-link">
                  <a href="#" id="backLink">← Back to Jobs</a>
                </div>
                <h1>${job.job_title}</h1>
                <div class="company-info">
                  <span class="company-name">${job.company_name}</span>
                  <span class="job-status ${job.status || "open"}">${job.status || "Open"}</span>
                </div>
                <div class="job-meta">
                  <p class="salary">${job.salary}</p>
                  <p class="experience">${job.year_of_experience} Years Experience</p>
                  <p class="date">Posted: ${job.posted_date}</p>
                </div>
              </div>

              <div class="job-description">
                <h2>Job Description</h2>
                <p>${job.description}</p>
              </div>
              
              <div id="applyForm">
                <div class="cv-input">
                  <h3>Input your CV here:</h3>
                  <input type="file" id="cvInput" name="cv" accept=".pdf" required />
                  <p class="cv-note">Please upload your CV in PDF format only.</p>
                </div>
                        
                <div class="apply-section">
                  <button id="applyBtn" type="submit" class="btn-primary btn-large">Apply Now</button>
                </div>
              </div>
            `;
            
            // Add event listener to apply button
            const applyBtn = document.getElementById("applyBtn");
            const cvInput = document.getElementById("cvInput");
            
            if (applyBtn && cvInput) {
              applyBtn.addEventListener("click", function() {
                if (!cvInput.files.length) {
                  showToast("Please upload your CV before applying", "warning");
                  return;
                }
                
                // Create FormData to send both the file and job data
                const formData = new FormData();
                formData.append('cv', cvInput.files[0]);
                formData.append('job_id', jobId);
                
                // Submit the application
                fetch('/api/submit-application/', {
                  method: 'POST',
                  headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                  },
                  body: formData
                })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    showToast("Application submitted successfully!", "success");
                    
                    // Dispatch event with updated application count
                    const event = new CustomEvent('applicationSubmitted', {
                      detail: {
                        total_applications: data.total_applications
                      }
                    });
                    window.dispatchEvent(event);
                    
                    // Disable apply button after successful submission
                    applyBtn.disabled = true;
                    applyBtn.textContent = "Applied";
                  } else {
                    showToast(data.error || "Failed to submit application", "error");
                  }
                })
                .catch(error => {
                  console.error("Error submitting application:", error);
                  showToast("Error submitting application", "error");
                });
              });
            }
            
            // Add back button functionality
            const backLink = document.getElementById("backLink");
            if (backLink) {
              backLink.addEventListener("click", function(e) {
                e.preventDefault();
                window.history.back();
              });
            }
          } else {
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
              backLink.addEventListener("click", function(e) {
                e.preventDefault();
                window.history.back();
              });
            }
          }
        })
        .catch(error => {
          console.error("Error fetching job details:", error);
          showToast("Error loading job details", "error");
        });
    }
  }
});

// Listen for application submission events
window.addEventListener('applicationSubmitted', function(event) {
  const totalApplications = event.detail.total_applications;
  const applicationsCount = document.querySelector('.dashboard-stats .stat-card:nth-child(2) .stat-value');
  if (applicationsCount) {
    applicationsCount.textContent = totalApplications;
  }
});

function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job?")) {
    fetch(`/api/delete-job/${jobId}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showToast("Job deleted successfully", "success");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast("Failed to delete job: " + data.error, "error");
        }
      })
      .catch((error) => {
        showToast("An error occurred: " + error.message, "error");
      });
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

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}