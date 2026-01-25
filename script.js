// script.js

// Panning variables
let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;
const infiniteSpace = document.getElementById('infiniteSpace');
const taxonomyContainer = document.getElementById('taxonomyContainer');
const coordinatesElement = document.querySelector('.coordinates');

// Zoom level for the infinite space - START ZOOMED 0.66x
let zoomLevel = 0.66;

// Initialize everything collapsed
document.addEventListener('DOMContentLoaded', function() {
    // Set up panning
    setupPanning();
    
    // Update coordinates display
    updateCoordinates();
    
    // Initially collapsed
    collapseAll();
    
    // Apply initial zoom
    updateZoom();
    
    // Set up mutation observer to watch for DOM changes (when expanding)
    setupMutationObserver();
});

// Set up panning functionality
function setupPanning() {
    infiniteSpace.addEventListener('mousedown', startPan);
    infiniteSpace.addEventListener('touchstart', startPanTouch);
    document.addEventListener('mousemove', pan);
    document.addEventListener('touchmove', panTouch);
    document.addEventListener('mouseup', stopPan);
    document.addEventListener('touchend', stopPan);
    
    // Add zoom with mouse wheel
    infiniteSpace.addEventListener('wheel', handleZoom);
    
    // Prevent default touch behaviors
    infiniteSpace.addEventListener('touchmove', function(e) {
        if (isDragging) e.preventDefault();
    }, { passive: false });
}

// Mouse events
function startPan(e) {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    infiniteSpace.style.cursor = 'grabbing';
}

function startPanTouch(e) {
    if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - offsetX;
        startY = e.touches[0].clientY - offsetY;
        infiniteSpace.style.cursor = 'grabbing';
    }
}

function pan(e) {
    if (!isDragging) return;
    
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    
    updatePosition();
}

function panTouch(e) {
    if (!isDragging || e.touches.length !== 1) return;
    
    offsetX = e.touches[0].clientX - startX;
    offsetY = e.touches[0].clientY - startY;
    
    updatePosition();
}

function stopPan() {
    isDragging = false;
    infiniteSpace.style.cursor = 'grab';
}

// Handle zoom with mouse wheel
function handleZoom(e) {
    e.preventDefault();
    
    const zoomIntensity = 0.1;
    const wheel = e.deltaY < 0 ? 1 : -1;
    
    if (wheel > 0) {
        // Zoom in
        zoomLevel = Math.min(5, zoomLevel + zoomIntensity);
    } else {
        // Zoom out
        zoomLevel = Math.max(0.1, zoomLevel - zoomIntensity);
    }
    
    updateZoom();
}

// Update zoom level
function updateZoom() {
    infiniteSpace.style.transform = `scale(${zoomLevel})`;
    updateCoordinates();
}

// Update taxonomy container position
function updatePosition() {
    taxonomyContainer.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    updateCoordinates();
}

// Update coordinates display
function updateCoordinates() {
    const x = Math.round(offsetX);
    const y = Math.round(offsetY);
    coordinatesElement.textContent = `X: ${x}, Y: ${y} (${Math.round(zoomLevel * 100)}%)`;
}

// Reset view to center
function resetView() {
    offsetX = 0;
    offsetY = 0;
    zoomLevel = 0.66; // Reset to 0.66x zoom
    updatePosition();
    updateZoom();
}

// Original taxonomy functions
function toggleDomains() {
    const list = document.getElementById('domainsList');
    const arrow = document.querySelector('.section-title .arrow');
    
    list.classList.toggle('show');
    arrow.classList.toggle('open');
}

function toggleArrow(element) {
    const subtree = element.parentElement.querySelector('.subtree');
    const arrow = element;
    
    subtree.classList.toggle('show');
    arrow.classList.toggle('open');
}

function collapseAll() {
    const domainsList = document.getElementById('domainsList');
    const mainArrow = document.querySelector('.section-title .arrow');
    
    // Collapse domains
    domainsList.classList.remove('show');
    mainArrow.classList.remove('open');
    
    // Collapse all other arrows
    const allArrows = document.querySelectorAll('.arrow:not(.section-title .arrow)');
    allArrows.forEach(arrow => {
        const subtree = arrow.parentElement.querySelector('.subtree');
        if (subtree) {
            subtree.classList.remove('show');
            arrow.classList.remove('open');
        }
    });
}

// Mutation observer to watch for DOM changes when expanding
function setupMutationObserver() {
    // Options for the observer (which mutations to observe)
    const config = { 
        attributes: false, 
        childList: true, 
        subtree: true,
        characterData: false
    };
    
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // When subtree expands/collapses, the container might need to adjust
                // The CSS should handle it automatically with max-height: none
            }
        }
    };
    
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    
    // Start observing the taxonomy container for configured mutations
    observer.observe(taxonomyContainer, config);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'r':
        case 'R':
            resetView();
            break;
        case ' ':
            e.preventDefault();
            toggleDomains();
            break;
        case '+':
        case '=':
            if (e.ctrlKey) {
                e.preventDefault();
                zoomLevel = Math.min(5, zoomLevel + 0.1);
                updateZoom();
            }
            break;
        case '-':
            if (e.ctrlKey) {
                e.preventDefault();
                zoomLevel = Math.max(0.1, zoomLevel - 0.1);
                updateZoom();
            }
            break;
    }
});