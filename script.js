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
            "Mentorship and career guidance"
        ]
    },
    {
        id: 2,
        title: "CAPACITI - Graduate Accelerator Programmes 2025 (JHB)",
        location: "Johannesburg",
        salary: "ZAR4k - R5k / month",
        description: "The CAPACITI - Graduate Accelerator Programmes are designed to equip candidates with the necessary skills and knowledge required to thrive in tech industry. This Programme will cover topics, including Support Services, Systems Development, Communication Networks, Data Science, Cybersecurity, AI/Machine Learning and more, preparing participants for various roles in the tech industry.",
        requirements: [
            "Provide your Academic Record and certificate of Highest academic achievement.",
            "No criminal record and a clear credit history.",
            "Meet the minimum NQF level qualification - NQF 5 in Support Services, Systems Development, Communication Networks, Data Science, Cybersecurity, AI/Machine Learning.",
            "Strong communication skills",
            "Passion for technology and learning",
            "South African Nationality",
            "Between the age range of 18 to 34 years old"
        ],
        benefits: [
            "Monthly stipend of R4,000 - R5,000",
            "Industry certifications",
            "Guaranteed employment opportunities",
            "Mentorship and career guidance"
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

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    const form = document.getElementById('applicationForm');
    if (form) {
        form.reset(); // Optional: reset all fields
    }
}

// Branch locations data
const branchLocations = [
    {
        id: 1,
        name: "Braamfontein Branch",
        address: "19 Ameshoff St, Braamfontein",
        fullAddress: "19 Ameshoff St, Braamfontein, Johannesburg, 2000",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.666!2d28.03533!3d-26.19167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s19%20Ameshoff%20St%2C%20Braamfontein%2C%20Johannesburg%2C%202000!5e0!3m2!1sen!2sza"
    },
    {
        id: 2,
        name: "Salt River Branch", 
        address: "97 Durham Ave, Salt River",
        fullAddress: "97 Durham Ave, Salt River, Cape Town, 7925",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.095!2d18.48278!3d-33.93556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s97%20Durham%20Ave%2C%20Salt%20River%2C%20Cape%20Town%2C%207925!5e0!3m2!1sen!2sza"
    },
    {
        id: 3,
        name: "Hollard City Campus",
        address: "13th Floor, 19 Ameshof Road",
        fullAddress: "13th Floor, Hollard City Campus, 19 Ameshof Road, Braamfontein",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.778!2d28.03611!3d-26.19278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s19%20Ameshof%20Rd%2C%20Braamfontein%2C%20Johannesburg%2C%202000!5e0!3m2!1sen!2sza"
    }
];

// Global variables
let currentLocationIndex = 0;
let rotationInterval;
let isAnimating = false;

// DOM elements
const locationName = document.getElementById('locationName');
const locationAddress = document.getElementById('locationAddress');
const mapTitle = document.getElementById('mapTitle');
const mapFrame = document.getElementById('mapFrame');
const mapContainer = document.getElementById('mapContainer');
const locationInfo = document.getElementById('locationInfo');
const dots = document.querySelectorAll('.dot');
const newsletterForm = document.getElementById('newsletterForm');
const toast = document.getElementById('toast');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLocationRotation();
    initializeFormHandling();
    initializeDotNavigation();
});

/**
 * Initialize automatic location rotation
 */
function initializeLocationRotation() {
    // Set initial location
    updateLocation(0);
    
    // Start auto-rotation every 6 seconds
    rotationInterval = setInterval(() => {
        if (!isAnimating) {
            const nextIndex = (currentLocationIndex + 1) % branchLocations.length;
            changeLocation(nextIndex);
        }
    }, 6000);
}

/**
 * Update location information and map
 * @param {number} index - Index of the location to display
 */
function updateLocation(index) {
    const location = branchLocations[index];
    
    // Update text content
    locationName.textContent = location.name;
    locationAddress.textContent = location.fullAddress;
    mapTitle.textContent = location.name;
    
    // Update map
    mapFrame.src = location.mapEmbedUrl;
    mapFrame.title = `Map of ${location.name}`;
    
    // Update dots
    updateDots(index);
    
    currentLocationIndex = index;
}

/**
 * Change location with smooth animation
 * @param {number} newIndex - Index of the new location
 */
function changeLocation(newIndex) {
    if (isAnimating || newIndex === currentLocationIndex) return;
    
    isAnimating = true;
    
    // Add fade-out animation
    locationInfo.classList.add('fade-out');
    mapTitle.classList.add('fade-out');
    mapContainer.classList.add('fade-out');
    
    setTimeout(() => {
        // Update content
        updateLocation(newIndex);
        
        // Remove fade-out and add fade-in
        locationInfo.classList.remove('fade-out');
        mapTitle.classList.remove('fade-out');
        mapContainer.classList.remove('fade-out');
        
        isAnimating = false;
    }, 300); // Half of the CSS transition duration
}

/**
 * Update active dot indicator
 * @param {number} activeIndex - Index of the active location
 */
function updateDots(activeIndex) {
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Initialize dot navigation
 */
function initializeDotNavigation() {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Pause auto-rotation temporarily
            clearInterval(rotationInterval);
            
            // Change to selected location
            changeLocation(index);
            
            // Resume auto-rotation after 10 seconds
            setTimeout(() => {
                rotationInterval = setInterval(() => {
                    if (!isAnimating) {
                        const nextIndex = (currentLocationIndex + 1) % branchLocations.length;
                        changeLocation(nextIndex);
                    }
                }, 6000);
            }, 10000);
        });
    });
}

/**
 * Initialize form handling
 */
function initializeFormHandling() {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Validate form
        if (!firstName || !surname || !email) {
            showToast('Please fill in all fields to join our ecosystem.', 'error');
            return;
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        submitNewsletter(firstName, surname, email);
    });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Submit newsletter form
 * @param {string} firstName - First name
 * @param {string} surname - Surname  
 * @param {string} email - Email address
 */
function submitNewsletter(firstName, surname, email) {
    // Show loading state
    const submitButton = newsletterForm.querySelector('.join-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'JOINING...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showToast(`Welcome to our ecosystem, ${firstName}! You've successfully joined our newsletter.`, 'success');
        
        // Reset form
        document.getElementById('firstName').value = '';
        document.getElementById('surname').value = '';
        document.getElementById('email').value = '';
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Log for demonstration (in real app, this would be sent to server)
        console.log('Newsletter signup:', { firstName, surname, email });
    }, 1500);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast ('success' or 'error')
 */
function showToast(message, type = 'success') {
    const toastMessage = document.getElementById('toastMessage');
    
    // Set message and type
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/**
 * Handle window resize for responsive behavior
 */
window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        // Force map refresh on resize to prevent display issues
        if (mapFrame.src) {
            const currentSrc = mapFrame.src;
            mapFrame.src = '';
            setTimeout(() => {
                mapFrame.src = currentSrc;
            }, 100);
        }
    }, 250);
});

/**
 * Handle page visibility changes (pause rotation when tab is not active)
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause rotation when tab is not visible
        clearInterval(rotationInterval);
    } else {
        // Resume rotation when tab becomes visible
        if (!rotationInterval) {
            rotationInterval = setInterval(() => {
                if (!isAnimating) {
                    const nextIndex = (currentLocationIndex + 1) % branchLocations.length;
                    changeLocation(nextIndex);
                }
            }, 6000);
        }
    }
});

/**
 * Clean up intervals when page is unloaded
 */
window.addEventListener('beforeunload', function() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Allow keyboard navigation for dots
    if (e.target.classList.contains('dot')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Add focus indicators for better accessibility
dots.forEach(dot => {
    dot.addEventListener('focus', function() {
        this.style.outline = '2px solid #f97316';
        this.style.outlineOffset = '2px';
    });
    
    dot.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Smooth scroll behavior for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

 // grab elements
  const partnerBtn = document.querySelector('.get-involved .contact-btn');
  const overlay   = document.getElementById('partner-form-overlay');
  const closeBtn  = document.getElementById('close-form-btn');

  // show overlay when "Partner With Us Today" is clicked
  partnerBtn.addEventListener('click', function(e) {
    e.preventDefault();        // prevent default <a> jump
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  // hide overlay on close
  closeBtn.addEventListener('click', function() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  });

  // also hide if user clicks outside the form
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      document.body.style.overflow = ''; 
    }
  });

  document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    overlay.classList.add('hidden');
  }
});

// Chatbot Functions
function toggleChat() {
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.classList.toggle("open");
}

function closeChat() {
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.classList.remove("open");
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (message === "") return;

    addMessage("You", message);
    input.value = "";

    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage("Bot", response);
    }, 500);
}

function addMessage(sender, text) {
    const chatMessages = document.getElementById("chatMessages");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(
        "message",
        sender === "Bot" ? "bot-message" : "user-message",
    );

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${sender === "Bot" ? "fa-robot" : "fa-user"}"></i>
        </div>
        <div class="message-content">
            <p>${text}</p>
            <span class="timestamp">${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function askQuestion(question) {
    document.getElementById("chatInput").value = question;
    sendMessage();
}

function getBotResponse(message) {
    const msg = message.toLowerCase();

    if (msg.includes("programs")) {
        setTimeout(() => scrollToSection("programs"), 1000);
        return ' 🎓 We offer several comprehensive programs, <br> 📱 <strong>Software Development</strong> - Learn modern web technologies, HTML, CSS, JavaScript, and popular frameworks,<br> 📊 <strong>Data Analysis</strong> - Master data collection, analysis, visualization with Excel, SQL & Python, <br>🤖 <strong>AI/Machine Learning</strong> - Build smart applications using predictive models and neural networks,<br> ☁️ <strong>Cloud Computing</strong> - Deploy and manage applications on AWS and Azure platforms,<br> 🔧 <strong>Tech Support</strong> - Develop troubleshooting skills for IT problems and user support, All programs include hands-on projects, industry certifications, and guaranteed employment opportunities! Which program interests you most?';
        

    }


    if (msg.includes("requirements")) {
        setTimeout(() => scrollToSection("requirements"), 1000);
        return '<strong>Basic Requirements:</strong>, - Grade 12 certificate or equivalent,<br> - South African citizenship,<br> - Age: 18-35 years old,<br> - Basic computer literacy,<br> - Strong communication skills in English,<br><strong>Additional for Graduate Programs:</strong>,<br>- NQF Level 5 qualification in relevant field,<br> - Clear criminal record, <br>- Good credit history,<br> Worry not if you are new to tech - we will teach you everything you need to know! Our programs are designed for beginners.<br> What is your educational background?';
    }



    if (msg.includes("apply")) {
        setTimeout(() => scrollToSection("apply"), 1000);
        return '1. <strong>Check our current openings</strong> in the Opportunities section,<br>2. <strong>Meet the basic requirements:</strong>, <br>3. <strong>Submit your application</strong>with:<br>- Updated CV/Resume, <br> - Academic records, <br>- Cover letter (optional), <br>4. <strong>Assessment process</strong> includes interviews and skills evaluation';
    }
    

    if (msg.includes("contact")) {
        setTimeout(() => scrollToSection("contact"), 1000);
        return '<strong>Phone:</strong> +27 (21) 409 7000,<br><strong>Email:</strong> reception@uvuafrica.com,<br><strong>Our Locations:</strong>,<br><strong>Braamfontein Branch</strong><br>19 Ameshoff St, Braamfontein, Johannesburg, 2000,<br><strong>Salt River Branch</strong><br>97 Durham Ave, Salt River, Cape Town, 7925,<br><strong>Hollard City Campus</strong><br>13th Floor, 19 Ameshof Road, Braamfontein,<br><strong>Follow Us:</strong>,<br>- Facebook: /uvuafrica, <br>- LinkedIn: /company/capacitiza, <br>- Instagram: @uvuafrica, <br>- Twitter: @UVUAfrica, <br>Best time to call: Monday-Friday, 8AM-5PM. You can also use our partner form above to get in touch! 📨';
    }
    
    return 'Hi! How can I help you today? Ask me about our programs, application process, or anything else! 😊';
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(type, 500);
    highlightActivePage();

    // Set welcome time
    const welcomeTime = document.getElementById("welcomeTime");
    if (welcomeTime) {
        welcomeTime.textContent = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
});



 



// Export functions for global access
window.openApplicationModal = openApplicationModal;
window.closeModal = closeModal;
window.closeSuccessModal = closeSuccessModal;
window.submitApplication = submitApplication;
window.scrollToJobs = scrollToJobs;
window.testModal = testModal;