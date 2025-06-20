document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page loaded successfully');
    
    // Image carousel functionality
    const img = document.querySelector('.main-image');
    const imagePaths = [
        '../assets/image.png',
        '../assets/image-2.png',
        '../assets/image-3.png'
    ];
    let currentIndex = 0;
    const transitionDuration = 500; 
    const displayDuration = 3000; 

    if (img) {
        console.log('Setting up image carousel');
        img.style.transition = `opacity ${transitionDuration/1000}s ease-in-out`;

        function transitionToNextImage() {
            img.style.opacity = '0';
            
            setTimeout(function() {
                // Update to next image
                currentIndex = (currentIndex + 1) % imagePaths.length;
                img.src = imagePaths[currentIndex];
                
                // When new image loads, fade it in
                img.onload = function() {
                    img.style.opacity = '1';
                    // Schedule next transition
                    setTimeout(transitionToNextImage, displayDuration);
                };
                
                // Handle potential image loading errors
                img.onerror = function() {
                    console.error('Failed to load image:', img.src);
                    img.style.opacity = '1';
                    // Try next image sooner if this one fails
                    setTimeout(transitionToNextImage, 1000);
                };
            }, transitionDuration); // Wait for fade out to complete
        }

        // Start the first transition after initial delay
        setTimeout(transitionToNextImage, 1500);
    }

    // Button click effect (optional)
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    }
    
    // Ensure no profile-related errors occur on landing page
    // Clear any potential session data that might cause issues
    if (typeof localStorage !== 'undefined') {
        // Don't clear everything, just ensure we're not in a logged-in state
        if (localStorage.getItem('userId')) {
            console.log('Clearing user session data from landing page');
            localStorage.removeItem('userId');
        }
    }
    
    console.log('Landing page initialization complete');
});

// Prevent any profile-related errors
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('profile')) {
        console.log('Prevented profile-related error on landing page');
        e.preventDefault();
        return false;
    }
});

    // const reveals = document.querySelectorAll('.reveal');

    // const revealOnScroll = () => {
    //   const windowHeight = window.innerHeight;
    //   const revealPoint = 100;

    //   reveals.forEach((el) => {
    //     const revealTop = el.getBoundingClientRect().top;
    //     if (revealTop < windowHeight - revealPoint) {
    //       el.classList.add('active');
    //     } else {
    //       el.classList.remove('active');
    //     }
    //   });
    // };

    // window.addEventListener('scroll', revealOnScroll);
    // window.addEventListener('load', revealOnScroll);
