/**
 * frontend/static/js/main.js
 * Core application navigation, active route highlighting, and global utility helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Highlight active navigation link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});
