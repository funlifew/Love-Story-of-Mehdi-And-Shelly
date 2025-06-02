/**
 * TextBox Animation Manager
 * Handles text display with appearing/disappearing animations only
 */
class TextBoxManager {
    constructor() {
        this.textBox = document.getElementById('textBox');
        this.textContent = document.getElementById('textContent');
        this.currentTextKey = null;
        this.currentStoryData = null;
        this.isVisible = false;
        
        this.init();
    }

    /**
     * Initialize the text box manager
     */
    init() {
        this.hideTextBox();
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for text box interactions
     */
    setupEventListeners() {
        // Optional: Click to hide text box
        this.textBox.addEventListener('click', () => {
            if (this.isVisible) {
                this.hideTextBox();
            }
        });

        // Keyboard support for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideTextBox();
            }
        });
    }

    /**
     * Show text box with animation
     */
    showTextBox() {
        if (!this.isVisible) {
            this.textBox.classList.remove('inactive', 'text-box-exit');
            this.textBox.classList.add('active', 'text-box-enter');
            this.isVisible = true;
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
        }
    }

    /**
     * Display text instantly with appear animation
     * @param {string} text - The text to display
     * @param {string} type - Type of text: 'dialogue', 'narrator', 'character-intro'
     * @param {string} characterName - Name of the character (optional)
     * @param {boolean} isHeartMoment - Whether this is a romantic moment
     */
    displayText(text, type = 'narrator', characterName = '', isHeartMoment = false) {
        return new Promise((resolve) => {
            // Store current state
            this.storeTextState(text, { text, type, characterName, isHeartMoment });
            
            // Add heart moment styling if needed
            if (isHeartMoment) {
                this.textBox.classList.add('heart-moment');
            } else {
                this.textBox.classList.remove('heart-moment');
            }

            // Prepare text content based on type
            let fullText = this.formatText(text, type, characterName);
            
            // Set text content instantly
            this.textContent.innerHTML = fullText;
            
            // Show text box with animation
            this.showTextBox();
            
            // Resolve immediately since there's no typing animation
            resolve();
        });
    }

    /**
     * Display text instantly without any animation (for scroll restoration)
     * @param {string} text - The text to display
     * @param {string} type - Type of text: 'dialogue', 'narrator', 'character-intro'
     * @param {string} characterName - Name of the character (optional)
     * @param {boolean} isHeartMoment - Whether this is a romantic moment
     */
    displayTextInstant(text, type = 'narrator', characterName = '', isHeartMoment = false) {
        // Store current state
        this.storeTextState(text, { text, type, characterName, isHeartMoment });
        
        // Add heart moment styling if needed
        if (isHeartMoment) {
            this.textBox.classList.add('heart-moment');
        } else {
            this.textBox.classList.remove('heart-moment');
        }

        // Prepare text content based on type
        let fullText = this.formatText(text, type, characterName);
        
        // Set text content instantly
        this.textContent.innerHTML = fullText;
        
        // Show text box instantly (no animation)
        this.textBox.classList.remove('inactive', 'text-box-exit');
        this.textBox.classList.add('active');
        this.isVisible = true;
    }

    /**
     * Format text based on type
     * @param {string} text - The text to format
     * @param {string} type - Type of text
     * @param {string} characterName - Character name if applicable
     * @returns {string} - Formatted HTML text
     */
    formatText(text, type, characterName) {
        if (type === 'dialogue' && characterName) {
            return `<span class="character-name">${characterName}:</span><span class="dialogue">"${text}"</span>`;
        } else if (type === 'character-intro') {
            return `<span class="character-name">${text}</span>`;
        } else {
            return `<span class="narrator">${text}</span>`;
        }
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
            storyData: this.currentStoryData
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
     * Check if text box is currently visible
     * @returns {boolean} - Visibility state
     */
    isTextBoxVisible() {
        return this.isVisible;
    }

    /**
     * Clean up and destroy text box manager
     */
    destroy() {
        this.hideTextBox();
        this.currentTextKey = null;
        this.currentStoryData = null;
    }
}

// Export for use in main app
window.TextBoxManager = TextBoxManager;