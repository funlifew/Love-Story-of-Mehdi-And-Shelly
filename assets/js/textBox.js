/**
 * Enhanced TextBox Animation Manager
 * Handles text display with improved scroll restoration and state management
 */
class TextBoxManager {
    constructor() {
        this.textBox = document.getElementById('textBox');
        this.textContent = document.getElementById('textContent');
        this.currentTextKey = null;
        this.currentStoryData = null;
        this.isVisible = false;
        this.lastKnownScrollPosition = 0;
        this.scrollThreshold = 10; // Minimum scroll difference to consider as movement
        
        this.init();
    }

    /**
     * Initialize the text box manager
     */
    init() {
        this.hideTextBox();
        this.setupEventListeners();
        this.setupScrollTracking();
        this.validateElements();
    }

    /**
     * Validate required DOM elements exist
     */
    validateElements() {
        if (!this.textBox) {
            console.error('❌ TextBox element not found! Make sure element with id="textBox" exists.');
            return false;
        }
        
        if (!this.textContent) {
            console.error('❌ TextContent element not found! Make sure element with id="textContent" exists.');
            return false;
        }
        
        console.log('✅ TextBox elements validated successfully');
        return true;
    }

    /**
     * Setup event listeners for text box interactions
     */
    setupEventListeners() {
        // Optional: Click to hide text box
        this.textBox.addEventListener('click', (e) => {
            if (this.isVisible && e.target === this.textBox) {
                this.hideTextBox();
            }
        });

        // Keyboard support for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideTextBox();
            }
        });

        // Handle window resize for responsive design
        window.addEventListener('resize', this.debounce(() => {
            this.adjustForViewport();
        }, 250));
    }

    /**
     * Setup scroll tracking for better restoration
     */
    setupScrollTracking() {
        let ticking = false;

        const trackScroll = () => {
            const currentScroll = window.scrollY;
            const scrollDiff = Math.abs(currentScroll - this.lastKnownScrollPosition);
            
            // Only update if scroll difference is significant
            if (scrollDiff > this.scrollThreshold) {
                this.lastKnownScrollPosition = currentScroll;
                this.onScrollPositionChange(currentScroll);
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(trackScroll);
                ticking = true;
            }
        });
    }

    /**
     * Handle scroll position changes
     * @param {number} scrollPosition - Current scroll position
     */
    onScrollPositionChange(scrollPosition) {
        // Store scroll position for restoration
        sessionStorage.setItem('storyScrollPosition', scrollPosition.toString());
        
        // Store current text state if visible
        if (this.isVisible && this.currentTextKey) {
            this.storeTextStateInSession();
        }
    }

    /**
     * Store current text state in session storage
     */
    storeTextStateInSession() {
        const textState = {
            textKey: this.currentTextKey,
            storyData: this.currentStoryData,
            isVisible: this.isVisible,
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('storyTextState', JSON.stringify(textState));
    }

    /**
     * Restore text state from session storage
     */
    restoreTextStateFromSession() {
        try {
            const storedState = sessionStorage.getItem('storyTextState');
            if (!storedState) return false;
            
            const textState = JSON.parse(storedState);
            
            // Check if stored state is recent (within 5 minutes)
            const fiveMinutes = 5 * 60 * 1000;
            if (Date.now() - textState.timestamp > fiveMinutes) {
                sessionStorage.removeItem('storyTextState');
                return false;
            }
            
            if (textState.textKey && textState.storyData && textState.isVisible) {
                this.displayTextInstant(
                    textState.storyData.text,
                    textState.storyData.type,
                    textState.storyData.character || '',
                    textState.storyData.isHeartMoment || false
                );
                
                console.log(`🔄 Restored text state: ${textState.textKey}`);
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Failed to restore text state:', error);
            sessionStorage.removeItem('storyTextState');
        }
        
        return false;
    }

    /**
     * Show text box with animation
     */
    showTextBox() {
        if (!this.isVisible) {
            this.textBox.classList.remove('inactive', 'text-box-exit');
            this.textBox.classList.add('active', 'text-box-enter');
            this.isVisible = true;
            
            // Ensure accessibility
            this.textBox.setAttribute('aria-hidden', 'false');
            this.textBox.setAttribute('role', 'dialog');
            this.textBox.setAttribute('aria-live', 'polite');
        }
    }

    /**
     * Hide text box with animation
     */
    hideTextBox() {
        if (this.isVisible) {
            this.textBox.classList.remove('active', 'text-box-enter');
            this.textBox.classList.add('inactive', 'text-box-exit');
            this.isVisible = false;
            
            // Update accessibility attributes
            this.textBox.setAttribute('aria-hidden', 'true');
            this.textBox.removeAttribute('role');
            this.textBox.removeAttribute('aria-live');
            
            // Clear session storage when manually hiding
            sessionStorage.removeItem('storyTextState');
        }
    }

    /**
     * Display text with appear animation
     * @param {string} text - The text to display
     * @param {string} type - Type of text: 'dialogue', 'narrator', 'character-intro'
     * @param {string} characterName - Name of the character (optional)
     * @param {boolean} isHeartMoment - Whether this is a romantic moment
     */
    displayText(text, type = 'narrator', characterName = '', isHeartMoment = false) {
        return new Promise((resolve) => {
            // Validate input
            if (!text || typeof text !== 'string') {
                console.warn('⚠️ Invalid text provided to displayText');
                resolve();
                return;
            }

            // Store current state
            this.storeTextState(text, { text, type, characterName, isHeartMoment });
            
            // Add heart moment styling if needed
            this.toggleHeartMomentStyling(isHeartMoment);

            // Prepare text content based on type
            const fullText = this.formatText(text, type, characterName);
            
            // Set text content with smooth transition
            this.setTextContent(fullText);
            
            // Show text box with animation
            this.showTextBox();
            
            // Store state in session
            this.storeTextStateInSession();
            
            // Resolve after animation completes
            setTimeout(() => {
                resolve();
            }, 300);
        });
    }

    /**
     * Display text instantly without animation (for scroll restoration)
     * @param {string} text - The text to display
     * @param {string} type - Type of text: 'dialogue', 'narrator', 'character-intro'
     * @param {string} characterName - Name of the character (optional)
     * @param {boolean} isHeartMoment - Whether this is a romantic moment
     */
    displayTextInstant(text, type = 'narrator', characterName = '', isHeartMoment = false) {
        // Validate input
        if (!text || typeof text !== 'string') {
            console.warn('⚠️ Invalid text provided to displayTextInstant');
            return;
        }

        // Store current state
        this.storeTextState(text, { text, type, characterName, isHeartMoment });
        
        // Add heart moment styling if needed
        this.toggleHeartMomentStyling(isHeartMoment);

        // Prepare text content based on type
        const fullText = this.formatText(text, type, characterName);
        
        // Set text content instantly
        this.setTextContent(fullText);
        
        // Show text box instantly (no animation)
        this.textBox.classList.remove('inactive', 'text-box-exit');
        this.textBox.classList.add('active');
        this.isVisible = true;
        
        // Update accessibility
        this.textBox.setAttribute('aria-hidden', 'false');
        this.textBox.setAttribute('role', 'dialog');
        this.textBox.setAttribute('aria-live', 'polite');
    }

    /**
     * Toggle heart moment styling
     * @param {boolean} isHeartMoment - Whether this is a romantic moment
     */
    toggleHeartMomentStyling(isHeartMoment) {
        if (isHeartMoment) {
            this.textBox.classList.add('heart-moment');
        } else {
            this.textBox.classList.remove('heart-moment');
        }
    }

    /**
     * Set text content with smooth transition
     * @param {string} htmlContent - HTML content to set
     */
    setTextContent(htmlContent) {
        // Add fade transition for smoother text changes
        this.textContent.style.transition = 'opacity 0.2s ease-in-out';
        this.textContent.style.opacity = '0';
        
        setTimeout(() => {
            this.textContent.innerHTML = htmlContent;
            this.textContent.style.opacity = '1';
            
            // Reset transition after animation
            setTimeout(() => {
                this.textContent.style.transition = '';
            }, 200);
        }, 100);
    }

    /**
     * Format text based on type with enhanced styling
     * @param {string} text - The text to format
     * @param {string} type - Type of text
     * @param {string} characterName - Character name if applicable
     * @returns {string} - Formatted HTML text
     */
    formatText(text, type, characterName) {
        // Sanitize text to prevent XSS
        const sanitizedText = this.sanitizeText(text);
        const sanitizedCharacterName = this.sanitizeText(characterName);
        
        switch (type) {
            case 'dialogue':
                if (sanitizedCharacterName) {
                    return `<span class="character-name">${sanitizedCharacterName}:</span><span class="dialogue">"${sanitizedText}"</span>`;
                }
                return `<span class="dialogue">"${sanitizedText}"</span>`;
                
            case 'character-intro':
                return `<span class="character-name character-intro">${sanitizedText}</span>`;
                
            case 'narrator':
            default:
                return `<span class="narrator">${sanitizedText}</span>`;
        }
    }

    /**
     * Sanitize text to prevent XSS attacks
     * @param {string} text - Text to sanitize
     * @returns {string} - Sanitized text
     */
    sanitizeText(text) {
        if (!text) return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Store current text state for scroll restoration
     * @param {string} textKey - Text identifier
     * @param {Object} storyData - Story data object
     */
    storeTextState(textKey, storyData) {
        this.currentTextKey = textKey;
        this.currentStoryData = storyData;
    }

    /**
     * Get current stored text state
     * @returns {Object} - Current text state
     */
    getCurrentTextState() {
        return {
            textKey: this.currentTextKey,
            storyData: this.currentStoryData,
            isVisible: this.isVisible,
            scrollPosition: this.lastKnownScrollPosition
        };
    }

    /**
     * Clear current text and hide text box
     */
    clearText() {
        this.textContent.innerHTML = '';
        this.hideTextBox();
        this.currentTextKey = null;
        this.currentStoryData = null;
        
        // Clear session storage
        sessionStorage.removeItem('storyTextState');
    }

    /**
     * Hide text box temporarily
     * @param {number} duration - Duration to hide in milliseconds
     */
    hideTemporarily(duration = 1000) {
        return new Promise((resolve) => {
            this.hideTextBox();
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }

    /**
     * Adjust text box for current viewport
     */
    adjustForViewport() {
        if (!this.textBox) return;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Adjust font size for very small screens
        if (viewportWidth < 360) {
            this.textBox.classList.add('small-screen');
        } else {
            this.textBox.classList.remove('small-screen');
        }
        
        // Adjust bottom position for very short screens
        if (viewportHeight < 600) {
            this.textBox.classList.add('short-screen');
        } else {
            this.textBox.classList.remove('short-screen');
        }
    }

    /**
     * Check if text box is currently visible
     * @returns {boolean} - Visibility state
     */
    isTextBoxVisible() {
        return this.isVisible;
    }

    /**
     * Get text box element for external manipulation
     * @returns {HTMLElement} - Text box element
     */
    getTextBoxElement() {
        return this.textBox;
    }

    /**
     * Get text content element for external manipulation
     * @returns {HTMLElement} - Text content element
     */
    getTextContentElement() {
        return this.textContent;
    }

    /**
     * Utility function for debouncing events
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
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

    /**
     * Clean up and destroy text box manager
     */
    destroy() {
        this.hideTextBox();
        this.currentTextKey = null;
        this.currentStoryData = null;
        
        // Clear session storage
        sessionStorage.removeItem('storyTextState');
        sessionStorage.removeItem('storyScrollPosition');
        
        // Remove event listeners
        window.removeEventListener('resize', this.adjustForViewport);
        
        console.log('🧹 TextBox Manager destroyed and cleaned up');
    }
}

// Export for use in main app
window.TextBoxManager = TextBoxManager;

// Auto-restore text state on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other scripts to load
    setTimeout(() => {
        if (window.storyTextBox && typeof window.storyTextBox.restoreTextStateFromSession === 'function') {
            window.storyTextBox.restoreTextStateFromSession();
        }
    }, 1000);
});

console.log('📝 Enhanced TextBox Manager loaded with scroll restoration support');