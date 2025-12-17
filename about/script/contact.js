// Contact Form Handler - Using mailto method (pure frontend)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Basic validation
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            submitBtn.disabled = true;
            
            // Create mailto link with form data
            const emailBody = `Name: ${formData.name}%0AEmail: ${formData.email}%0A%0AMessage:%0A${formData.message}`;
            const mailtoLink = `mailto:CodeWithMmaphuti@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${emailBody}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
                    // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Email Client Opened!';
                    submitBtn.style.background = 'linear-gradient(135deg, #cc0000 0%, #ff4444 100%)';
            
            // Show info message
            alert('Your email client should open with the message pre-filled. If it doesn\'t, please send an email to CodeWithMmaphuti@gmail.com manually.');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
                        submitBtn.disabled = false;
                    }, 3000);
        });
    }
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

