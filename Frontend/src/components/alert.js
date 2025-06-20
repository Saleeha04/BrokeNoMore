// Custom Alert System
class AlertSystem {
  constructor() {
    this.container = this.createContainer();
    this.alerts = [];
  }

  createContainer() {
    let container = document.querySelector('.alert-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'alert-container';
      document.body.appendChild(container);
    }
    return container;
  }

  show(type, title, message, duration = 5000) {
    const alert = this.createAlert(type, title, message);
    this.container.appendChild(alert);
    this.alerts.push(alert);

    // Auto-dismiss after duration
    setTimeout(() => {
      this.dismiss(alert);
    }, duration);

    return alert;
  }

  createAlert(type, title, message) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    alert.innerHTML = `
      <div class="alert-icon">${icons[type] || 'ℹ'}</div>
      <div class="alert-content">
        <div class="alert-title">${title}</div>
        <div class="alert-message">${message}</div>
      </div>
      <button class="alert-close" onclick="this.parentElement.remove()">×</button>
      <div class="alert-progress"></div>
    `;

    // Add click to dismiss
    alert.addEventListener('click', (e) => {
      if (e.target.classList.contains('alert-close')) {
        this.dismiss(alert);
      }
    });

    return alert;
  }

  dismiss(alert) {
    if (alert && alert.parentNode) {
      alert.classList.add('removing');
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
        this.alerts = this.alerts.filter(a => a !== alert);
      }, 300);
    }
  }

  // Convenience methods
  success(title, message, duration) {
    return this.show('success', title, message, duration);
  }

  error(title, message, duration) {
    return this.show('error', title, message, duration);
  }

  warning(title, message, duration) {
    return this.show('warning', title, message, duration);
  }

  info(title, message, duration) {
    return this.show('info', title, message, duration);
  }

  // Clear all alerts
  clearAll() {
    this.alerts.forEach(alert => this.dismiss(alert));
  }
}

// Global alert instance
window.alertSystem = new AlertSystem();

// Replace default alert function
window.showAlert = function(type, title, message, duration) {
  return window.alertSystem.show(type, title, message, duration);
};

// Convenience functions
window.showSuccess = function(title, message, duration) {
  return window.alertSystem.success(title, message, duration);
};

window.showError = function(title, message, duration) {
  return window.alertSystem.error(title, message, duration);
};

window.showWarning = function(title, message, duration) {
  return window.alertSystem.warning(title, message, duration);
};

window.showInfo = function(title, message, duration) {
  return window.alertSystem.info(title, message, duration);
}; 