// script.js

function toggleDomains() {
  const list = document.getElementById('domainsList');
  const arrow = document.querySelector('.arrow');
  
  if (list.classList.contains('show')) {
    // If the list is already visible, hide it
    list.classList.remove('show');
    arrow.classList.remove('open');
  } else {
    // If the list is hidden, show it
    list.classList.add('show');
    arrow.classList.add('open');
  }
}

function toggleArrow(element) {
  const subtree = element.parentElement.querySelector('.subtree');
  const arrow = element;
  
  // Toggle the subtree visibility and the arrow direction
  if (subtree.classList.contains('show')) {
    subtree.classList.remove('show');
    arrow.classList.remove('open');
  } else {
    subtree.classList.add('show');
    arrow.classList.add('open');
  }
}