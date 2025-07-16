// Interactive Human Body Anatomy Script
class AnatomyDiagram {
    constructor() {
        this.labels = document.querySelectorAll('.label');
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
        this.bodyDiagram = document.getElementById('bodyDiagram');
        this.activeLabel = null;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupResponsiveDesign();
        this.setupAccessibility();
        this.animateLabelsOnLoad();
    }

    setupEventListeners() {
        // Label interactions
        this.labels.forEach(label => {
            // Click/touch events
            label.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLabelClick(label);
            });

            // Hover events for desktop
            if (!this.isMobile) {
                label.addEventListener('mouseenter', () => {
                    this.handleLabelHover(label);
                });

                label.addEventListener('mouseleave', () => {
                    this.handleLabelLeave(label);
                });
            }

            // Touch events for mobile
            label.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleLabelClick(label);
            });

            // Keyboard accessibility
            label.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleLabelClick(label);
                }
            });
        });

        // Modal close button
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Prevent context menu on long press (mobile)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.label')) {
                e.preventDefault();
            }
        });
    }

    handleLabelClick(label) {
        const partName = label.dataset.part;
        const labelInfo = label.querySelector('.label-info');
        
        // Remove active state from all labels
        this.labels.forEach(l => l.classList.remove('active'));
        
        // Add active state to clicked label
        label.classList.add('active');
        this.activeLabel = label;
        
        // Get information from the label
        const title = labelInfo.querySelector('h3').textContent;
        const description = labelInfo.querySelector('p').textContent;
        
        // Update modal content
        this.updateModal(title, description);
        
        // Show modal
        this.showModal();
        
        // Add pulse animation
        label.classList.add('pulse');
        setTimeout(() => {
            label.classList.remove('pulse');
        }, 2000);
        
        // Announce to screen readers
        this.announceToScreenReader(`Selected ${title}`);
    }

    handleLabelHover(label) {
        if (this.activeLabel !== label) {
            label.style.transform = 'translate(-50%, -50%) scale(1.1)';
            label.style.zIndex = '5';
        }
    }

    handleLabelLeave(label) {
        if (this.activeLabel !== label) {
            label.style.transform = 'translate(-50%, -50%) scale(1)';
            label.style.zIndex = '3';
        }
    }

    updateModal(title, description) {
        this.modalTitle.textContent = title;
        this.modalBody.innerHTML = `<p>${description}</p>`;
    }

    showModal() {
        this.modal.style.display = 'block';
        // Focus the close button for accessibility
        this.modalClose.focus();
    }

    closeModal() {
        this.modal.style.display = 'none';
        
        // Remove active state from all labels
        this.labels.forEach(label => {
            label.classList.remove('active');
            label.style.transform = 'translate(-50%, -50%) scale(1)';
            label.style.zIndex = '3';
        });
        
        this.activeLabel = null;
        
        // Reset modal content
        this.modalTitle.textContent = 'Select a body part';
        this.modalBody.innerHTML = '<p>Click on any labeled part to learn more about it.</p>';
    }

    setupResponsiveDesign() {
        // Adjust label positions based on screen size
        const updateLabelPositions = () => {
            const containerWidth = this.bodyDiagram.offsetWidth;
            const containerHeight = this.bodyDiagram.offsetHeight;
            
            // Scale factor based on container size
            const scaleFactor = Math.min(containerWidth / 400, containerHeight / 600);
            
            this.labels.forEach(label => {
                const fontSize = Math.max(10, 14 * scaleFactor);
                label.querySelector('.label-text').style.fontSize = `${fontSize}px`;
            });
        };
        
        updateLabelPositions();
        window.addEventListener('resize', updateLabelPositions);
    }

    setupAccessibility() {
        // Add ARIA labels and roles
        this.labels.forEach(label => {
            const partName = label.dataset.part;
            label.setAttribute('role', 'button');
            label.setAttribute('aria-label', `Learn about ${partName}`);
            label.setAttribute('tabindex', '0');
        });
        
        // Add ARIA live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-9999px';
        liveRegion.id = 'announcements';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    animateLabelsOnLoad() {
        // Stagger animation of labels appearing
        this.labels.forEach((label, index) => {
            label.style.opacity = '0';
            label.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                label.style.opacity = '1';
                label.style.transform = 'translate(-50%, -50%) scale(1)';
                label.style.transition = 'all 0.3s ease';
            }, index * 100);
        });
    }

    handleResize() {
        // Update mobile detection
        this.isMobile = window.innerWidth <= 768;
        
        // Close modal on orientation change
        if (this.isMobile) {
            this.closeModal();
        }
        
        // Recalculate positions if needed
        this.setupResponsiveDesign();
    }

    // Public methods for external control
    selectPart(partName) {
        const label = document.querySelector(`[data-part="${partName}"]`);
        if (label) {
            this.handleLabelClick(label);
        }
    }

    highlightPart(partName) {
        const label = document.querySelector(`[data-part="${partName}"]`);
        if (label) {
            label.classList.add('pulse');
            setTimeout(() => {
                label.classList.remove('pulse');
            }, 2000);
        }
    }

    resetDiagram() {
        this.closeModal();
        this.labels.forEach(label => {
            label.classList.remove('active', 'pulse');
        });
    }
}

// Initialize the anatomy diagram when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const anatomyDiagram = new AnatomyDiagram();
    
    // Make it globally accessible for external control
    window.anatomyDiagram = anatomyDiagram;
    
    // Service Worker for offline functionality (optional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
});

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to resize handler
const debouncedResize = debounce(() => {
    if (window.anatomyDiagram) {
        window.anatomyDiagram.handleResize();
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// Touch gesture support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    // Prevent scrolling on the body diagram
    if (e.target.closest('.body-diagram')) {
        e.preventDefault();
    }
}, { passive: false });

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnatomyDiagram;
}
