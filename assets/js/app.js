/**
 * Responsive Story Animation Controller
 * Handles scroll-based story animations with full mobile responsiveness
 * Optimized for iPhone 7 and all mobile devices
 */
class ResponsiveStoryAnimationController {
    constructor() {
        this.textBoxManager = null;
        this.currentScene = 0;
        this.isAnimating = false;
        this.timeline = null;
        this.currentTextKey = null;
        this.lastScrollPosition = 0;
        this.scrollDirection = 1; // 1 for down, -1 for up
        
        // Device and viewport tracking
        this.isMobile = false;
        this.isTablet = false;
        this.isLandscape = false;
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        
        // Media queries for responsive breakpoints
        this.mediaQueries = {
            mobile: window.matchMedia('(max-width: 767px)'),
            tablet: window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
            desktop: window.matchMedia('(min-width: 1024px)'),
            landscape: window.matchMedia('(orientation: landscape)'),
            portrait: window.matchMedia('(orientation: portrait)'),
            smallMobile: window.matchMedia('(max-width: 480px)'), // iPhone 7 and smaller
            retina: window.matchMedia('(-webkit-min-device-pixel-ratio: 2)')
        };
        
        // Animation configurations for different devices
        this.animationConfig = {
            mobile: {
                characterScale: 0.9,
                moveDistance: '30vw',      // How far Mehdi moves in Scene 1
                meetDistance: '15vw',      // How far characters move to meet in Scene 3
                heartScale: 0.9,
                animationDuration: 1.2,
                scrollSensitivity: 0.8
            },
            tablet: {
                characterScale: 0.9,
                moveDistance: '35vw',
                meetDistance: '35vw',
                heartScale: 0.9,
                animationDuration: 1.0,
                scrollSensitivity: 1.0
            },
            desktop: {
                characterScale: 1.0,
                moveDistance: '40vw',
                meetDistance: '50vw',
                heartScale: 1.0,
                animationDuration: 1.0,
                scrollSensitivity: 1.0
            }
        };
        
        this.init();
    }

    /**
     * Initialize the controller with responsive setup
     */
    init() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Setup responsive listeners first
        this.setupResponsiveListeners();
        this.updateDeviceState();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    /**
     * Setup media query listeners for responsive behavior
     */
    setupResponsiveListeners() {
        // Listen for device orientation changes
        this.mediaQueries.landscape.addListener((e) => {
            this.isLandscape = e.matches;
            this.handleOrientationChange();
        });

        this.mediaQueries.portrait.addListener((e) => {
            this.handleOrientationChange();
        });

        // Listen for viewport size changes
        this.mediaQueries.mobile.addListener((e) => {
            this.isMobile = e.matches;
            this.handleDeviceChange();
        });

        this.mediaQueries.tablet.addListener((e) => {
            this.isTablet = e.matches;
            this.handleDeviceChange();
        });

        // Handle window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });

        // Handle iOS viewport changes (address bar hide/show)
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 500);
        });
    }

    /**
     * Update device state based on current viewport
     */
    updateDeviceState() {
        this.isMobile = this.mediaQueries.mobile.matches;
        this.isTablet = this.mediaQueries.tablet.matches;
        this.isLandscape = this.mediaQueries.landscape.matches;
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        
        console.log(`📱 Device state: Mobile: ${this.isMobile}, Tablet: ${this.isTablet}, Landscape: ${this.isLandscape}`);
    }

    /**
     * Handle device type changes
     */
    handleDeviceChange() {
        this.updateDeviceState();
        this.refreshAnimations();
        this.updateCharacterPositions();
    }

    /**
     * Handle orientation changes
     */
    handleOrientationChange() {
        this.updateDeviceState();
        
        // Small delay to let the browser finish orientation change
        setTimeout(() => {
            ScrollTrigger.refresh();
            this.updateCharacterPositions();
            this.restoreScrollPosition();
        }, 300);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        this.updateDeviceState();
        ScrollTrigger.refresh();
        this.updateCharacterPositions();
    }

    /**
     * Get current animation configuration based on device
     */
    getCurrentConfig() {
        if (this.isMobile) return this.animationConfig.mobile;
        if (this.isTablet) return this.animationConfig.tablet;
        return this.animationConfig.desktop;
    }

    /**
     * DOM ready handler with responsive initialization
     */
    onDOMReady() {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        window.scroll(0, 0);
        this.initializeTextBox();
        this.initializeCharacters();
        this.setupScrollTracking();
        this.createResponsiveScrollTriggers();
        
        // Longer delay for mobile devices
        const refreshDelay = this.isMobile ? 800 : 500;
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, refreshDelay);
        
        setTimeout(() => {
            this.restoreScrollPosition();
        }, 200);
        
        this.startStoryAnimation();
    }

    /**
     * Initialize text box with responsive settings
     */
    initializeTextBox() {
        if (typeof TextBoxManager !== 'undefined') {
            // Pass responsive settings to text box manager
            const textBoxConfig = {
                isMobile: this.isMobile,
                isTablet: this.isTablet,
                fontSize: this.isMobile ? '14px' : '16px',
                padding: this.isMobile ? '15px' : '20px'
            };
            
            this.textBoxManager = new TextBoxManager(textBoxConfig);
            window.storyTextBox = this.textBoxManager;
            console.log('✅ Responsive TextBox Manager initialized');
        } else {
            console.error('❌ TextBoxManager not found. Make sure textBox.js is loaded.');
        }
    }

    /**
     * Initialize characters with responsive positioning
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

        // Apply responsive initial states
        this.setResponsiveCharacterStates();
        
        console.log('✅ Characters initialized with responsive positioning');
    }

    /**
     * Set responsive character states based on device
     */
    setResponsiveCharacterStates() {
        const config = this.getCurrentConfig();
        
        // Set initial states for side characters
        gsap.set([this.characters.mehdiSide, this.characters.shellySide], {
            opacity: 0,
            scale: config.characterScale * 0.8,
            transformOrigin: "center center"
        });

        // Set initial states for front characters
        gsap.set([this.characters.mehdiFront, this.characters.shellyFront], {
            opacity: 0,
            scale: config.characterScale * 0.8,
            transformOrigin: "center center"
        });

        // Heart positioning - more responsive
        const heartConfig = this.getResponsiveHeartPosition();
        gsap.set(this.characters.heart, {
            opacity: 0,
            scale: 0,
            xPercent: -50,
            yPercent: -50,
            top: heartConfig.top,
            left: heartConfig.left,
            transformOrigin: "center center"
        });
    }

    /**
     * Get responsive heart position based on device and orientation
     */
    getResponsiveHeartPosition() {
        if (this.isMobile) {
            return {
                top: this.isLandscape ? "30%" : "25%",
                left: "50%"
            };
        } else if (this.isTablet) {
            return {
                top: "27%",
                left: "50%"
            };
        } else {
            return {
                top: "25%",
                left: "50%"
            };
        }
    }

    /**
     * Update character positions for current viewport
     */
    updateCharacterPositions() {
        if (!this.characters.mehdiSide) return;
        
        this.setResponsiveCharacterStates();
        
        // Update heart position
        const heartConfig = this.getResponsiveHeartPosition();
        gsap.set(this.characters.heart, {
            top: heartConfig.top,
            left: heartConfig.left
        });
    }

    /**
     * Setup scroll direction tracking with mobile optimization
     */
    setupScrollTracking() {
        let ticking = false;
        const scrollSensitivity = this.getCurrentConfig().scrollSensitivity;
        
        const updateScrollDirection = () => {
            const currentScrollY = window.scrollY;
            const scrollDiff = Math.abs(currentScrollY - this.lastScrollPosition);
            
            // Adjust sensitivity for mobile
            if (scrollDiff > (this.isMobile ? 5 : 10)) {
                this.scrollDirection = currentScrollY > this.lastScrollPosition ? 1 : -1;
                this.lastScrollPosition = currentScrollY;
            }
            
            ticking = false;
        };

        // Use passive listeners for better mobile performance
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollDirection);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Restore scroll position with responsive text display
     */
    restoreScrollPosition() {
        requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = Math.max(0, Math.min(1, currentScroll / totalHeight));
            
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
     * Get the appropriate text key for given progress (unchanged)
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
     * Update text for progress with responsive handling
     */
    updateTextForProgress(sceneNumber, progress, isInstant = false) {
        const textKey = this.getTextForProgress(sceneNumber, progress);
        
        if (textKey && textKey !== this.currentTextKey) {
            this.currentTextKey = textKey;
            
            if (isInstant || this.scrollDirection === -1) {
                this.playStoryTextInstant(textKey);
            } else {
                this.playStoryText(textKey);
            }
        } else if (!textKey && this.currentTextKey) {
            this.textBoxManager?.clearText();
            this.currentTextKey = null;
        }
    }

    /**
     * Create responsive scroll triggers
     */
    createResponsiveScrollTriggers() {
        // Kill existing triggers
        ScrollTrigger.killAll();
        
        // Create scenes with responsive settings
        this.createResponsiveScene1();
        this.createResponsiveScene2();
        this.createResponsiveScene3();
        this.createResponsiveScene4();
        this.createResponsiveScene5();
    }

    /**
     * Refresh all animations with new responsive settings
     */
    refreshAnimations() {
        this.createResponsiveScrollTriggers();
        ScrollTrigger.refresh();
    }

    /**
     * Scene 1: Mehdi enters (responsive)
     */
    createResponsiveScene1() {
        const config = this.getCurrentConfig();
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "top top",
                end: "20% bottom",
                scrub: config.scrollSensitivity,
                onUpdate: (self) => {
                    this.updateTextForProgress(1, self.progress);
                }
            }
        });

        // Mehdi enters from the left and stops on the left side of the screen
        tl.to(this.characters.mehdiSide, {
            opacity: 1,
            scale: config.characterScale,
            x: config.moveDistance, // Moves from -30vw to 30vw, stopping at left: 0
            duration: config.animationDuration,
            ease: "power2.out"
        });
    }

    /**
     * Scene 2: Mehdi exits, Shelly enters (responsive)
     */
    createResponsiveScene2() {
        const config = this.getCurrentConfig();

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "20% top",
                end: "40% bottom",
                scrub: config.scrollSensitivity,
                onUpdate: (self) => {
                    this.updateTextForProgress(2, self.progress);
                }
            }
        });

        // Mehdi exits to the left
        tl.to(this.characters.mehdiSide, {
            x: '-=40vw', // Move further left off-screen
            opacity: 0,
            duration: config.animationDuration * 0.8,
            ease: "power2.in"
        })

        // Shelly enters from the right
        .to(this.characters.shellySide, {
            x: `-${config.moveDistance}`, // Moves from right: -30vw to right: 0
            opacity: 1,
            scale: config.characterScale,
            duration: config.animationDuration,
            ease: "power2.out"
        }, ">-0.3"); // Start Shelly's animation slightly before Mehdi's finishes
    }


    /**
     * Scene 3: Both characters meet (responsive)
     */
    createResponsiveScene3() {
        const config = this.getCurrentConfig();
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "40% top",
                end: "60% bottom",
                scrub: config.scrollSensitivity,
                onUpdate: (self) => {
                    this.updateTextForProgress(3, self.progress);
                }
            }
        });

        // First, ensure both characters are visible and in their starting positions
        // Mehdi is already on the left. Shelly exits from her scene 2 position.
        tl.to(this.characters.shellySide, { x: 0, opacity: 0, duration: 0.5 })
        // Bring Mehdi (side view) back into the scene on the left
        .to(this.characters.mehdiSide, {
                opacity: 1,
                x: config.moveDistance, // His end position from scene 1
                duration: config.animationDuration
        }, 0)
        // Bring Shelly (side view) into the scene on the right
        .to(this.characters.shellySide, {
                opacity: 1,
                x: `-${config.moveDistance}`, // Her end position from scene 2
                duration: config.animationDuration
        }, 0)
        // They now move towards the center to 'meet'
        .to(this.characters.mehdiSide, {
                x: `+=${config.meetDistance}`,
                duration: config.animationDuration,
                ease: "power2.inOut"
        }, ">-0.5")
        .to(this.characters.shellySide, {
                x: `+=${config.meetDistance}`,
                duration: config.animationDuration,
                ease: "power2.inOut"
        }, "<");
    }

    /**
     * Scene 4: Love develops - front views (responsive)
     */
    createResponsiveScene4() {
        const config = this.getCurrentConfig();
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "60% top",
                end: "80% bottom",
                scrub: config.scrollSensitivity,
                onUpdate: (self) => {
                    this.updateTextForProgress(4, self.progress);
                }
            }
        });

        // Fade out the side-view characters
        tl.to([this.characters.mehdiSide, this.characters.shellySide], {
            opacity: 0,
            duration: config.animationDuration * 0.4
        })
        // Fade in the front-view characters who are already positioned close together via CSS
        .to([this.characters.mehdiFront, this.characters.shellyFront], {
            opacity: 1,
            scale: config.characterScale,
            duration: config.animationDuration,
            ease: "power2.out"
        }, ">-0.2");
    }

    /**
     * Scene 5: Heart appears (responsive) - MODIFIED
     */
    createResponsiveScene5() {
        const config = this.getCurrentConfig();
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".container",
                start: "80% top",
                end: "100% bottom",
                scrub: config.scrollSensitivity,
                onUpdate: (self) => {
                    this.updateTextForProgress(5, self.progress);
                }
            }
        });

        // Final scene: Characters scale up slightly, and the heart appears and animates
        const finalCharacterScale = config.characterScale * 1.05; // A subtle 5% increase
        
        tl.to([this.characters.mehdiFront, this.characters.shellyFront], {
            scale: finalCharacterScale,
            duration: config.animationDuration,
            ease: "power2.inOut"
        })
        .to(this.characters.heart, {
            opacity: 1,
            scale: config.heartScale,
            duration: config.animationDuration * 1.5, // Make heart appear slower
            ease: "back.out(2)", // A nice bouncy ease
        }, ">-0.5");
    }

    // Heart animation methods (with responsive adjustments)
    showHeart() {
        if (this.characters.heart && !this.characters.heart.classList.contains('visible')) {
            const config = this.getCurrentConfig();
            this.characters.heart.classList.add('visible');
            gsap.to(this.characters.heart, {
                opacity: 1,
                scale: config.heartScale,
                duration: 0.8,
                ease: "back.out(1.7)"
            });
        }
    }

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

    animateHeart() {
        if (this.characters.heart && !this.characters.heart.classList.contains('animate')) {
            this.characters.heart.classList.add('animate');
        }
    }

    stopHeartAnimation() {
        if (this.characters.heart) {
            this.characters.heart.classList.remove('animate');
            if (this.heartAnimation) {
                this.heartAnimation.kill();
                this.heartAnimation = null;
            }
        }
    }

    // Text methods (unchanged but with responsive text box)
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
     * Start story animation with responsive optimizations
     */
    startStoryAnimation() {
        console.log('🎬 Responsive story animation started!');
        console.log(`📱 Device: ${this.isMobile ? 'Mobile' : this.isTablet ? 'Tablet' : 'Desktop'}`);
        
        this.setupResponsiveSmoothScrolling();
        this.setupResponsiveKeyboardControls();
        
        // Add touch optimizations for mobile
        if (this.isMobile) {
            this.setupTouchOptimizations();
        }
    }

    /**
     * Setup responsive smooth scrolling
     */
    setupResponsiveSmoothScrolling() {
        // Adjust scroll behavior for mobile
        if (this.isMobile) {
            document.documentElement.style.scrollBehavior = 'auto'; // Better for mobile
        } else {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }

    /**
     * Setup responsive keyboard controls
     */
    setupResponsiveKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            const scrollAmount = window.innerHeight * (this.isMobile ? 0.15 : 0.2);
            
            switch(e.key) {
                case 'ArrowDown':
                    window.scrollBy(0, scrollAmount);
                    break;
                case 'ArrowUp':
                    window.scrollBy(0, -scrollAmount);
                    break;
                case ' ':
                    e.preventDefault();
                    this.skipToNextScene();
                    break;
                case 'r':
                    window.scrollTo(0, 0);
                    break;
            }
        });
    }

    /**
     * Setup touch optimizations for mobile devices
     */
    setupTouchOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add momentum scrolling for iOS
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Optimize scroll performance
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
    }

    /**
     * Skip to next scene (responsive)
     */
    skipToNextScene() {
        this.currentScene = Math.min(5, this.currentScene + 1);
        const targetScroll = (this.currentScene * 0.2) * (document.body.scrollHeight - window.innerHeight);
        window.scrollTo(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
    }

    /**
     * Reset animation (responsive)
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

        this.stopHeartAnimation();
        
        if (this.textBoxManager) {
            this.textBoxManager.clearText();
        }
        
        // Reapply responsive states
        setTimeout(() => {
            this.setResponsiveCharacterStates();
        }, 100);
    }

    /**
     * Destroy all animations and clean up
     */
    destroy() {
        // Remove media query listeners
        Object.values(this.mediaQueries).forEach(mq => {
            if (mq.removeListener) {
                mq.removeListener(() => {});
            }
        });
        
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

// Initialize the responsive story animation
const responsiveStoryController = new ResponsiveStoryAnimationController();

// Export for global access
window.storyController = responsiveStoryController;

// Enhanced dev helpers with responsive info
window.devHelpers = {
    skipToScene: (sceneNumber) => {
        const targetScroll = (sceneNumber * 0.2) * (document.body.scrollHeight - window.innerHeight);
        window.scrollTo(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
    },
    
    resetStory: () => {
        responsiveStoryController.resetAnimation();
    },
    
    testTextBox: () => {
        if (window.storyTextBox && window.STORY_TEXTS) {
            responsiveStoryController.playStoryText('mehdiEnters');
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
    },
    
    getDeviceInfo: () => {
        return {
            isMobile: responsiveStoryController.isMobile,
            isTablet: responsiveStoryController.isTablet,
            isLandscape: responsiveStoryController.isLandscape,
            viewportWidth: responsiveStoryController.viewportWidth,
            viewportHeight: responsiveStoryController.viewportHeight,
            config: responsiveStoryController.getCurrentConfig()
        };
    },
    
    forceRefresh: () => {
        responsiveStoryController.refreshAnimations();
    }
};

console.log('📱 Responsive Story Animation loaded!');
console.log('Use arrow keys to scroll, spacebar to skip scenes, R to restart');
console.log('Dev helpers: devHelpers.getDeviceInfo(), devHelpers.forceRefresh()');
console.log('Mobile optimizations: Touch handling, responsive scaling, viewport adjustments');