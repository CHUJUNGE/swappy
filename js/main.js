/**
 * Swappy - University of Melbourne Swap Shop
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Initialize token count
    updateTokenCount();
    
    // Load featured items
    loadFeaturedItems();
    
    // Initialize tooltips and popovers
    initializeBootstrapComponents();
    
    // Add logout functionality
    setupLogout();
    
    // Initialize accessibility features
    initializeAccessibility();
    
    // Add skip to content link for keyboard navigation
    addSkipToContentLink();
});

/**
 * Check if user is logged in and update UI accordingly
 */
function checkLoginStatus() {
    // In a real application, this would check with a server or local storage
    // For demo purposes, we'll use localStorage
    const isLoggedIn = localStorage.getItem('swappyLoggedIn') === 'true';
    const username = localStorage.getItem('swappyUsername') || 'User';
    
    const loginButtons = document.getElementById('loginButtons');
    const userProfile = document.getElementById('userProfile');
    const usernameElement = document.getElementById('username');
    
    if (isLoggedIn && loginButtons && userProfile) {
        loginButtons.classList.add('d-none');
        userProfile.classList.remove('d-none');
        if (usernameElement) {
            usernameElement.textContent = username;
        }
    } else if (loginButtons && userProfile) {
        loginButtons.classList.remove('d-none');
        userProfile.classList.add('d-none');
    }
}

/**
 * Update token count in the UI
 */
function updateTokenCount() {
    const tokenCountElement = document.getElementById('tokenCount');
    if (tokenCountElement) {
        // In a real application, this would fetch from a server
        // For demo purposes, we'll use localStorage
        const tokenCount = localStorage.getItem('swappyTokens') || '0';
        tokenCountElement.textContent = tokenCount;
    }
}

/**
 * Load featured items on the homepage
 */
function loadFeaturedItems() {
    // In a real application, this would fetch items from a server
    // For demo purposes, we'll leave the static HTML items
    
    // This function would be expanded in a real application to dynamically
    // load featured items from a backend API
}

/**
 * Initialize Bootstrap components
 */
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

/**
 * Setup logout functionality
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear login status
            localStorage.removeItem('swappyLoggedIn');
            localStorage.removeItem('swappyUsername');
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
}

/**
 * Format date relative to current date (e.g., "2 days ago")
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatRelativeDate(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Show a notification toast
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    // Create toast content
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toastEl);
    
    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 5000
    });
    toast.show();
    
    // Remove toast after it's hidden
    toastEl.addEventListener('hidden.bs.toast', function() {
        toastEl.remove();
    });
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    const accessibilityBtn = document.getElementById('accessibilityBtn');
    
    if (accessibilityBtn) {
        // Check if accessibility mode is enabled in localStorage
        const isAccessibilityMode = localStorage.getItem('swappyAccessibilityMode') === 'true';
        
        // Apply accessibility mode if enabled
        if (isAccessibilityMode) {
            document.body.classList.add('accessibility-mode');
            accessibilityBtn.classList.add('active');
        }
        
        // Add click event to toggle accessibility mode
        accessibilityBtn.addEventListener('click', function() {
            // Toggle accessibility mode
            document.body.classList.toggle('accessibility-mode');
            this.classList.toggle('active');
            
            // Save preference to localStorage
            const isEnabled = document.body.classList.contains('accessibility-mode');
            localStorage.setItem('swappyAccessibilityMode', isEnabled);
            
            // Show notification
            const message = isEnabled ? 'Accessibility mode enabled' : 'Accessibility mode disabled';
            showNotification(message, 'success');
            
            // Announce to screen readers
            announceToScreenReader(message);
        });
    }
}

/**
 * Add skip to content link for keyboard navigation
 */
function addSkipToContentLink() {
    // Create skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    
    // Add to beginning of body
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ID to main content area
    const mainContent = document.querySelector('main') || document.querySelector('section:not(.navbar)');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

/**
 * Announce message to screen readers using ARIA live region
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    // Create or get the live region
    let liveRegion = document.getElementById('aria-live-announcer');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }
    
    // Set the message
    liveRegion.textContent = message;
    
    // Clear after a few seconds
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 3000);
}
