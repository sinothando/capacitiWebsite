// Sample job data
const jobsData = [
    {
        id: 1,
        title: "CAPACITI - IT Demand Learnership Programmes 2025 (CPT)",
        location: "Cape Town",
        salary: "ZAR4k - R5k / month",
        description: "Join our comprehensive IT Demand Learnership Programme in Cape Town. This 12-month programme combines theoretical learning with practical experience in software development, data analysis, and IT support. Successful candidates will receive industry-recognized certifications and guaranteed employment opportunities with our partner companies.",
        requirements: [
            "Grade 12 or equivalent qualification",
            "South African citizen between 18-35 years",
            "Basic computer literacy",
            "Strong communication skills",
            "Passion for technology and learning"
        ],
        benefits: [
            "Monthly stipend of R4,000 - R5,000",
            "Industry certifications",
            "Guaranteed employment opportunities",
            "Mentorship and career guidance",
            "Transportation allowance"
        ]
    },
    {
        id: 2,
        title: "CAPACITI - IT Demand Learnership Programmes 2025 (JHB)",
        location: "Johannesburg",
        salary: "ZAR4k - R5k / month",
        description: "Join our comprehensive IT Demand Learnership Programme in Johannesburg. This 12-month programme combines theoretical learning with practical experience in software development, data analysis, and IT support. Successful candidates will receive industry-recognized certifications and guaranteed employment opportunities with our partner companies.",
        requirements: [
            "Grade 12 or equivalent qualification",
            "South African citizen between 18-35 years",
            "Basic computer literacy",
            "Strong communication skills",
            "Passion for technology and learning"
        ],
        benefits: [
            "Monthly stipend of R4,000 - R5,000",
            "Industry certifications",
            "Guaranteed employment opportunities",
            "Mentorship and career guidance",
            "Transportation allowance"
        ]
    }
];

// Global variables
let currentJobId = null;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up job portal...');
    
    // Load jobs on page load
    loadJobs();
    
    // Setup modal event listeners
    setupModalEventListeners();
    
    // Setup navigation
    setupNavigation();
    
    // Test if modal exists
    const modal = document.getElementById('applicationModal');
    console.log('Application modal found:', !!modal);
    
    // Also set up any existing Apply buttons
    setupExistingApplyButtons();
});

// Load and display jobs
function loadJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    
    if (!jobsContainer) return;
    
    try {
        // Show loading state
        if (loadingElement) loadingElement.style.display = 'block';
        if (errorElement) errorElement.style.display = 'none';
        
        // Keep existing static jobs but make sure their buttons work
        const existingButtons = jobsContainer.querySelectorAll('button[onclick*="openApplicationModal"]');
        existingButtons.forEach(button => {
            // Extract job ID from onclick attribute
            const onclickAttr = button.getAttribute('onclick');
            const jobIdMatch = onclickAttr.match(/openApplicationModal\((\d+)\)/);
            if (jobIdMatch) {
                const jobId = parseInt(jobIdMatch[1]);
                // Remove onclick and add proper event listener
                button.removeAttribute('onclick');
                button.addEventListener('click', () => openApplicationModal(jobId));
            }
        });
        
        // Hide loading state
        if (loadingElement) loadingElement.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        
        // Show error state
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'block';
    }
}

// Create job card element
function createJobCard(job) {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    jobCard.innerHTML = `
        <div class="job-header">
            <div class="job-details">
                <h3 class="job-title">${escapeHtml(job.title)}</h3>
                <p class="job-location">${escapeHtml(job.location)}, ${escapeHtml(job.salary)}</p>
            </div>
            <div class="job-actions">
                <button class="btn btn-primary" onclick="openApplicationModal(${job.id})">Apply</button>
            </div>
        </div>
    `;
    
    return jobCard;
}

// Scroll to jobs section
function scrollToJobs() {
    const jobsSection = document.getElementById('opportunities');
    if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Open application modal
function openApplicationModal(jobId) {
    console.log('Opening modal for job ID:', jobId);
    currentJobId = jobId;
    const job = jobsData.find(j => j.id === jobId);
    
    if (!job) {
        console.error('Job not found:', jobId);
        return;
    }
    
    console.log('Found job:', job);
    
    // Populate job details in modal
    populateJobDetails(job);
    
    // Show modal
    const modal = document.getElementById('applicationModal');
    console.log('Modal element:', modal);
    
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        console.log('Modal should be visible now');
    } else {
        console.error('Modal element not found!');
        // Fallback: alert the user about the issue
        alert('Unable to open application form. Please refresh the page and try again.');
    }
}

// Populate job details in modal
function populateJobDetails(job) {
    const modalJobDetails = document.getElementById('modalJobDetails');
    if (!modalJobDetails) return;
    
    modalJobDetails.innerHTML = `
        <h4>${escapeHtml(job.title)}</h4>
        <p class="job-meta"><strong>Location:</strong> ${escapeHtml(job.location)}</p>
        <p class="job-meta"><strong>Salary:</strong> ${escapeHtml(job.salary)}</p>
        <div class="job-description">
            <p><strong>Description:</strong></p>
            <p>${escapeHtml(job.description)}</p>
            
            <p><strong>Requirements:</strong></p>
            <ul>
                ${job.requirements.map(req => `<li>${escapeHtml(req)}</li>`).join('')}
            </ul>
            
            <p><strong>Benefits:</strong></p>
            <ul>
                ${job.benefits.map(benefit => `<li>${escapeHtml(benefit)}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Submit application
async function submitApplication(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['applicantName', 'email', 'resume'];
    for (const field of requiredFields) {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return;
        }
    }
    
    // Validate email
    const email = formData.get('email');
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Set loading state
    setSubmitButtonLoading(true);
    
    try {
        // Prepare application data
        const applicationData = {
            jobId: currentJobId,
            applicantName: formData.get('applicantName'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            resume: formData.get('resume')
        };
        
        // Submit to backend
        const response = await fetch(`/api/jobs/${currentJobId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        // Success - show success modal
        closeModal();
        showSuccessModal();
        resetForm();
        
    } catch (error) {
        console.error('Error submitting application:', error);
        alert('There was an error submitting your application. Please try again.');
    } finally {
        setSubmitButtonLoading(false);
    }
}

// Set submit button loading state
function setSubmitButtonLoading(loading) {
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton?.querySelector('.button-text');
    const loadingSpinner = submitButton?.querySelector('.loading-spinner');
    
    if (submitButton) {
        submitButton.disabled = loading;
        
        if (buttonText) {
            buttonText.style.display = loading ? 'none' : 'inline';
        }
        
        if (loadingSpinner) {
            loadingSpinner.style.display = loading ? 'inline' : 'none';
        }
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById('applicationForm');
    if (form) {
        form.reset();
    }
    currentJobId = null;
}

// Show modal
function showModal(modal) {
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    resetForm();
}

// Show success modal
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('show');
        successModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close success modal
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('show');
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Setup modal event listeners
function setupModalEventListeners() {
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const applicationModal = document.getElementById('applicationModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === applicationModal) {
            closeModal();
        }
        
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
            closeSuccessModal();
        }
    });
}

// Setup navigation
function setupNavigation() {
    // Mobile hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu if open
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Setup existing Apply buttons in the HTML
function setupExistingApplyButtons() {
    console.log('Setting up existing apply buttons...');
    
    // Find all Apply buttons
    const applyButtons = document.querySelectorAll('button');
    console.log('Found buttons:', applyButtons.length);
    
    applyButtons.forEach((button, index) => {
        console.log(`Button ${index}:`, button.textContent, button.getAttribute('onclick'));
        
        if (button.textContent.trim() === 'Apply') {
            const onclickAttr = button.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('openApplicationModal')) {
                const jobIdMatch = onclickAttr.match(/openApplicationModal\((\d+)\)/);
                if (jobIdMatch) {
                    const jobId = parseInt(jobIdMatch[1]);
                    console.log(`Setting up button for job ID: ${jobId}`);
                    
                    // Remove onclick and add event listener
                    button.removeAttribute('onclick');
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(`Button clicked for job ID: ${jobId}`);
                        openApplicationModal(jobId);
                    });
                }
            }
        }
    });
}

// Test function to manually open modal
function testModal() {
    console.log('Testing modal...');
    openApplicationModal(1);
}

// Export functions for global access
window.openApplicationModal = openApplicationModal;
window.closeModal = closeModal;
window.closeSuccessModal = closeSuccessModal;
window.submitApplication = submitApplication;
window.scrollToJobs = scrollToJobs;
window.testModal = testModal;