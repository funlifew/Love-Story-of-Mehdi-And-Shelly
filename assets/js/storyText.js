/**
 * Story texts and dialogue for the love story animation
 * Enhanced with better narrative flow and character development
 */
const STORY_TEXTS = {
    // Scene 1: Mehdi enters from left
    mehdiEnters: {
        text: "Someone named Mehdi was there... So sad. He was thinking all day long.",
        type: "narrator"
    },

    mehdiIntro: {
        text: "Mehdi",
        type: "character-intro"
    },

    mehdiThought: {
        text: "I'm so sad, I have to do something. Everything feels meaningless.",
        type: "dialogue",
        character: "Mehdi"
    },

    // Scene 2: Mehdi exits, Shelly enters from right
    transition1: {
        text: "Then appeared a beautiful girl. She looked like an angel. She was so good (OMG)!",
        type: "narrator"
    },

    shellyEnters: {
        text: "Shelly came into this world. Let the story unfold...",
        type: "narrator"
    },

    shellyIntro: {
        text: "Shelly",
        type: "character-intro"
    },

    shellyThought: {
        text: "OMG! Everything is so cool here.",
        type: "dialogue",
        character: "Shelly"
    },

    // Scene 3: Both characters meet in center
    meetingMoment: {
        text: "They finally meet each other...",
        type: "narrator"
    },

    firstSight: {
        text: "Their eyes meet for the first time",
        type: "narrator"
    },

    mehdiMeetsShelly: {
        text: "Hello sunshine. My name is Mehdi.",
        type: "dialogue",
        character: "Mehdi"
    },

    shellyMeetsMehdi: {
        text: "Hi there! I'm Shelly.",
        type: "dialogue",
        character: "Shelly"
    },

    // Scene 4: Love develops
    connectionGrows: {
        text: "With every word they exchanged, their hearts grew closer...",
        type: "narrator"
    },

    mehdiConfession: {
        text: "Shelly, from the very first moment I saw you, I felt something special...",
        type: "dialogue",
        character: "Mehdi"
    },

    shellyResponse: {
        text: "I feel the same way, Mehdi...",
        type: "dialogue",
        character: "Shelly"
    },

    // Scene 5: Heart appears - Love declared
    loveBlossoms: {
        text: "And she gave meaning to Mehdi's life. They are happy together.",
        type: "narrator",
        isHeartMoment: true
    },

    heartAppears: {
        text: "❤️ Now there is true love ❤️",
        type: "narrator",
        isHeartMoment: true
    },

    finalWords: {
        text: "And they lived happily ever after...",
        type: "narrator",
        isHeartMoment: true
    },

    theEnd: {
        text: "The End ❤️",
        type: "narrator",
        isHeartMoment: true
    }
};

// Additional configuration for story timing
const STORY_CONFIG = {
    // Text display timing (in milliseconds)
    timing: {
        narratorDelay: 3000,     // Time before showing narrator text
        dialogueDelay: 4000,     // Time before showing dialogue
        transitionDelay: 2000,   // Time between scene transitions
        heartMomentDelay: 5000   // Extra time for romantic moments
    },
    
    // Animation settings
    animation: {
        textSpeed: 50,           // Characters per second for typing
        fadeInDuration: 0.5,     // Fade in time for text box
        fadeOutDuration: 0.3     // Fade out time for text box
    }
};

// Export story texts and configuration
window.STORY_TEXTS = STORY_TEXTS;
window.STORY_CONFIG = STORY_CONFIG;

console.log('📖 Story texts loaded successfully!');