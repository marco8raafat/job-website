document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const id = document.querySelector(".input-id").value;
    const title = document.querySelector(".input-title").value;
    const salary = document.querySelector(".input-salary").value;
    const companyName = document.querySelector(".input-company-name").value;
    const experience = document.querySelector(".input-experience").value;
    const description = document.querySelector(".input-description").value;
    const status =
      document.querySelector('input[name="status"]:checked')?.value || "open";

    // Create new job object
    const newJob = {
      id: id,
      job_title: title,
      salary: `$${salary}`,
      company_name: companyName,
      year_of_experience: experience,
      description: description,
      status: status,
      posted_date: new Date().toLocaleDateString(),
    };

    // Get existing jobs from localStorage
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    // Check if job with this ID already exists
    const existingJobIndex = jobs.findIndex((job) => job.id == id);

    if (existingJobIndex !== -1) {
      // Update existing job
      jobs[existingJobIndex] = newJob;
      // alert("Job updated successfully!");
      showToast("Job updated successfully!", "success");

    } else {
      // Add new job
      jobs.push(newJob);
      // alert("Job added successfully!");
      showToast("Job added successfully!", "success");
      setTimeout(() => {
        localStorage.setItem("jobs", JSON.stringify(jobs));
        window.location.href = 'company-dashboard.html';
    }, 2000);
    }

    // Save back to localStorage

    // Redirect to company dashboard
    // window.location.href = "company-dashboard.html";
  });
});

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.backgroundColor = 
      type === 'error' ? 'var(--danger-color)' :
      type === 'warning' ? 'var(--danger-color)' :
      'var(--success-color)';
  toast.style.display = 'block';
  
  setTimeout(() => {
      toast.style.display = 'none';
  }, 3000);
}