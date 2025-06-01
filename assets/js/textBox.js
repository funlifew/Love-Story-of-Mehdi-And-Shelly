/**
 * TextBox Animation Manager
 * Handles all text animations and story progression
 */
class TextBoxManager {
    constructor() {
        this.textBox = document.getElementById('textBox');
        this.textContent = document.getElementById('textContent');
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.typingSpeed = 50; // milliseconds per character
        this.currentTimeouts = [];
        
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
        // Click to skip typing animation
        this.textBox.addEventListener('click', () => {
            if (this.isTyping) {
                this.skipTypingAnimation();
            }
        });

        // Keyboard support for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Space' && this.isTyping) {
                e.preventDefault();
                this.skipTypingAnimation();
            }
        });
    }

    /**
     * Show text box with animation
     */
    showTextBox() {
        this.textBox.classList.remove('inactive', 'text-box-exit');
        this.textBox.classList.add('active', 'text-box-enter');
    }

    /**
     * Hide text box with animation
     */
    hideTextBox() {
        this.textBox.classList.remove('active', 'text-box-enter');
        this.textBox.classList.add('inactive', 'text-box-exit');
    }

    /**
     * Display text with typing animation
     * @param {string} text - The text to display
     * @param {string} type - Type of text: 'dialogue', 'narrator', 'character-intro'
     * @param {string} characterName - Name of the character (optional)
     * @param {boolean} isHeartMoment - Whether this is a romantic moment
     */
    displayText(text, type = 'narrator', characterName = '', isHeartMoment = false) {
        return new Promise((resolve) => {
            // Clear any existing timeouts
            this.clearTimeouts();
            
            // Reset text content
            this.textContent.innerHTML = '';
            
            // Add heart moment styling if needed
            if (isHeartMoment) {
                this.textBox.classList.add('heart-moment');
            } else {
                this.textBox.classList.remove('heart-moment');
            }

            // Show text box
            this.showTextBox();

            // Prepare text content based on type
            let fullText = '';
            if (type === 'dialogue' && characterName) {
                fullText = `<span class="character-name">${characterName}:</span><span class="dialogue">"${text}"</span>`;
            } else if (type === 'character-intro') {
                fullText = `<span class="character-name">${text}</span>`;
            } else {
                fullText = `<span class="narrator">${text}</span>`;
            }

            // Start typing animation
            this.typeText(fullText, resolve);
        });
    }

    /**
     * Type text character by character
     * @param {string} fullText - The full HTML text to type
     * @param {Function} callback - Callback function when typing is complete
     */
    typeText(fullText, callback) {
        this.isTyping = true;
        
        // Create a temporary element to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullText;
        
        let currentIndex = 0;
        const textNodes = this.extractTextNodes(tempDiv);
        let allText = textNodes.map(node => node.textContent).join('');
        
        // Create the structure with empty text
        this.textContent.innerHTML = fullText.replace(/>[^<]+</g, '><');
        
        // Find text elements to fill
        const textElements = this.textContent.querySelectorAll('span');
        let elementIndex = 0;
        let charIndex = 0;

        const typeNextChar = () => {
            if (currentIndex < allText.length && this.isTyping) {
                const currentElement = textElements[elementIndex];
                if (currentElement) {
                    const originalText = textNodes[elementIndex].textContent;
                    
                    if (charIndex < originalText.length) {
                        currentElement.textContent = originalText.substring(0, charIndex + 1);
                        charIndex++;
                    } else {
                        elementIndex++;
                        charIndex = 0;
                    }
                }
                
                currentIndex++;
                
                const timeout = setTimeout(typeNextChar, this.typingSpeed);
                this.currentTimeouts.push(timeout);
            } else {
                this.isTyping = false;
                // Add cursor for a moment
                this.addTypingCursor();
                
                // Remove cursor after 2 seconds and resolve
                const cursorTimeout = setTimeout(() => {
                    this.removeTypingCursor();
                    callback();
                }, 2000);
                this.currentTimeouts.push(cursorTimeout);
            }
        };

        typeNextChar();
    }

    /**
     * Extract text nodes from HTML element
     * @param {HTMLElement} element - Element to extract text from
     * @returns {Array} Array of text nodes
     */
    extractTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }

    /**
     * Skip typing animation and show full text immediately
     */
    skipTypingAnimation() {
        if (!this.isTyping) return;
        
        this.clearTimeouts();
        this.isTyping = false;
        
        // Show complete text immediately
        const spans = this.textContent.querySelectorAll('span');
        spans.forEach((span, index) => {
            const textNode = this.extractTextNodes(span.parentElement)[index];
            if (textNode) {
                span.textContent = textNode.textContent;
            }
        });
        
        this.removeTypingCursor();
    }

    /**
     * Add typing cursor to the end of text
     */
    addTypingCursor() {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.id = 'typingCursor';
        this.textContent.appendChild(cursor);
    }

    /**
     * Remove typing cursor
     */
    removeTypingCursor() {
        const cursor = document.getElementById('typingCursor');
        if (cursor) {
            cursor.remove();
        }
    }

    /**
     * Clear all active timeouts
     */
    clearTimeouts() {
        this.currentTimeouts.forEach(timeout => clearTimeout(timeout));
        this.currentTimeouts = [];
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
     * Clean up and destroy text box manager
     */
    destroy() {
        this.clearTimeouts();
        this.hideTextBox();
    }
}

// Export for use in main app
window.TextBoxManager = TextBoxManager;