// script.js

let scale = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;
let startPosX, startPosY;

// Zoom and Pan functionality
const zoomContainer = document.getElementById('zoomContainer');
const treeContainer = document.getElementById('treeContainer');
const zoomLevelElement = document.querySelector('.zoom-level');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateTransform();
  
  // Add event listeners for panning
  zoomContainer.addEventListener('mousedown', startDrag);
  zoomContainer.addEventListener('touchstart', startDragTouch);
  
  // Add wheel event for zooming
  zoomContainer.addEventListener('wheel', handleWheel);
  
  // Close document listeners
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', dragTouch);
  document.addEventListener('touchend', stopDrag);
  
  // Everything starts collapsed
  collapseAll();
});

// Mouse drag events
function startDrag(e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  startPosX = posX;
  startPosY = posY;
  zoomContainer.style.cursor = 'grabbing';
}

function startDragTouch(e) {
  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startPosX = posX;
    startPosY = posY;
    e.preventDefault();
  }
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  
  posX = startPosX + dx / scale;
  posY = startPosY + dy / scale;
  
  updateTransform();
}

function dragTouch(e) {
  if (!isDragging || e.touches.length !== 1) return;
  e.preventDefault();
  
  const dx = e.touches[0].clientX - startX;
  const dy = e.touches[0].clientY - startY;
  
  posX = startPosX + dx / scale;
  posY = startPosY + dy / scale;
  
  updateTransform();
}

function stopDrag() {
  isDragging = false;
  zoomContainer.style.cursor = 'grab';
}

// Zoom with mouse wheel
function handleWheel(e) {
  e.preventDefault();
  
  const zoomIntensity = 0.1;
  const wheel = e.deltaY < 0 ? 1 : -1;
  const zoomFactor = wheel > 0 ? (1 + zoomIntensity) : (1 - zoomIntensity);
  
  // Calculate mouse position relative to tree container
  const rect = treeContainer.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // Adjust position to zoom toward cursor
  posX -= (mouseX / scale) * (zoomFactor - 1);
  posY -= (mouseY / scale) * (zoomFactor - 1);
  
  scale *= zoomFactor;
  
  // Limit zoom range
  scale = Math.max(0.1, Math.min(5, scale));
  
  updateTransform();
}

// Update CSS transform
function updateTransform() {
  treeContainer.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  zoomLevelElement.textContent = `Zoom: ${Math.round(scale * 100)}%`;
}

// Control functions
function zoomIn() {
  scale = Math.min(5, scale + 0.2);
  updateTransform();
}

function zoomOut() {
  scale = Math.max(0.1, scale - 0.2);
  updateTransform();
}

function resetView() {
  scale = 1;
  posX = 0;
  posY = 0;
  updateTransform();
}

// Taxonomy tree functions
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

function expandAll() {
  // Expand main domains
  const domainsList = document.getElementById('domainsList');
  const mainArrow = document.querySelector('.section-title .arrow');
  domainsList.classList.add('show');
  mainArrow.classList.add('open');
  
  // Expand all arrows recursively
  const allArrows = document.querySelectorAll('.arrow:not(.section-title .arrow)');
  allArrows.forEach(arrow => {
    const subtree = arrow.parentElement.querySelector('.subtree');
    if (subtree) {
      subtree.classList.add('show');
      arrow.classList.add('open');
    }
  });
}

function collapseAll() {
  // Collapse everything except the main domains title
  const domainsList = document.getElementById('domainsList');
  const mainArrow = document.querySelector('.section-title .arrow');
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

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  switch (e.key) {
    case '+':
    case '=':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoomIn();
      }
      break;
    case '-':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoomOut();
      }
      break;
    case '0':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        resetView();
      }
      break;
    case 'Escape':
      collapseAll();
      break;
    case ' ':
      if (!e.target.matches('input, textarea')) {
        e.preventDefault();
        expandAll();
      }
      break;
  }
});

// Add coordinates display
const coordsDiv = document.createElement('div');
coordsDiv.className = 'coordinates';
coordsDiv.textContent = 'X: 0, Y: 0';
document.body.appendChild(coordsDiv);

// Update coordinates on move
zoomContainer.addEventListener('mousemove', function(e) {
  const rect = treeContainer.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) / scale - posX);
  const y = Math.round((e.clientY - rect.top) / scale - posY);
  coordsDiv.textContent = `X: ${x}, Y: ${y}`;
});