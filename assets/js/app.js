/**
 * Main Story Animation Controller
 * Manages GSAP animations, scroll triggers, and story progression
 */
class StoryAnimationController {
    constructor() {
        this.textBoxManager = null;
        this.currentScene = 0;
        this.isAnimating = false;
        this.timeline = null;
        this.currentTextKey = null;
        this.sceneTextStates = new Map(); // Track text states per scene
        
        this.init();
    }

    /**
     * Initialize the animation controller
     */
    init() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        
        // Wait for DOM and dependencies to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    /**
     * Handle DOM ready event
     */
    onDOMReady() {
        this.initializeTextBox();
        this.initializeCharacters();
        this.createScrollTriggers();
        this.startStoryAnimation();
    }

    /**
     * Initialize text box manager
     */
    initializeTextBox() {
        if (typeof TextBoxManager !== 'undefined') {
            this.textBoxManager = new TextBoxManager();
            window.storyTextBox = this.textBoxManager;
            console.log('✅ TextBox Manager initialized successfully');
        } else {
            console.error('❌ TextBoxManager not found. Make sure textBox.js is loaded.');
        }
    }

    /**
     * Initialize character elements and set starting positions
     */
    initializeCharacters() {
        // Get character elements
        this.characters = {
            mehdiSide: document.getElementById('mehdiSide'),
            shellySide: document.getElementById('shellySide'),
            mehdiFront: document.getElementById('mehdiFront'),
            shellyFront: document.getElementById('shellyFront'),
            heart: document.getElementById('heart')
        };

        // Set initial states
        gsap.set([this.characters.mehdiSide, this.characters.shellySide], {
            opacity: 0,
            scale: 0.8
        });

        gsap.set([this.characters.mehdiFront, this.characters.shellyFront], {
            opacity: 0,
            scale: 0.8
        });

        gsap.set(this.characters.heart, {
            opacity: 0,
            scale: 0
        });

        console.log('✅ Characters initialized');
    }

    /**
     * Get the appropriate text for a given scroll progress
     * @param {number} sceneNumber - Scene number (1-5)
     * @param {number} progress - Progress within scene (0-1)
     * @returns {string|null} - Text key to display
     */
    getTextForProgress(sceneNumber, progress) {
        switch(sceneNumber) {
            case 1:
                if (progress >= 0.7) return 'mehdiThought';
                if (progress >= 0.3) return 'mehdiIntro';
                if (progress >= 0) return 'mehdiEnters';
                break;
            case 2:
                if (progress >= 0.9) return 'shellyThought';
                if (progress >= 0.7) return 'shellyIntro';
                if (progress >= 0.4) return 'shellyEnters';
                if (progress >= 0) return 'transition1';
                break;
            case 3:
                if (progress >= 0.8) return 'shellyMeetsMehdi';
                if (progress >= 0.5) return 'mehdiMeetsShelly';
                if (progress >= 0.3) return 'firstSight';
                if (progress >= 0) return 'meetingMoment';
                break;
            case 4:
                if (progress >= 0.8) return 'shellyResponse';
                if (progress >= 0.4) return 'mehdiConfession';
                if (progress >= 0) return 'connectionGrows';
                break;
            case 5:
                if (progress >= 0.9) return 'theEnd';
                if (progress >= 0.7) return 'finalWords';
                if (progress >= 0.3) return 'heartAppears';
                if (progress >= 0) return 'loveBlossoms';
                break;
        }
        return null;
    }

    /**
     * Update text based on current scroll position
     * @param {number} sceneNumber - Current scene
     * @param {number} progress - Progress within scene
     * @param {boolean} isScrollingUp - Whether user is scrolling up
     */
    updateTextForProgress(sceneNumber, progress, isScrollingUp = false) {
        const textKey = this.getTextForProgress(sceneNumber, progress);
        
        if (textKey && textKey !== this.currentTextKey) {
            this.currentTextKey = textKey;
            
            if (isScrollingUp) {
                // For scrolling up, show text instantly
                this.playStoryTextInstant(textKey);
            } else {
                // For scrolling down, use normal typing animation
                this.playStoryText(textKey);
            }
        } else if (!textKey && this.currentTextKey) {
            // Clear text if no text should be shown at this position
            this.textBoxManager.clearText();
            this.currentTextKey = null;
        }
    }

    /**
     * Create scroll-triggered animation sequences
     */
    createScrollTriggers() {
        let lastScrollY = 0;
        
        // Scene 1: Mehdi enters (0-20% scroll)
        this.createScene1(lastScrollY);
        
        // Scene 2: Mehdi exits, Shelly enters (20-40% scroll)
        this.createScene2(lastScrollY);
        
        // Scene 3: Both meet in center (40-60% scroll)
        this.createScene3(lastScrollY);
        
        // Scene 4: Love develops (60-80% scroll)
        this.createScene4(lastScrollY);
        
        // Scene 5: Heart appears (80-100% scroll)
        this.createScene5(lastScrollY);
    }

    /**
     * Scene 1: Mehdi enters from left
     */
    createScene1() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "top top",
                end: "20% bottom",
                scrub: 1,
                onUpdate: (self) => {
                    const isScrollingUp = self.direction === -1;
                    this.updateTextForProgress(1, self.progress, isScrollingUp);
                }
            }
        });

        tl.to(this.characters.mehdiSide, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
        })
        .to(this.characters.mehdiSide, {
            x: "20vw",
            duration: 1,
            ease: "power1.inOut"
        });
    }

    /**
     * Scene 2: Mehdi exits, Shelly enters
     */
    createScene2() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "20% top",
                end: "40% bottom",
                scrub: 1,
                onUpdate: (self) => {
                    const isScrollingUp = self.direction === -1;
                    this.updateTextForProgress(2, self.progress, isScrollingUp);
                }
            }
        });

        tl.to(this.characters.mehdiSide, {
            x: "-100vw",
            opacity: 0,
            duration: 1,
            ease: "power2.in"
        })
        .to(this.characters.shellySide, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.5")
        .to(this.characters.shellySide, {
            x: "-20vw",
            duration: 1,
            ease: "power1.inOut"
        });
    }

    /**
     * Scene 3: Both characters meet in center
     */
    createScene3() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "40% top",
                end: "60% bottom",
                scrub: 1,
                onUpdate: (self) => {
                    const isScrollingUp = self.direction === -1;
                    this.updateTextForProgress(3, self.progress, isScrollingUp);
                }
            }
        });

        // Hide side views and show front views
        tl.to([this.characters.mehdiSide, this.characters.shellySide], {
            opacity: 0,
            scale: 0.8,
            duration: 0.5
        })
        .to([this.characters.mehdiFront, this.characters.shellyFront], {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out"
        }, "-=0.3")
        .to(this.characters.mehdiFront, {
            x: "10vw",
            duration: 1,
            ease: "power1.inOut"
        }, "-=0.5")
        .to(this.characters.shellyFront, {
            x: "-10vw",
            duration: 1,
            ease: "power1.inOut"
        }, "-=1");
    }

    /**
     * Scene 4: Love develops
     */
    createScene4() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "60% top",
                end: "80% bottom",
                scrub: 1,
                onUpdate: (self) => {
                    const isScrollingUp = self.direction === -1;
                    this.updateTextForProgress(4, self.progress, isScrollingUp);
                }
            }
        });

        // Bring characters closer together
        tl.to(this.characters.mehdiFront, {
            x: "5vw",
            scale: 1.1,
            duration: 1,
            ease: "power2.inOut"
        })
        .to(this.characters.shellyFront, {
            x: "-5vw",
            scale: 1.1,
            duration: 1,
            ease: "power2.inOut"
        }, "-=1");
    }

    /**
     * Scene 5: Heart appears - Love declared
     */
    createScene5() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "80% top",
                end: "100% bottom",
                scrub: 1,
                onUpdate: (self) => {
                    const isScrollingUp = self.direction === -1;
                    this.updateTextForProgress(5, self.progress, isScrollingUp);
                    
                    // Handle heart animation
                    if (self.progress > 0.3 && !this.characters.heart.classList.contains('animate')) {
                        this.animateHeart();
                    } else if (self.progress <= 0.3 && this.characters.heart.classList.contains('animate')) {
                        this.stopHeartAnimation();
                    }
                }
            }
        });

        // Show heart and animate
        tl.to(this.characters.heart, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)"
        })
        .to([this.characters.mehdiFront, this.characters.shellyFront], {
            scale: 1.2,
            duration: 0.5,
            ease: "power2.inOut"
        }, "-=0.5");
    }

    /**
     * Animate heart with bounce effect
     */
    animateHeart() {
        if (this.characters.heart && !this.characters.heart.classList.contains('animate')) {
            this.characters.heart.classList.add('animate');
            
            // Add continuous heartbeat animation
            this.heartAnimation = gsap.to(this.characters.heart, {
                scale: 1.1,
                duration: 0.6,
                yoyo: true,
                repeat: -1,
                ease: "power2.inOut"
            });
        }
    }

    /**
     * Stop heart animation
     */
    stopHeartAnimation() {
        if (this.characters.heart) {
            this.characters.heart.classList.remove('animate');
            if (this.heartAnimation) {
                this.heartAnimation.kill();
                this.heartAnimation = null;
            }
        }
    }

    /**
     * Play story text with typing animation
     * @param {string} textKey - Key from STORY_TEXTS object
     */
    async playStoryText(textKey) {
        if (!this.textBoxManager || !window.STORY_TEXTS) {
            console.warn(`Cannot display text: ${textKey}`);
            return;
        }

        const storyData = window.STORY_TEXTS[textKey];
        if (!storyData) {
            console.warn(`Story text not found: ${textKey}`);
            return;
        }

        try {
            await this.textBoxManager.displayText(
                storyData.text,
                storyData.type || 'narrator',
                storyData.character || '',
                storyData.isHeartMoment || false
            );
        } catch (error) {
            console.error(`Error displaying text ${textKey}:`, error);
        }
    }


    /**
     * Play story text instantly (for scroll restoration)
     * @param {string} textKey - Key from STORY_TEXTS object
     */
    playStoryTextInstant(textKey) {
        if (!this.textBoxManager || !window.STORY_TEXTS) {
            console.warn(`Cannot display text: ${textKey}`);
            return;
        }

        const storyData = window.STORY_TEXTS[textKey];
        if (!storyData) {
            console.warn(`Story text not found: ${textKey}`);
            return;
        }

        try {
            this.textBoxManager.displayTextInstant(
                storyData.text,
                storyData.type || 'narrator',
                storyData.character || '',
                storyData.isHeartMoment || false
            );
        } catch (error) {
            console.error(`Error displaying instant text ${textKey}:`, error);
        }
    }

    /**
     * Start the story animation sequence
     */
    startStoryAnimation() {
        console.log('🎬 Story animation started!');
        
        // Add smooth scrolling
        this.setupSmoothScrolling();
        
        // Add keyboard controls for development
        this.setupKeyboardControls();
    }

    /**
     * Setup smooth scrolling behavior
     */
    setupSmoothScrolling() {
        // Add CSS for smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Optional: Add custom easing for scroll
        gsap.to("body", {
            duration: 0.1,
            ease: "power2.out"
        });
    }

    /**
     * Setup keyboard controls for development/testing
     */
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowDown':
                    // Scroll down 20%
                    window.scrollBy(0, window.innerHeight * 0.2);
                    break;
                case 'ArrowUp':
                    // Scroll up 20%
                    window.scrollBy(0, -window.innerHeight * 0.2);
                    break;
                case ' ':
                    // Space bar: skip to next scene
                    e.preventDefault();
                    this.skipToNextScene();
                    break;
                case 'r':
                    // R key: restart animation
                    window.scrollTo(0, 0);
                    break;
            }
        });
    }

    /**
     * Skip to next scene (for development)
     */
    skipToNextScene() {
        this.currentScene++;
        const targetScroll = (this.currentScene * 0.2) * document.body.scrollHeight;
        window.scrollTo(0, Math.min(targetScroll, document.body.scrollHeight));
    }

    /**
     * Reset animation to beginning
     */
    resetAnimation() {
        window.scrollTo(0, 0);
        this.currentScene = 0;
        this.currentTextKey = null;
        
        // Reset character classes
        Object.values(this.characters).forEach(char => {
            if (char) {
                char.classList.remove('text-shown', 'dialogue-shown', 'entered', 'intro-shown', 'animate');
            }
        });

        // Stop heart animation
        this.stopHeartAnimation();
        
        // Clear text
        if (this.textBoxManager) {
            this.textBoxManager.clearText();
        }
    }

    /**
     * Destroy all animations and clean up
     */
    destroy() {
        ScrollTrigger.killAll();
        if (this.timeline) {
            this.timeline.kill();
        }
        if (this.heartAnimation) {
            this.heartAnimation.kill();
        }
        if (this.textBoxManager) {
            this.textBoxManager.destroy();
        }
    }
}

// Initialize the story animation when the script loads
const storyController = new StoryAnimationController();

// Export for global access
window.storyController = storyController;

/**
 * Development helper functions
 */
window.devHelpers = {
    skipToScene: (sceneNumber) => {
        const targetScroll = (sceneNumber * 0.2) * document.body.scrollHeight;
        window.scrollTo(0, Math.min(targetScroll, document.body.scrollHeight));
    },
    
    resetStory: () => {
        storyController.resetAnimation();
    },
    
    testTextBox: () => {
        if (window.storyTextBox && window.STORY_TEXTS) {
            storyController.playStoryText('mehdiEnters');
        }
    }
};

console.log('🎭 Story Animation System Loaded');
console.log('Use arrow keys to scroll, spacebar to skip scenes, R to restart');
console.log('Dev helpers available: window.devHelpers.skipToScene(1-5), window.devHelpers.resetStory(), window.devHelpers.testTextBox()');