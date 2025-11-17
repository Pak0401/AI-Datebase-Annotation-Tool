document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  document
    .querySelectorAll('.app-nav a')
    .forEach((link) => link.classList.remove('active'));

  const match = Array.from(document.querySelectorAll('.app-nav a')).find(
    (link) => {
      const href = link.getAttribute('href');
      if (href === '/' && path === '/') return true;
      return href !== '/' && path.startsWith(href);
    },
  );

  if (match) {
    match.classList.add('active');
  }
});
