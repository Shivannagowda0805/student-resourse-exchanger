document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.setAttribute('data-theme', 'dark');
    toggle.textContent = '☀️';
  }
  
  toggle.addEventListener('click', function() {
    if (html.getAttribute('data-theme') === 'dark') {
      html.removeAttribute('data-theme');
      toggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        html.setAttribute('data-theme', 'dark');
        toggle.textContent = '☀️';
      } else {
        html.removeAttribute('data-theme');
        toggle.textContent = '🌙';
      }
    }
  });
