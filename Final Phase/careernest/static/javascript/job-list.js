document.addEventListener("DOMContentLoaded", function() {
  // Fetch all jobs
  fetchAllJobs();
  
  // Set up search functionality
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const jobTitle = document.querySelector('input[name="job-title"]').value.trim().toLowerCase();
      const experience = document.querySelector('input[name="experience"]').value;
      
      filterJobs(jobTitle, experience);
    });
  }
  
  function fetchAllJobs() {
    // Show loading indicator
    const jobList = document.querySelector(".job-list");
    if (jobList) {
      jobList.innerHTML = '<p class="loading">Loading jobs...</p>';
    }
    
    fetch('/api/get-all-jobs/')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          displayJobs(data.jobs);
        } else {
          console.error("Error fetching jobs:", data.error);
          jobList.innerHTML = '<p class="no-jobs">Failed to load jobs. Please try again later.</p>';
        }
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        if (jobList) {
          jobList.innerHTML = '<p class="no-jobs">Failed to load jobs. Please try again later.</p>';
        }
      });
  }
  
  function displayJobs(jobs) {
    const jobList = document.querySelector(".job-list");
    
    if (!jobList) return;
    
    if (jobs.length === 0) {
      jobList.innerHTML = '<p class="no-jobs">No jobs available at the moment.</p>';
      return;
    }
    
    jobList.innerHTML = '';
    
    // Store the jobs in a global variable for filtering
    window.allJobs = jobs;
    
    jobs.forEach(job => {
      const jobCard = createJobCard(job);
      jobList.insertAdjacentHTML("beforeend", jobCard);
    });
  }
  
  function createJobCard(job) {
    return `
      <div class="job-card" data-title="${job.job_title.toLowerCase()}" data-experience="${job.year_of_experience}">
        <div class="job-header">
          <h3>${job.job_title}</h3>
          <span class="company-name">${job.company_name}</span>
        </div>
        <p class="job-info">${job.salary} • ${job.year_of_experience} Years Experience</p>
        <p class="job-description-preview">${job.description.substring(0, 150)}${job.description.length > 150 ? '...' : ''}</p>
        <div class="job-buttons">
          <a href="/job-details/?id=${job.id}" class="btn-primary">View Details</a>
        </div>
      </div>
    `;
  }
  
  function filterJobs(title, experience) {
    const jobs = window.allJobs || [];
    const jobList = document.querySelector(".job-list");
    
    if (!jobList || jobs.length === 0) return;
    
    jobList.innerHTML = '';
    
    const filteredJobs = jobs.filter(job => {
      const matchesTitle = !title || job.job_title.toLowerCase().includes(title);
      const matchesExperience = !experience || job.year_of_experience <= parseInt(experience);
      return matchesTitle && matchesExperience;
    });
    
    if (filteredJobs.length === 0) {
      jobList.innerHTML = '<p class="no-jobs">No jobs match your search criteria.</p>';
      return;
    }
    
    filteredJobs.forEach(job => {
      const jobCard = createJobCard(job);
      jobList.insertAdjacentHTML("beforeend", jobCard);
    });
  }
});

function saveJob(jobId) {
  const username = sessionStorage.getItem('username');
  if (!username) {
    showToast("Please log in to save jobs", "warning");
    return;
  }

  // Here you would typically call an API to save the job
  // For now, we'll just show a success message
  showToast("Job saved successfully!", "success");
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  
  toast.textContent = message;
  toast.style.backgroundColor =
    type === "error"
      ? "var(--danger-color)"
      : type === "warning"
      ? "var(--warning-color)"
      : "var(--success-color)";
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
} 