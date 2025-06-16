document.addEventListener('DOMContentLoaded', () => {
  // Handle all internal <a> links with animation
  document.querySelectorAll('a').forEach(link => {
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

  // Handle a button that should go to home.html
  const homeBtn = document.getElementById('go-home');
  if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.animation = 'slideOut 0.5s ease forwards';
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 100);
    });
  }
});
