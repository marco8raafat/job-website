document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    
    const title = document.querySelector(".input-title").value;
    const salary = document.querySelector(".input-salary").value;
    const companyName = document.querySelector(".input-company-name").value;
    const experience = document.querySelector(".input-experience").value;
    const description = document.querySelector(".input-description").value;
    const status = document.querySelector('input[name="status"]:checked')?.value || "open";

    // Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    formData.append('Salary', salary);
    formData.append('company name', companyName);
    formData.append('Experience', experience);
    formData.append('description', description);
    formData.append('status', status);

    // Get CSRF token from the form
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Send data to server
    fetch('/api/create-job/', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': csrfToken, // Use the token from the form
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showToast(data.message || "Job added successfully!", "success");
        setTimeout(() => {
          window.location.href = "/company-dashboard/";
        }, 2000);
      } else {
        showToast(data.error || "Failed to add job", "error");
        console.error("Error:", data.error);
      }
    })
    .catch(error => {
      showToast("An error occurred: " + error.message, "error");
      console.error("Fetch error:", error);
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
