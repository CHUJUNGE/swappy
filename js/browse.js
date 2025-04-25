/**
 * Swappy - University of Melbourne Swap Shop
 * Browse Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize common functionality
    checkLoginStatus();
    updateTokenCount();
    initializeBootstrapComponents();
    setupLogout();
    
    // Initialize browse page specific functionality
    initializeViewToggle();
    initializeFilters();
    initializeSorting();
    updateItemCount();
});

/**
 * Initialize view toggle (grid vs list view)
 */
function initializeViewToggle() {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const itemsGrid = document.getElementById('itemsGrid');
    const itemsList = document.getElementById('itemsList');
    
    if (gridViewBtn && listViewBtn && itemsGrid && itemsList) {
        // Set initial active state
        gridViewBtn.classList.add('active');
        
        // Grid view button click handler
        gridViewBtn.addEventListener('click', function() {
            itemsGrid.classList.remove('d-none');
            itemsList.classList.add('d-none');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            
            // Save preference to localStorage
            localStorage.setItem('swappyViewPreference', 'grid');
        });
        
        // List view button click handler
        listViewBtn.addEventListener('click', function() {
            itemsGrid.classList.add('d-none');
            itemsList.classList.remove('d-none');
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
            
            // Generate list view items if empty
            if (itemsList.children.length <= 1) {
                generateListViewItems();
            }
            
            // Save preference to localStorage
            localStorage.setItem('swappyViewPreference', 'list');
        });
        
        // Load saved preference if exists
        const savedViewPreference = localStorage.getItem('swappyViewPreference');
        if (savedViewPreference === 'list') {
            listViewBtn.click();
        }
    }
}

/**
 * Generate list view items based on grid view items
 */
function generateListViewItems() {
    const itemsGrid = document.getElementById('itemsGrid');
    const itemsList = document.getElementById('itemsList');
    
    if (itemsGrid && itemsList) {
        // Clear existing list items (except the example)
        itemsList.innerHTML = '';
        
        // Create a list group
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        
        // Get all grid items
        const gridItems = itemsGrid.querySelectorAll('.item-card');
        
        // Create list items for each grid item
        gridItems.forEach(function(gridItem) {
            // Extract data attributes
            const category = gridItem.getAttribute('data-category');
            const condition = gridItem.getAttribute('data-condition');
            const date = gridItem.getAttribute('data-date');
            const isTheme = gridItem.getAttribute('data-theme') === 'true';
            
            // Extract item details
            const img = gridItem.querySelector('img').getAttribute('src');
            const title = gridItem.querySelector('.card-title').textContent;
            const badge = gridItem.querySelector('.badge').textContent;
            const description = gridItem.querySelector('.card-text').textContent;
            const dateText = gridItem.querySelector('.text-muted').textContent;
            const link = gridItem.querySelector('a').getAttribute('href');
            
            // Create list item
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item list-group-item-action item-list-row';
            listItem.setAttribute('data-category', category);
            listItem.setAttribute('data-condition', condition);
            listItem.setAttribute('data-date', date);
            if (isTheme) {
                listItem.setAttribute('data-theme', 'true');
                listItem.classList.add('border-start', 'border-success', 'border-3');
            }
            
            // Create list item content
            listItem.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${img}" class="img-fluid rounded" alt="${title}">
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${title}</h5>
                            <span class="badge bg-info">${badge}</span>
                        </div>
                        <p class="mb-1">${description}</p>
                        <small class="text-muted">${dateText}</small>
                        ${isTheme ? '<span class="badge bg-success ms-2">Weekly Theme</span>' : ''}
                    </div>
                    <div class="col-md-3 text-end">
                        <a href="${link}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            `;
            
            // Add list item to list group
            listGroup.appendChild(listItem);
        });
        
        // Add list group to list container
        itemsList.appendChild(listGroup);
    }
}

/**
 * Initialize filters for items
 */
function initializeFilters() {
    // Get filter elements
    const categoryFilters = document.querySelectorAll('.category-filter');
    const conditionFilters = document.querySelectorAll('.condition-filter');
    const dateFilter = document.getElementById('datePosted');
    const weeklyThemeFilter = document.getElementById('weeklyThemeFilter');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    // Add event listeners to all filters
    if (categoryFilters) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
    }
    
    if (conditionFilters) {
        conditionFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', applyFilters);
    }
    
    if (weeklyThemeFilter) {
        weeklyThemeFilter.addEventListener('change', applyFilters);
    }
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', applyFilters);
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                applyFilters();
            }
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

/**
 * Apply filters to items
 */
function applyFilters() {
    // Get all items (both grid and list)
    const gridItems = document.querySelectorAll('.item-card');
    const listItems = document.querySelectorAll('.item-list-row');
    
    // Get filter values
    const selectedCategories = getSelectedValues('.category-filter');
    const selectedConditions = getSelectedValues('.condition-filter');
    const dateFilter = document.getElementById('datePosted').value;
    const weeklyThemeOnly = document.getElementById('weeklyThemeFilter').checked;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter items
    let visibleCount = 0;
    
    // Filter grid items
    gridItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const condition = item.getAttribute('data-condition');
        const date = new Date(item.getAttribute('data-date'));
        const isTheme = item.getAttribute('data-theme') === 'true';
        const title = item.querySelector('.card-title').textContent.toLowerCase();
        const description = item.querySelector('.card-text').textContent.toLowerCase();
        
        // Check if item matches all filters
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
        const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(condition);
        const matchesDate = checkDateFilter(date, dateFilter);
        const matchesTheme = !weeklyThemeOnly || isTheme;
        const matchesSearch = searchQuery === '' || 
                             title.includes(searchQuery) || 
                             description.includes(searchQuery);
        
        // Show or hide item
        if (matchesCategory && matchesCondition && matchesDate && matchesTheme && matchesSearch) {
            item.classList.remove('d-none');
            visibleCount++;
        } else {
            item.classList.add('d-none');
        }
    });
    
    // Filter list items
    listItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const condition = item.getAttribute('data-condition');
        const date = new Date(item.getAttribute('data-date'));
        const isTheme = item.getAttribute('data-theme') === 'true';
        const title = item.querySelector('h5').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        
        // Check if item matches all filters
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
        const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(condition);
        const matchesDate = checkDateFilter(date, dateFilter);
        const matchesTheme = !weeklyThemeOnly || isTheme;
        const matchesSearch = searchQuery === '' || 
                             title.includes(searchQuery) || 
                             description.includes(searchQuery);
        
        // Show or hide item
        if (matchesCategory && matchesCondition && matchesDate && matchesTheme && matchesSearch) {
            item.classList.remove('d-none');
        } else {
            item.classList.add('d-none');
        }
    });
    
    // Update item count
    updateItemCount(visibleCount);
}

/**
 * Get selected values from checkbox filters
 * @param {string} selector - CSS selector for the filter checkboxes
 * @returns {Array} Array of selected values
 */
function getSelectedValues(selector) {
    const checkboxes = document.querySelectorAll(`${selector}:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

/**
 * Check if a date matches the date filter
 * @param {Date} itemDate - The date to check
 * @param {string} filterValue - The filter value (all, today, week, month)
 * @returns {boolean} Whether the date matches the filter
 */
function checkDateFilter(itemDate, filterValue) {
    const now = new Date();
    
    switch (filterValue) {
        case 'today':
            return itemDate.toDateString() === now.toDateString();
        case 'week':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return itemDate >= oneWeekAgo;
        case 'month':
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
            return itemDate >= oneMonthAgo;
        case 'all':
        default:
            return true;
    }
}

/**
 * Reset all filters to their default values
 */
function resetFilters() {
    // Reset category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.checked = true;
    });
    
    // Reset condition filters
    const conditionFilters = document.querySelectorAll('.condition-filter');
    conditionFilters.forEach(filter => {
        filter.checked = true;
    });
    
    // Reset date filter
    const dateFilter = document.getElementById('datePosted');
    if (dateFilter) {
        dateFilter.value = 'all';
    }
    
    // Reset weekly theme filter
    const weeklyThemeFilter = document.getElementById('weeklyThemeFilter');
    if (weeklyThemeFilter) {
        weeklyThemeFilter.checked = false;
    }
    
    // Reset search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Apply reset filters
    applyFilters();
}

/**
 * Initialize sorting functionality
 */
function initializeSorting() {
    const sortOptions = document.getElementById('sortOptions');
    
    if (sortOptions) {
        sortOptions.addEventListener('change', function() {
            sortItems(this.value);
        });
    }
}

/**
 * Sort items based on selected option
 * @param {string} sortOption - The sort option (newest, oldest, az, za)
 */
function sortItems(sortOption) {
    // Get containers
    const itemsGrid = document.getElementById('itemsGrid');
    const itemsList = document.getElementById('itemsList').querySelector('.list-group');
    
    if (!itemsGrid || !itemsList) return;
    
    // Get items
    const gridItems = Array.from(itemsGrid.querySelectorAll('.item-card:not(.d-none)'));
    const listItems = Array.from(itemsList.querySelectorAll('.item-list-row:not(.d-none)'));
    
    // Sort grid items
    gridItems.sort((a, b) => {
        return compareItems(a, b, sortOption);
    });
    
    // Sort list items
    listItems.sort((a, b) => {
        return compareItems(a, b, sortOption);
    });
    
    // Reorder items in DOM
    gridItems.forEach(item => {
        itemsGrid.appendChild(item);
    });
    
    listItems.forEach(item => {
        itemsList.appendChild(item);
    });
}

/**
 * Compare two items for sorting
 * @param {Element} a - First item
 * @param {Element} b - Second item
 * @param {string} sortOption - Sort option
 * @returns {number} Comparison result
 */
function compareItems(a, b, sortOption) {
    switch (sortOption) {
        case 'newest':
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            return dateB - dateA;
        case 'oldest':
            const dateC = new Date(a.getAttribute('data-date'));
            const dateD = new Date(b.getAttribute('data-date'));
            return dateC - dateD;
        case 'az':
            const titleA = a.querySelector('.card-title, h5').textContent.toLowerCase();
            const titleB = b.querySelector('.card-title, h5').textContent.toLowerCase();
            return titleA.localeCompare(titleB);
        case 'za':
            const titleC = a.querySelector('.card-title, h5').textContent.toLowerCase();
            const titleD = b.querySelector('.card-title, h5').textContent.toLowerCase();
            return titleD.localeCompare(titleC);
        default:
            return 0;
    }
}

/**
 * Update the item count display
 * @param {number} count - Number of visible items
 */
function updateItemCount(count) {
    const itemCountElement = document.getElementById('itemCount');
    
    if (itemCountElement) {
        if (count === undefined) {
            // Count visible items if count not provided
            const visibleItems = document.querySelectorAll('.item-card:not(.d-none)').length;
            count = visibleItems;
        }
        
        itemCountElement.textContent = `Showing ${count} item${count !== 1 ? 's' : ''}`;
    }
}
