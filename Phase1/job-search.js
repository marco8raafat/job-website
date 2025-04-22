document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const jobCards = document.querySelectorAll('.job-card');
    const jobTitleInput = searchForm.querySelector('input[name="job-title"]');
    const experienceInput = searchForm.querySelector('input[name="experience"]');
    const jobsContainer = document.querySelector('.job-list');
    
    // Create no results message element
    const noResultsMsg = document.createElement('div');
    noResultsMsg.className = 'no-results';
    noResultsMsg.textContent = 'No Jobs Match Your Search Criteria';
    jobsContainer.appendChild(noResultsMsg);

    // Function to extract years from job info
    function getYearsFromJob(jobText) {
        const rangeMatch = jobText.match(/(\d+)-(\d+) Years Experience/);
        const minMatch = jobText.match(/(\d+)\+ Years Experience/);
        
        if (rangeMatch) {
            return {
                min: parseInt(rangeMatch[1]),
                max: parseInt(rangeMatch[2])
            };
        } 
        else if (minMatch) {
            return {
                min: parseInt(minMatch[1]),
                max: Infinity
            };
        }
        return { min: 0, max: 0 };
    }

    // Function to filter jobs
    function filterJobs() {
        const jobTitle = jobTitleInput.value.toLowerCase();
        const experience = experienceInput.value;
        let visibleCount = 0;
        
        jobCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const expText = card.querySelector('.job-info').textContent;
            const years = getYearsFromJob(expText);
            
            // Show/hide based on search criteria
            const titleMatch = jobTitle === '' || title.includes(jobTitle);
            const expMatch = experience === '' || (years.min <= parseInt(experience) && years.max >= parseInt(experience));
            if (titleMatch && expMatch) {
                card.style.display = 'block';
                visibleCount++;
            } 
            else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        noResultsMsg.style.display = (visibleCount === 0 && (jobTitle || experience)) ? 'block' : 'none';
    }
    
    // Instant live search
    jobTitleInput.addEventListener('input', filterJobs);
    experienceInput.addEventListener('input', filterJobs);
    
    // Prevent form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filterJobs();
    });
    
    // Reset when both inputs are empty
    function checkForEmptySearch() {
        if (jobTitleInput.value === '' && experienceInput.value === '') {
            jobCards.forEach(card => card.style.display = 'block');
            noResultsMsg.style.display = 'none';
        }
    }
    
    jobTitleInput.addEventListener('input', checkForEmptySearch);
    experienceInput.addEventListener('input', checkForEmptySearch);
});