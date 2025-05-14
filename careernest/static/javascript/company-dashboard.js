document.addEventListener("DOMContentLoaded", function() {
  // Fetch jobs from the server
  fetchJobs();

  function fetchJobs() {
    // Show loading indicator
    const recentJobsList = document.querySelector(".recent-jobs .job-list");
    if (recentJobsList) {
      recentJobsList.innerHTML = '<p class="loading">Loading jobs...</p>';
    }
    
    const allJobsList = document.querySelector(".jobs-container1 .job-list1");
    if (allJobsList) {
      allJobsList.innerHTML = '<p class="loading">Loading jobs...</p>';
    }
    
    fetch('/api/get-jobs/')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          displayJobs(data.jobs);
          updateStats(data.jobs);
        } else {
          console.error("Error fetching jobs:", data.error);
          
          // Display authentication error message if relevant
          if (data.error && data.error.includes("Authentication")) {
            const message = '<p class="no-jobs">Please <a href="/login/">log in</a> as a company to view your jobs.</p>';
            if (recentJobsList) recentJobsList.innerHTML = message;
            if (allJobsList) allJobsList.innerHTML = message;
          } else {
            showToast("Failed to load jobs: " + data.error, "error");
            if (recentJobsList) recentJobsList.innerHTML = '<p class="no-jobs">Failed to load jobs</p>';
            if (allJobsList) allJobsList.innerHTML = '<p class="no-jobs">Failed to load jobs</p>';
          }
        }
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        showToast("Failed to load jobs. Please try again later.", "error");
        if (recentJobsList) recentJobsList.innerHTML = '<p class="no-jobs">Failed to load jobs</p>';
        if (allJobsList) allJobsList.innerHTML = '<p class="no-jobs">Failed to load jobs</p>';
      });
  }

  function displayJobs(jobs) {
    // Display recent jobs on company dashboard
    const recentJobsList = document.querySelector(".recent-jobs .job-list");
    if (recentJobsList) {
      // Take only the 3 most recent jobs
      const recentJobs = [...jobs].sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date)).slice(0, 3);
      
      if (recentJobs.length === 0) {
        recentJobsList.innerHTML = '<p class="no-jobs">No jobs posted yet. <a href="/add-job/">Post your first job</a></p>';
        return;
      }
      
      recentJobsList.innerHTML = '';
      recentJobs.forEach(job => {
        const jobCard = `
          <div class="job-card">
            <div class="job-header">
              <h3>${job.job_title}</h3>
              <span class="job-status ${job.status || "open"}">${job.status || "Open"}</span>
            </div>
            <p class="job-info">${job.salary} • ${job.year_of_experience} Years Experience</p>
            <div class="job-actions">
                <a href="/edit-job/${job.id}/" class="btn-secondary">Edit</a> 
              <a href="#" class="btn-danger" onclick="deleteJob(${job.id}); return false;">Delete</a>
            </div>
          </div>
        `;
        recentJobsList.insertAdjacentHTML("beforeend", jobCard);
      });
    }

    // Display all jobs on company jobs page
    const allJobsList = document.querySelector(".jobs-container1 .job-list1");
    if (allJobsList) {
      if (jobs.length === 0) {
        allJobsList.innerHTML = '<p class="no-jobs">No jobs posted yet. <a href="/add-job/">Post your first job</a></p>';
        return;
      }
      
      allJobsList.innerHTML = '';
      jobs.forEach(job => {
        const jobCard = `
          <div class="job-card">
            <div class="job-header">
              <h3>${job.job_title}</h3>
              <span class="job-status ${job.status || "open"}">${job.status || "Open"}</span>
            </div>
            <p class="job-info">${job.salary} • ${job.year_of_experience} Years Experience</p>
            <div class="job-actions">
            
              <a href="/edit-job/${job.id}/" class="btn-secondary">Edit</a> 
              
              <a href="#" class="btn-danger" onclick="deleteJob(${job.id}); return false;">Delete</a>
            </div>
          </div>
        `;
        allJobsList.insertAdjacentHTML("beforeend", jobCard);
      });
    }
  }

  function updateStats(jobs) {
    // Update dashboard stats
    const activeJobsCount = document.querySelector(".dashboard-stats .stat-card:nth-child(1) .stat-value");
    if (activeJobsCount) {
      const openJobs = jobs.filter(job => job.status !== "closed").length;
      activeJobsCount.textContent = openJobs;
    }

    // Applications count could be fetched separately in a real app
    const applicationsCount = document.querySelector(".dashboard-stats .stat-card:nth-child(2) .stat-value");
    if (applicationsCount) {
      // This would ideally come from the server
      applicationsCount.textContent = "0";
    }

    // Recent jobs count
    const recentJobsCount = document.querySelector(".dashboard-stats .stat-card:nth-child(3) .stat-value");
    if (recentJobsCount) {
      const recentJobs = jobs.length > 3 ? 3 : jobs.length;
      recentJobsCount.textContent = recentJobs;
    }
  }
});

function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job?")) {
    fetch(`/api/delete-job/${jobId}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showToast("Job deleted successfully", "success");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast("Failed to delete job: " + data.error, "error");
      }
    })
    .catch(error => {
      showToast("An error occurred: " + error.message, "error");
    });
  }
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) {
    // Create toast element if it doesn't exist
    const toastElement = document.createElement("div");
    toastElement.id = "toast";
    toastElement.className = "toast";
    document.body.appendChild(toastElement);
    toast = toastElement;
  }
  
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

// Helper function to get CSRF token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
} 