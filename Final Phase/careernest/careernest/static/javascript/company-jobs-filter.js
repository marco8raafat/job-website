document.addEventListener('DOMContentLoaded', function() {
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', filterJobs);
  }
  
  function filterJobs() {
    const status = statusFilter.value;
    const jobCards = document.querySelectorAll('.job-list1 .job-card');
    
    jobCards.forEach(card => {
      const jobStatus = card.querySelector('.job-status').textContent.toLowerCase();
      
      if (status === 'all' || jobStatus === status) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
}); 