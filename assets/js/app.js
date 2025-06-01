let tl = gsap.timeline();
gsap.registerPlugin(ScrollTrigger);

// Initialize TextBox Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Wait for TextBoxManager to be available
    if (typeof TextBoxManager !== 'undefined') {
        // Initialize text box manager
        const textBoxManager = new TextBoxManager();
        
        // Store reference globally for use in animations
        window.storyTextBox = textBoxManager;
        
        console.log('✅ TextBox Manager initialized successfully');
    } else {
        console.error('❌ TextBoxManager not found. Make sure textBox.js is loaded.');
    }
});

/**
 * Example function to test text box functionality
 * Remove this after integrating with main animation
 */
function testTextBox() {
    if (window.storyTextBox && window.STORY_TEXTS) {
        // Test sequence
        setTimeout(() => {
            window.storyTextBox.displayText(
                STORY_TEXTS.mehdiEnters.text, 
                STORY_TEXTS.mehdiEnters.type
            );
        }, 1000);
        
        setTimeout(() => {
            window.storyTextBox.displayText(
                STORY_TEXTS.mehdiThought.text, 
                STORY_TEXTS.mehdiThought.type,
                STORY_TEXTS.mehdiThought.character
            );
        }, 5000);
        
        setTimeout(() => {
            window.storyTextBox.displayText(
                STORY_TEXTS.loveBlossoms.text, 
                STORY_TEXTS.loveBlossoms.type,
                '',
                STORY_TEXTS.loveBlossoms.isHeartMoment
            );
        }, 10000);
    }
}

// Uncomment to test:
testTextBox();