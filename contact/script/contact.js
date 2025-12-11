// Contact Form Handler
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
            
            const submitBtn = contactForm.querySelector('.contact-submit-btn');
            const originalHTML = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Preparing...';
            submitBtn.disabled = true;
            
            // Check if EmailJS is available and configured
            if (typeof emailjs !== 'undefined') {
                // Try to use EmailJS if configured
                const serviceID = 'YOUR_SERVICE_ID';
                const templateID = 'YOUR_TEMPLATE_ID';
                const publicKey = 'YOUR_PUBLIC_KEY';
                
                // Check if EmailJS is properly configured
                if (serviceID !== 'YOUR_SERVICE_ID' && templateID !== 'YOUR_TEMPLATE_ID' && publicKey !== 'YOUR_PUBLIC_KEY') {
                    // Initialize EmailJS
                    emailjs.init(publicKey);
                    
                    // Send email using EmailJS
                    emailjs.send(serviceID, templateID, {
                        from_name: formData.name,
                        from_email: formData.email,
                        subject: formData.subject,
                        message: formData.message,
                        to_email: 'CodeWithMmaphuti@gmail.com'
                    })
                    .then(() => {
                        // Show success message
                        submitBtn.innerHTML = '<i class="bx bx-check"></i> Message Sent!';
                        submitBtn.style.background = '#00ff00';
                        submitBtn.style.color = '#000';
                        
                        // Reset form
                        contactForm.reset();
                        
                        // Show success alert
                        alert('Thank you! Your message has been sent successfully.');
                        
                        // Reset button after 3 seconds
                        setTimeout(() => {
                            submitBtn.innerHTML = originalHTML;
                            submitBtn.style.background = '';
                            submitBtn.style.color = '';
                            submitBtn.disabled = false;
                        }, 3000);
                    })
                    .catch((error) => {
                        console.error('Error sending email:', error);
                        // Fall through to mailto method
                        useMailtoMethod();
                    });
                    return;
                }
            }
            
            // Use mailto method (works immediately without any setup)
            useMailtoMethod();
            
            function useMailtoMethod() {
                // Create mailto link with form data
                const emailBody = `Name: ${formData.name}%0AEmail: ${formData.email}%0A%0AMessage:%0A${formData.message}`;
                const mailtoLink = `mailto:CodeWithMmaphuti@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${emailBody}`;
                
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message
                submitBtn.innerHTML = '<i class="bx bx-check"></i> Email Client Opened!';
                submitBtn.style.background = '#00ff00';
                submitBtn.style.color = '#000';
                
                // Show info message
                alert('Your email client should open with the message pre-filled. If it doesn\'t, please send an email to CodeWithMmaphuti@gmail.com manually.');
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
});

