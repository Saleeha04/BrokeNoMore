document.querySelectorAll('a').forEach(link => {
  // Only apply to internal links
  if (link.href && link.href.indexOf(window.location.origin) === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.style.animation = 'slideOut 0.5s ease forwards';
      setTimeout(() => {
        window.location = this.href;
      }, 100);
    });
  }
});
