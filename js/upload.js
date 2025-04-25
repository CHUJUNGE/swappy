/**
 * Swappy - University of Melbourne Swap Shop
 * Upload Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize common functionality
    checkLoginStatus();
    updateTokenCount();
    initializeBootstrapComponents();
    setupLogout();
    
    // Initialize upload page specific functionality
    initializePhotoUpload();
    initializeFormValidation();
    initializeTemplates();
});

/**
 * Initialize photo upload functionality
 */
function initializePhotoUpload() {
    const photoUploadBoxes = document.querySelectorAll('.photo-upload-box');
    
    if (photoUploadBoxes) {
        photoUploadBoxes.forEach(box => {
            // Find the input element within this box
            const input = box.querySelector('.photo-input');
            
            // Add click event to the box
            box.addEventListener('click', function() {
                input.click();
            });
            
            // Add change event to the input
            input.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Create image preview
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'photo-preview';
                        
                        // Clear box content
                        box.innerHTML = '';
                        
                        // Add image to box
                        box.appendChild(img);
                        
                        // Add remove button
                        const removeBtn = document.createElement('button');
                        removeBtn.type = 'button';
                        removeBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 m-2';
                        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                        removeBtn.addEventListener('click', function(e) {
                            e.stopPropagation(); // Prevent box click event
                            resetPhotoBox(box, input.id);
                        });
                        
                        box.appendChild(removeBtn);
                    };
                    
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });
    }
}

/**
 * Reset a photo upload box to its initial state
 * @param {Element} box - The photo upload box element
 * @param {string} inputId - The ID of the input element
 */
function resetPhotoBox(box, inputId) {
    // Determine which photo box this is
    let boxTitle = 'Additional Photo';
    let iconClass = 'text-secondary';
    
    if (inputId === 'mainPhoto') {
        boxTitle = 'Main Photo';
        iconClass = 'text-primary';
    }
    
    // Reset box content
    box.innerHTML = `
        <i class="fas fa-plus-circle fa-2x mb-2 ${iconClass}"></i>
        <span>${boxTitle}</span>
        <input type="file" class="d-none photo-input" id="${inputId}" accept="image/*" ${inputId === 'mainPhoto' ? 'required' : ''}>
    `;
    
    // Reattach event listeners
    const input = box.querySelector('.photo-input');
    
    box.addEventListener('click', function() {
        input.click();
    });
    
    input.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Create image preview
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'photo-preview';
                
                // Clear box content
                box.innerHTML = '';
                
                // Add image to box
                box.appendChild(img);
                
                // Add remove button
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 m-2';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent box click event
                    resetPhotoBox(box, input.id);
                });
                
                box.appendChild(removeBtn);
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const form = document.getElementById('uploadForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault(); // Prevent actual form submission for demo
                
                // Show success modal
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
                
                // In a real application, this would submit the form data to a server
                console.log('Form submitted successfully');
                
                // Reset form after submission
                setTimeout(() => {
                    form.reset();
                    
                    // Reset photo uploads
                    const photoUploadBoxes = document.querySelectorAll('.photo-upload-box');
                    photoUploadBoxes.forEach(box => {
                        const inputId = box.querySelector('.photo-input').id;
                        resetPhotoBox(box, inputId);
                    });
                    
                    // Add token to user's account (demo only)
                    const currentTokens = parseInt(localStorage.getItem('swappyTokens') || '0');
                    localStorage.setItem('swappyTokens', currentTokens + 1);
                    
                    // Update token display
                    updateTokenCount();
                }, 1000);
            }
            
            form.classList.add('was-validated');
        });
    }
}

/**
 * Initialize item description templates
 */
function initializeTemplates() {
    const templateSelector = document.getElementById('templateSelector');
    const applyTemplateBtn = document.getElementById('applyTemplateBtn');
    
    if (templateSelector && applyTemplateBtn) {
        // Enable/disable apply button based on selection
        templateSelector.addEventListener('change', function() {
            if (this.value) {
                applyTemplateBtn.removeAttribute('disabled');
            } else {
                applyTemplateBtn.setAttribute('disabled', 'disabled');
            }
        });
        
        // Apply template button click handler
        applyTemplateBtn.addEventListener('click', function() {
            const selectedTemplate = templateSelector.value;
            const descriptionField = document.getElementById('description');
            
            if (descriptionField) {
                // Apply selected template
                switch (selectedTemplate) {
                    case 'book':
                        descriptionField.value = 'Title: [Book Title]\nAuthor: [Author Name]\nEdition: [Edition Number]\nISBN: [ISBN Number]\nCondition: [Details about condition, highlighting, notes, etc.]\nCourse: [Course this book was used for]\nOriginal Price: $[Original Price]';
                        break;
                    case 'clothing':
                        descriptionField.value = 'Item: [Clothing Item Name]\nBrand: [Brand Name]\nSize: [Size]\nColor: [Color]\nMaterial: [Material]\nCondition: [Details about condition, wear, etc.]\nOriginal Price: $[Original Price]\nCare Instructions: [Washing/Care Details]';
                        break;
                    case 'electronics':
                        descriptionField.value = 'Item: [Device Name]\nBrand: [Brand Name]\nModel: [Model Number]\nAge: [How old is it?]\nCondition: [Working condition, any issues]\nSpecifications: [Key specifications]\nAccessories Included: [List any included accessories]\nOriginal Price: $[Original Price]';
                        break;
                    case 'furniture':
                        descriptionField.value = 'Item: [Furniture Item]\nBrand/Manufacturer: [Brand Name]\nDimensions: [Width x Depth x Height]\nMaterial: [Main materials]\nColor: [Color]\nCondition: [Details about condition, any damage]\nAge: [How old is it?]\nAssembly Required: [Yes/No]\nOriginal Price: $[Original Price]';
                        break;
                }
                
                // Focus on description field for editing
                descriptionField.focus();
            }
        });
    }
}
