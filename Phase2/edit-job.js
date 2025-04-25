document.addEventListener("DOMContentLoaded", function () {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("id");

  if (!jobId) {
    alert("No job ID provided.");
    window.location.href = "company-jobs.html";
    return;
  }

  const job = jobs.find((job) => job.id == jobId);

  if (!job) {
    alert("Job not found.");
    window.location.href = "company-jobs.html";
    return;
  }

  // Populate the form fields with the job's details
  document.getElementById("job-title").value = job.job_title;
  document.getElementById("salary").value = job.salary;
  document.getElementById("experience").value = job.year_of_experience;
  document.getElementById("job-status").value = job.status || "open";
  document.getElementById("job-description").value = job.description;

  // Handle form submission
  const editJobForm = document.getElementById("edit-job-form");
  editJobForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Update the job details
    job.job_title = document.getElementById("job-title").value;
    job.salary = document.getElementById("salary").value;
    job.year_of_experience = document.getElementById("experience").value;
    job.status = document.getElementById("job-status").value;
    job.description = document.getElementById("job-description").value;

    // Save the updated jobs array to localStorage
    const updatedJobs = jobs.map((j) => (j.id == jobId ? job : j));
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    alert("Job updated successfully!");
    window.location.href = "company-jobs.html";
  });
});
