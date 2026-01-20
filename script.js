// script.js

// Panning variables
let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;
const infiniteSpace = document.getElementById('infiniteSpace');
const taxonomyContainer = document.getElementById('taxonomyContainer');
const coordinatesElement = document.querySelector('.coordinates');

// Initialize everything collapsed
document.addEventListener('DOMContentLoaded', function() {
    // Set up panning
    setupPanning();
    
    // Update coordinates display
    updateCoordinates();
    
    // Initially collapsed
    collapseAll();
});

// Set up panning functionality
function setupPanning() {
    infiniteSpace.addEventListener('mousedown', startPan);
    infiniteSpace.addEventListener('touchstart', startPanTouch);
    document.addEventListener('mousemove', pan);
    document.addEventListener('touchmove', panTouch);
    document.addEventListener('mouseup', stopPan);
    document.addEventListener('touchend', stopPan);
    
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

// Update taxonomy container position
function updatePosition() {
    taxonomyContainer.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    updateCoordinates();
}

// Update coordinates display
function updateCoordinates() {
    const x = Math.round(offsetX);
    const y = Math.round(offsetY);
    coordinatesElement.textContent = `X: ${x}, Y: ${y}`;
}

// Reset view to center
function resetView() {
    offsetX = 0;
    offsetY = 0;
    updatePosition();
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
    }
});