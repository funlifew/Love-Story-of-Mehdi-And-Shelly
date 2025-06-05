class StoryAnimationController {
    constructor() {
        this.textBoxManager = null;
        this.currentScene = 0;
        this.isAnimating = false;
        this.timeline = null;
        this.currentTextKey = null;
        this.lastScrollPosition = 0;
        this.scrollDirection = 1; // 1 for down, -1 for up
        
        this.init();
    }
    init() {
        gsap.registerPlugin(ScrollTrigger);
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        this.initializeTextBox();
        this.initializeCharacters();
        this.setupScrollTracking();
        this.createScrollTriggers();
        this.restoreScrollPosition();
        this.startStoryAnimation();
    }

    initializeTextBox() {
        if (typeof TextBoxManager !== 'undefined') {
            this.textBoxManager = new TextBoxManager();
            window.storyTextBox = this.textBoxManager;
            console.log('✅ TextBox Manager initialized successfully');
        } else {
            console.error('❌ TextBoxManager not found. Make sure textBox.js is loaded.');
        }
    }

    initializeCharacters() {
        // Get character elements
        this.characters = {
            mehdiSide: document.getElementById('mehdiSide'),
            shellySide: document.getElementById('shellySide'),
            mehdiFront: document.getElementById('mehdiFront'),
            shellyFront: document.getElementById('shellyFront'),
            heart: document.getElementById('heart')
        };

        // Set initial states - Fixed positioning
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
            scale: 0,
            x: 0,
            y: 0
        });

        console.log('✅ Characters initialized with fixed positioning');
    }

    /**
     * Setup scroll direction tracking
     */
    setupScrollTracking() {
        let ticking = false;
        
        const updateScrollDirection = () => {
            const currentScrollY = window.scrollY;
            this.scrollDirection = currentScrollY > this.lastScrollPosition ? 1 : -1;
            this.lastScrollPosition = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollDirection);
                ticking = true;
            }
        });
    }

    /**
     * Restore scroll position and display appropriate text on page refresh
     */
    restoreScrollPosition() {
        // Wait a frame for everything to initialize
        requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = currentScroll / totalHeight;
            
            // Determine current scene and progress
            let sceneNumber, sceneProgress;
            
            if (scrollProgress <= 0.2) {
                sceneNumber = 1;
                sceneProgress = scrollProgress / 0.2;
            } else if (scrollProgress <= 0.4) {
                sceneNumber = 2;
                sceneProgress = (scrollProgress - 0.2) / 0.2;
            } else if (scrollProgress <= 0.6) {
                sceneNumber = 3;
                sceneProgress = (scrollProgress - 0.4) / 0.2;
            } else if (scrollProgress <= 0.8) {
                sceneNumber = 4;
                sceneProgress = (scrollProgress - 0.6) / 0.2;
            } else {
                sceneNumber = 5;
                sceneProgress = (scrollProgress - 0.8) / 0.2;
            }
            
            // Display appropriate text instantly
            this.updateTextForProgress(sceneNumber, sceneProgress, true);
            
            console.log(`📍 Restored to scene ${sceneNumber}, progress: ${sceneProgress.toFixed(2)}`);
        });
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
     * @param {boolean} isInstant - Whether to show text instantly
     */
    updateTextForProgress(sceneNumber, progress, isInstant = false) {
        const textKey = this.getTextForProgress(sceneNumber, progress);
        
        if (textKey && textKey !== this.currentTextKey) {
            this.currentTextKey = textKey;
            
            if (isInstant || this.scrollDirection === -1) {
                // For scrolling up or page restoration, show text instantly
                this.playStoryTextInstant(textKey);
            } else {
                // For scrolling down, use normal animation
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
        // Scene 1: Mehdi enters (0-20% scroll)
        this.createScene1();
        
        // Scene 2: Mehdi exits, Shelly enters (20-40% scroll)
        this.createScene2();
        
        // Scene 3: Both meet in center - using side views (40-60% scroll)
        this.createScene3();
        
        // Scene 4: Love develops - switch to front views (60-80% scroll)
        this.createScene4();
        
        // Scene 5: Heart appears (80-100% scroll)
        this.createScene5();
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
                    this.updateTextForProgress(1, self.progress);
                }
            }
        });

        // Mehdi enters and moves to center-left
        tl.to(this.characters.mehdiSide, {
            opacity: 1,
            scale: 1,
            x: "25vw",
            duration: 1,
            ease: "power2.out"
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
                    this.updateTextForProgress(2, self.progress);
                }
            }
        });

        // Mehdi exits left, Shelly enters and moves to center-right
        tl.to(this.characters.mehdiSide, {
            x: "-100vw",
            opacity: 0,
            duration: 1,
            ease: "power2.in"
        })
        .to(this.characters.shellySide, {
            opacity: 1,
            scale: 1,
            x: "-25vw",
            duration: 1,
            ease: "power2.out"
        }, "-=0.5");
    }

    /**
     * Scene 3: Both characters meet in center - using side views
     */
    createScene3() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "40% top",
                end: "60% bottom",
                scrub: 1,
                onUpdate: (self) => {
                    this.updateTextForProgress(3, self.progress);
                }
            }
        });

        // Bring both side characters closer to center but don't overlap
        tl.to(this.characters.mehdiSide, {
            opacity: 1,
            scale: 1,
            x: "15vw", // Closer to center but still left
            duration: 0.5,
            ease: "power2.out"
        })
        .to(this.characters.shellySide, {
            x: "-15vw", // Closer to center but still right
            duration: 1,
            ease: "power2.inOut"
        }, "-=0.5");
    }

    /**
     * Scene 4: Love develops - switch to front views
     */
    createScene4() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "60% top",
                end: "80% bottom",
                scrub: 1,
                onUpdate: (self) => {
                    this.updateTextForProgress(4, self.progress);
                }
            }
        });

        // Hide side views and show front views for intimate conversation
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
        }, "-=0.3");
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
                    this.updateTextForProgress(5, self.progress);
                    
                    // Handle heart animation
                    if (self.progress > 0.3) {
                        this.showHeart();
                        if (self.progress > 0.5) {
                            this.animateHeart();
                        }
                    } else {
                        this.hideHeart();
                    }
                }
            }
        });

        // Scale up characters slightly for the final romantic scene
        tl.to([this.characters.mehdiFront, this.characters.shellyFront], {
            scale: 1.1,
            duration: 0.5,
            ease: "power2.inOut"
        })
        .to(this.characters.heart, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=0.3");
    }

    /**
     * Show heart with proper positioning
     */
    showHeart() {
        if (this.characters.heart && !this.characters.heart.classList.contains('visible')) {
            this.characters.heart.classList.add('visible');
            gsap.to(this.characters.heart, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            });
        }
    }

    /**
     * Hide heart
     */
    hideHeart() {
        if (this.characters.heart && this.characters.heart.classList.contains('visible')) {
            this.characters.heart.classList.remove('visible', 'animate');
            gsap.to(this.characters.heart, {
                opacity: 0,
                scale: 0,
                duration: 0.5,
                ease: "power2.in"
            });
            this.stopHeartAnimation();
        }
    }

    /**
     * Animate heart with bounce effect
     */
    animateHeart() {
        if (this.characters.heart && !this.characters.heart.classList.contains('animate')) {
            this.characters.heart.classList.add('animate');
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
                char.classList.remove('visible', 'animate');
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
    },
    
    getCurrentScene: () => {
        const currentScroll = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = currentScroll / totalHeight;
        
        if (scrollProgress <= 0.2) return 1;
        if (scrollProgress <= 0.4) return 2;
        if (scrollProgress <= 0.6) return 3;
        if (scrollProgress <= 0.8) return 4;
        return 5;
    }
};

console.log('Use arrow keys to scroll, spacebar to skip scenes, R to restart');
console.log('Dev helpers: devHelpers.skipToScene(1-5), devHelpers.resetStory(), devHelpers.testTextBox(), devHelpers.getCurrentScene()');