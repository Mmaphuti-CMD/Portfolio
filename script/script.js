// Update active navigation link based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const currentHref = window.location.href;
    const pathParts = currentPath.split('/').filter(p => p);
    
    // Determine current section
    let currentSection = 'home';
    if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart === 'index.html' || lastPart === '') {
            if (pathParts.length > 1) {
                currentSection = pathParts[pathParts.length - 2]; // Get folder name
            } else {
                currentSection = 'home';
            }
        } else {
            currentSection = lastPart.replace('.html', '');
        }
    }
    
    // Update active links - remove all active classes first
    document.querySelectorAll('.nav-container .hlinks-container a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the correct link
    document.querySelectorAll('.nav-container .hlinks-container a').forEach(link => {
        const linkHref = link.getAttribute('href');
        const fullLinkHref = new URL(linkHref, currentHref).pathname;
        const currentFullPath = new URL(currentHref).pathname;
        
        // Normalize paths for comparison
        const normalizePath = (path) => path.replace(/\/$/, '').toLowerCase();
        const normalizedLink = normalizePath(fullLinkHref);
        const normalizedCurrent = normalizePath(currentFullPath);
        
        // Check if this link matches current page
        if (normalizedLink === normalizedCurrent || 
            (currentSection === 'home' && (linkHref === 'index.html' || linkHref.endsWith('/index.html') || linkHref.endsWith('/')))) {
            link.classList.add('active');
        } else if (currentSection !== 'home' && 
                   (linkHref.includes(`/${currentSection}/`) || 
                    linkHref.includes(`${currentSection}/index.html`) ||
                    linkHref.endsWith(`${currentSection}.html`))) {
            link.classList.add('active');
        }
    });
});