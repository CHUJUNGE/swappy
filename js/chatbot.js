/**
 * Swappy - University of Melbourne Swap Shop
 * Chatbot JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot icon
    createChatbotIcon();
    
    // Create chatbot container
    createChatbotContainer();
    
    // Initialize Voiceflow chatbot
    initializeVoiceflowChatbot();
});

/**
 * Create the chatbot icon
 */
function createChatbotIcon() {
    // Create chatbot icon element
    const chatbotIcon = document.createElement('div');
    chatbotIcon.className = 'chatbot-icon pulse';
    chatbotIcon.setAttribute('aria-label', 'Open chat assistant');
    chatbotIcon.setAttribute('role', 'button');
    chatbotIcon.setAttribute('tabindex', '0');
    chatbotIcon.innerHTML = '<i class="fas fa-comment-dots"></i>';
    
    // Add click event to toggle chatbot
    chatbotIcon.addEventListener('click', toggleChatbot);
    
    // Add keyboard event for accessibility
    chatbotIcon.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleChatbot();
        }
    });
    
    // Add to body
    document.body.appendChild(chatbotIcon);
}

/**
 * Create the chatbot container
 */
function createChatbotContainer() {
    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    
    // Add to body
    document.body.appendChild(chatbotContainer);
}

/**
 * Toggle chatbot visibility
 */
function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotIcon = document.querySelector('.chatbot-icon');
    
    if (chatbotContainer.style.display === 'block') {
        // Hide chatbot
        chatbotContainer.style.display = 'none';
        chatbotIcon.innerHTML = '<i class="fas fa-comment-dots"></i>';
        chatbotIcon.setAttribute('aria-label', 'Open chat assistant');
        
        // Announce to screen readers
        announceToScreenReader('Chat assistant closed');
    } else {
        // Show chatbot
        chatbotContainer.style.display = 'block';
        chatbotIcon.innerHTML = '<i class="fas fa-times"></i>';
        chatbotIcon.setAttribute('aria-label', 'Close chat assistant');
        chatbotIcon.classList.remove('pulse'); // Remove pulse once clicked
        
        // Announce to screen readers
        announceToScreenReader('Chat assistant opened');
    }
}

/**
 * Initialize Voiceflow chatbot
 */
function initializeVoiceflowChatbot() {
    (function(d, t) {
        var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
        v.onload = function() {
            window.voiceflow.chat.load({
                verify: { projectID: '682e783a54d60af2a3796190' },
                url: 'https://general-runtime.voiceflow.com',
                versionID: 'production',
                voice: {
                    url: "https://runtime-api.voiceflow.com"
                },
                render: {
                    mode: 'embedded',
                    target: document.getElementById('chatbot-container')
                }
            });
        }
        v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; 
        v.type = "text/javascript"; 
        s.parentNode.insertBefore(v, s);
    })(document, 'script');
}
