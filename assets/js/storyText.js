/**
 * Story texts and dialogue for the love story animation
 */
const STORY_TEXTS = {
    // Scene 1: Mehdi enters from left
    mehdiEnters: {
        text: "Someone who called Mehdi was there... So sad. He was thinking all the day.",
        type: "narrator"
    },

    mehdiIntro: {
        text: "Mehdi",
        type: "character-intro"
    },

    mehdiThought: {
        text: "I'm so sad, I have to do something. Everything is meaningless.",
        type: "dialogue",
        character: "mehdi"
    },

    // Scene 2: Mehdi exits, Shelly enters from right
    transition1: {
        text: "There was a beautiful girl. She looks like an angle. She's so good (OMG)",
        type: "narrator"
    },

    shellyEnters: {
        text: "Shelly came to the this world. Let the story tell you.",
        type: "narrator"
    },

    shellyIntro: {
        text: "shelly",
        type: "character-intro"
    },

    shellyThought: {
        text: "OMG! Everything so cool here.",
        type: "dialogue",
        character: "shelly"
    },

    // Scene 3: Both characters meet in center
    meetingMoment: {
        text: "They meet each other at least",
        type: "narrator"
    },

    firstSight: {
        text: "They look at each other",
        type: "narrator"
    },

    mehdiMeetsShelly: {
        text: "Hello sunshine. My name's Mehdi.",
        type: "dialogue",
        character: "mehdi"
    },

    shellyMeetsMehdi: {
        text: "Hi pookie. I'm shelly.",
        type: "dialogue",
        character: "shelly"
    },

    // Scene 4: Love develops
    connectionGrows: {
        text: "With every word they exchanged, their hearts grew closer...",
        type: "narrator"
    },

    mehdiConfession: {
        text: "Shelly, from the very first moment I saw you, I felt something special...",
        type: "dialogue",
        character: "mehdi"
    },

    shellyResponse: {
        text: "I guess me too...",
        type: "dialogue",
        character: "shelly"
    },

    // Scene 5: Heart appears - Love declared
    loveBlossoms: {
        text: "And she gave meaning to the Mehdi's life. They're happy together",
        type: "narrator",
        isHeartMoment: true
    },

    heartAppears: {
        text: "❤️ Now there is a true love ❤️",
        type: "narrator",
        isHeartMoment: true
    },

    finalWords: {
        text: "And they live together forever...",
        type: "narrator",
        isHeartMoment: true
    },

    theEnd: {
        text: "End ❤️",
        type: "narrator",
        isHeartMoment: true
    }
};

// Export story texts
window.STORY_TEXTS = STORY_TEXTS;