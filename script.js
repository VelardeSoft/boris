// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Set initial header background based on theme
    updateHeaderOnScroll();
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add rotation animation
        themeToggle.classList.add('rotating');
        
        // Change theme after a brief delay for smooth transition
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Update header background for current scroll position
            updateHeaderOnScroll();
            
            // Remove rotation class
            setTimeout(() => {
                themeToggle.classList.remove('rotating');
            }, 300);
        }, 150);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (theme === 'dark') {
        themeIcon.textContent = '🌙';
    } else {
        themeIcon.textContent = '☀️';
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to header with theme support
function updateHeaderOnScroll() {
    const header = document.querySelector('.header');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    if (window.scrollY > 100) {
        // More opaque background when scrolled
        if (currentTheme === 'dark') {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    } else {
        // Semi-transparent background at top
        if (currentTheme === 'dark') {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.85)';
        }
    }
}

window.addEventListener('scroll', updateHeaderOnScroll);

// Animate floating elements
function animateFloatingElements() {
    const icons = document.querySelectorAll('.floating-icon');
    icons.forEach((icon, index) => {
        setInterval(() => {
            const randomX = Math.random() * 50 - 25;
            const randomY = Math.random() * 50 - 25;
            icon.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
        }, 3000 + index * 1000);
    });
}

// Certificates carousel functionality
function initCertificatesCarousel() {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const grid = document.querySelector('.certificates-grid');
    
    if (!prevBtn || !nextBtn || !grid) return;
    
    let scrollAmount = 0;
    const cardWidth = 300; // Approximate card width + gap
    
    prevBtn.addEventListener('click', () => {
        scrollAmount = Math.max(0, scrollAmount - cardWidth);
        grid.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        scrollAmount = Math.min(maxScroll, scrollAmount + cardWidth);
        grid.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update button states based on scroll position
    grid.addEventListener('scroll', () => {
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        scrollAmount = grid.scrollLeft;
        
        prevBtn.style.opacity = scrollAmount <= 0 ? '0.5' : '1';
        nextBtn.style.opacity = scrollAmount >= maxScroll ? '0.5' : '1';
    });
}

// Certificate actions - Updated to work with src attributes and title mapping
function initCertificateActions() {
    // Map certificate titles to actual PDF file names
    const certificateFiles = {
        'Lógica de programación': 'certificados/BORIS NOEL VELARDE GONZALES.PDF',
        'SQL y bases de datos': 'certificados/certificado-mundoIT.pdf',
        'Java y POO': 'certificados/Coursera AP8RGPJKJWGL.pdf',
        'Metodologías de estudio': 'certificados/certificado-storyTelling.pdf',
        'Conducta Responsable': 'certificados/9894-Certificado Conducta Responsable-114848-2-2-20240808 (1).pdf',
        'Creatividad Literaria': 'certificados/certificado-creatividadLiteraria.pdf'
    };

    // View certificate buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const certificateTitle = this.closest('.certificate-card').querySelector('.certificate-title').textContent;
            
            // Check if button has src attribute, otherwise use title mapping
            const pdfPath = this.getAttribute('src') || certificateFiles[certificateTitle];
            
            if (pdfPath) {
                showCertificateModal(certificateTitle, pdfPath);
            } else {
                showNotification(`Certificado no disponible: ${certificateTitle}`, 'warning');
            }
        });
    });
    
    // Download certificate buttons
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function() {
            const certificateTitle = this.closest('.certificate-card').querySelector('.certificate-title').textContent;
            
            // Check if button has src attribute, otherwise use title mapping
            const pdfPath = this.getAttribute('src') || certificateFiles[certificateTitle];
            
            if (pdfPath) {
                downloadCertificate(certificateTitle, pdfPath);
            } else {
                showNotification(`Certificado no disponible: ${certificateTitle}`, 'warning');
            }
        });
    });
}

function showCertificateModal(title, pdfPath) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Vista previa del certificado - ${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="pdf-preview">
                        <iframe src="${pdfPath}" width="100%" height="500px" style="border: none; border-radius: 8px;"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-open-pdf" data-path="${pdfPath}">Abrir PDF completo</button>
                    <button class="btn-download-modal" data-path="${pdfPath}" data-title="${title}">Descargar PDF</button>
                    <button class="btn-close-modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .certificate-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
        }
        
        .modal-overlay {
            background: rgba(0, 0, 0, 0.8);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #1e293b;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .pdf-preview {
            width: 100%;
            min-height: 500px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            flex-wrap: wrap;
        }
        
        .btn-open-pdf, .btn-download-modal, .btn-close-modal {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-open-pdf {
            background: #3b82f6;
            color: white;
        }
        
        .btn-open-pdf:hover {
            background: #2563eb;
        }
        
        .btn-download-modal {
            background: #10b981;
            color: white;
        }
        
        .btn-download-modal:hover {
            background: #059669;
        }
        
        .btn-close-modal {
            background: #f1f5f9;
            color: #64748b;
        }
        
        .btn-close-modal:hover {
            background: #e2e8f0;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                margin: 1rem;
                max-width: calc(100% - 2rem);
            }
            
            .modal-body {
                padding: 1rem;
            }
            
            .pdf-preview {
                min-height: 400px;
            }
            
            .modal-footer {
                flex-direction: column;
            }
            
            .btn-open-pdf, .btn-download-modal, .btn-close-modal {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Modal event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(modalStyles);
    });
    
    modal.querySelector('.btn-close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(modalStyles);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyles);
        }
    });
    
    // Open PDF in new window
    modal.querySelector('.btn-open-pdf').addEventListener('click', function() {
        const path = this.getAttribute('data-path');
        window.open(path, '_blank');
    });
    
    // Download PDF
    modal.querySelector('.btn-download-modal').addEventListener('click', function() {
        const path = this.getAttribute('data-path');
        const title = this.getAttribute('data-title');
        downloadCertificate(title, path);
        document.body.removeChild(modal);
        document.head.removeChild(modalStyles);
    });
}

function downloadCertificate(title, pdfPath) {
    try {
        // Create download link for PDF
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = pdfPath.split('/').pop(); // Get filename only
        link.target = '_blank';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success notification
        showNotification(`Descargando certificado: ${title}`, 'success');
    } catch (error) {
        // Show error notification
        showNotification(`Error al descargar: ${title}`, 'error');
        console.error('Download error:', error);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    let bgColor;
    
    switch (type) {
        case 'success':
            bgColor = '#10b981';
            break;
        case 'warning':
            bgColor = '#f59e0b';
            break;
        case 'error':
            bgColor = '#ef4444';
            break;
        default:
            bgColor = '#3b82f6';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${bgColor};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    // Add keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing all functionality...');
    
    // Initialize theme toggle first
    initThemeToggle();
    
    // Initialize basic functionality
    animateFloatingElements();
    initCertificatesCarousel();
    initCertificateActions();
    
    // Add entrance animations
    const heroContent = document.querySelector('.hero-content');
    const profileSection = document.querySelector('.profile-section');
    
    setTimeout(() => {
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 300);
    
    setTimeout(() => {
        if (profileSection) {
            profileSection.style.opacity = '1';
            profileSection.style.transform = 'translateX(0)';
        }
    }, 600);
    
    // Profile interactions
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        profileCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('click', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        });
    }
    
    // Skills animation
    document.querySelectorAll('.skill').forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        skill.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button hover effects
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0px)';
        });
    });
    
    console.log('Certificate functionality initialized successfully!');
});

// Add initial animation styles
const style = document.createElement('style');
style.textContent = `
    .hero-content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .profile-section {
        opacity: 0;
        transform: translateX(30px);
        transition: all 0.8s ease;
    }
`;
document.head.appendChild(style);
