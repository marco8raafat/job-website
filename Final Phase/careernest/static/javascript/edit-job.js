document.addEventListener("DOMContentLoaded", function () {
  // Get job ID from URL path instead of query parameter
  const pathParts = window.location.pathname.split('/');
  // The URL format is /edit-job/{id}/
  const jobId = pathParts[pathParts.length - 2];

  if (!jobId) {
    showToast("No job ID provided.", "error");
    setTimeout(() => {
      window.location.href = "/company-jobs/";
    }, 2000);
    return;
  }

  // Fetch job details from the server
  fetch(`/api/get-job/${jobId}/`)
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        showToast("Job not found.", "error");
        setTimeout(() => {
          window.location.href = "/company-jobs/";
        }, 2000);
        return;
      }

      // Populate the form fields
      document.getElementById("job-title").value = data.job_title;
      document.getElementById("salary").value = data.salary;
      document.getElementById("experience").value = data.year_of_experience;
      document.getElementById("job-status").value = data.status || "open";
      document.getElementById("job-description").value = data.description;
      
      console.log("Job data loaded:", data);
    })
    .catch(error => {
      console.error("Error fetching job:", error);
      showToast("Error loading job details.", "error");
    });

  // Handle form submission
  const editJobForm = document.getElementById("edit-job-form");
  editJobForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const formData = new FormData(editJobForm);
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    fetch(`/api/update-job/${jobId}/`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': csrfToken
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showToast("Job updated successfully!", "success");
        setTimeout(() => {
          window.location.href = "/company-jobs/";
        }, 2000);
      } else {
        showToast(data.error || "Failed to update job", "error");
      }
    })
    .catch(error => {
      console.error("Error updating job:", error);
      showToast("Error updating job", "error");
    });
  });
});

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
