/**
 * File: navigation.js
 * Fixed navigation system with proper state management and animation synchronization
 */

class SectionNavigator {
  constructor() {
    this.sections = document.querySelectorAll('.section');
    this.arrowContainer = document.querySelector(".arrow-container");
    this.upArrow = document.querySelector(".arrow-up");
    this.downArrow = document.querySelector(".arrow-down");
    
    this.mehdiSide1 = document.querySelector("#mehdiSide1");
    this.mehdiSide2 = document.querySelector("#mehdiSide2");
    this.shellySide1 = document.querySelector("#shellySide1");
    this.shellySide2 = document.querySelector("#shellySide2");
    this.mehdiFront1 = document.querySelector("#mehdiFront1");
    this.mehdiFront2 = document.querySelector("#mehdiFront2");
    this.shellyFront1 = document.querySelector("#shellyFront1");
    this.shellyFront2 = document.querySelector("#shellyFront2");
    this.heart = document.querySelector("#heart")
    this.textBox = document.querySelector("#textBox");
    this.textContent = document.querySelector("#textContent");
    
    this.currentSection = 0;
    this.maxSection = this.sections.length - 1;
    this.isAnimating = false;
    this.animationQueue = [];
    
    this.init();
  }

  init() {
    this.updateArrowStates();
    this.performSectionAnimation();
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.arrowContainer.addEventListener("click", this.handleArrowClick.bind(this));
    window.addEventListener('wheel', this.handleWheelScroll.bind(this));
    window.addEventListener("keydown", this.handleKeyNavigation.bind(this));
    
    this.setupIntersectionObserver();
  }

  /**
   * Setup intersection observer to keep currentSection in sync
   */
  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      if (this.isAnimating) return;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionIndex = Array.from(this.sections).indexOf(entry.target);
          if (sectionIndex !== -1 && sectionIndex !== this.currentSection) {
            this.currentSection = sectionIndex;
            this.updateArrowStates();
          }
        }
      });
    }, observerOptions);

    this.sections.forEach(section => observer.observe(section));
  }

  navigateToSection(targetSection) {
    if (this.isAnimating || !this.isValidSection(targetSection) || targetSection === this.currentSection) {
      return false;
    }

    this.currentSection = targetSection;
    this.scrollToCurrentSection();
    this.updateArrowStates();
    this.performSectionAnimation();
    
    return true;
  }

  isValidSection(sectionIndex) {
    return sectionIndex >= 0 && sectionIndex <= this.maxSection;
  }

  scrollToCurrentSection() {
    if (this.sections[this.currentSection]) {
      this.sections[this.currentSection].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  handleArrowClick(event) {
    event.preventDefault();
    const targetClasses = event.target.classList;
    
    if (targetClasses.contains("arrow-up") || targetClasses.contains("up")) {
      this.navigateUp();
    } else if (targetClasses.contains("arrow-down") || targetClasses.contains("down")) {
      this.navigateDown();
    }
  }

  navigateUp() {
    if (this.currentSection > 0) {
      this.navigateToSection(this.currentSection - 1);
    }
  }

  navigateDown() {
    if (this.currentSection < this.maxSection) {
      this.navigateToSection(this.currentSection + 1);
    }
  }

  handleWheelScroll(event) {
    if (this.isAnimating) return;
    
    event.preventDefault();
    
    if (event.deltaY > 0) {
      this.navigateDown();
    } else {
      this.navigateUp();
    }
  }

  handleKeyNavigation(event) {
    const key = event.key.toLowerCase();
    if (key === "arrowup") {
      event.preventDefault();
      this.navigateUp();
    } else if (key === "arrowdown") {
      event.preventDefault();
      this.navigateDown();
    } else if (key === " "){
      console.log("here");
      event.preventDefault();
      this.navigateDown();
    }
  }

  updateArrowStates() {
    if (this.currentSection <= 0) {
      this.upArrow.style.color = "#eaeaea21";
      this.downArrow.style.color = "#fff";
    } else if (this.currentSection >= this.maxSection) {
      this.downArrow.style.color = "#eaeaea21";
      this.upArrow.style.color = "#fff";
    } else {
      this.upArrow.style.color = "#fff";
      this.downArrow.style.color = "#fff";
    }
  }

  performSectionAnimation() {
    if (this.isAnimating) {
      this.animationQueue.push(() => this.performSectionAnimation());
      return;
    }

    this.isAnimating = true;
    
    gsap.killTweensOf([this.mehdiSide1, this.shellySide1, this.textBox, this.arrowContainer]);
    
    const animationPromise = this.getSectionAnimation();
    
    animationPromise.then(() => {
      this.isAnimating = false;
      this.processAnimationQueue();
    }).catch((error) => {
      console.error('Animation error:', error);
      this.isAnimating = false;
      this.processAnimationQueue();
    });
  }

  processAnimationQueue() {
    if (this.animationQueue.length > 0) {
      const nextAnimation = this.animationQueue.shift();
      nextAnimation();
    }
  }

  getSectionAnimation() {
    return new Promise((resolve) => {
      const timeline = gsap.timeline({
        onComplete: resolve
      });
      
      if (this.currentSection === 0) {
        this.animateFirstSection(timeline);
      } else if (this.currentSection === 1) {
        this.animateSecondSection(timeline);
      } else if(this.currentSection === 2){
        this.animateThirdSection(timeline);
      } else if(this.currentSection === 3){
        this.animateFourthSection(timeline);
      } else if(this.currentSection === 4){
        this.animateFifthSection(timeline);
      }
      else {
        resolve();
      }
    });
  }

  animateFirstSection(timeline) {
    this.textContent.innerHTML=`
Once upon a time, there was a boy named Mehdi.
Mehdi was sorrowful, and life had not been kind to him.
He found solace in books, and spent most of his days in solitude.

He was like an angel—one whose wings had been taken from him,
cast out and forsaken,
cloaked in garments of black.
    `;
    gsap.set(this.textBox, {
      top: "auto",
      bottom: "-100%",
      borderRadius: 0,
      width: "70%"
    });
    gsap.set(this.textContent, {
        opacity: 0,
    });

    timeline
      .fromTo(this.mehdiSide1, {
        left: "-100%",
      }, {
        left: "50%",
        duration: 2,
        ease: "power4.out"
      })
      .fromTo(this.textBox, {
        bottom: "-100%", 
        borderRadius: 32 
      }, {
        bottom: "0%",
        borderRadius: 0,
        ease: "power1.inOut",
        duration: 2.5,
      }, "-=1.5")
      .fromTo(this.arrowContainer, {
        bottom: "auto"
      }, {
        top: "0", 
        duration: 1, 
        ease: "power1.out"
      }, "-=2")
      .to(this.textBox, {
        width: "100%", 
        borderRadius: "32px 32px 0 0", 
        ease: "bounce.inOut", 
        duration: 1.5
      }, "-=1")
      .to(this.textContent, {
        opacity: 1,
        ease: "sine.out",
        duration: 1,
      }, "-=0.3");
  }

  animateSecondSection(timeline) {
    this.textContent.innerHTML=`
In another place, there was a girl named Shelly.
Shelly was full of joy—a radiant, beautiful angel.
She shimmered with light and wore the color pink like a crown.

She was wise, and her beauty had become the talk of the world.
Graceful in every way,
She was the very image of perfection.
`;
    this.arrowContainer.style.top = "auto";
    
    gsap.set(this.textBox, {
      top: "-100%",
      bottom: "auto",
      borderRadius: 32,
      width: "70%"
    });
    gsap.set(this.textContent, {
        opacity: 0,
    });
    timeline
      .fromTo(this.shellySide1, {
        right: "-100%",
      }, {
        left: "50%",
        duration: 2,
        ease: "power2.out"
      })
      .fromTo(this.textBox, {
        top: "-100%", 
        borderRadius: 32 
      }, {
        top: "0%",
        borderRadius: 0,
        ease: "power1.inOut",
        duration: 2.5,
      }, "-=1.5")
      .fromTo(this.arrowContainer, {
        top: "auto"
      }, {
        bottom: "0", 
        duration: 1, 
        ease: "power1.out"
      }, "-=2")
      .fromTo(this.textBox, {
        width: "70%", 
        borderRadius: "0 0 0 0"
      }, {
        width: "100%", 
        borderRadius: "0 0 32px 32px", 
        ease: "power4.inOut", 
        duration: 1.5
      }, "-=1")
      .to(this.textContent, {
        opacity: 1,
        ease: "bounce.inOut",
        duration: 1,
      }, "-=0.3");
  }

  animateThirdSection(timeline){
    this.textContent.innerHTML="And at long last, their paths crossed…";
    gsap.set(this.textBox, {
      top: "auto",
      bottom: "-100%",
      borderRadius: 0,
      width: "70%"
    });
    gsap.set(this.textContent, {
        opacity: 0,
    });

    timeline
      .fromTo(this.mehdiSide2, {
        left: "-100%",
      }, {
        left: "20%",
        duration: 2,
        ease: "power4.out"
      })
      .fromTo(this.shellySide2, {
        right: "-100%",
      }, {
        left: "80%",
        duration: 2,
        ease: "power4.out",
        delay: 0.1,
      })
      .fromTo(this.textBox, {
        bottom: "-100%", 
        borderRadius: 32 
      }, {
        bottom: "0%",
        borderRadius: 0,
        ease: "power1.inOut",
        duration: 2.5,
      }, "-=1.5")
      .fromTo(this.arrowContainer, {
        bottom: "auto"
      }, {
        top: "0", 
        duration: 1, 
        ease: "power1.out"
      }, "-=2")
      .to(this.textBox, {
        width: "100%", 
        borderRadius: "32px 32px 0 0", 
        ease: "sine.inOut", 
        duration: 2
      }, "-=1")
      .to(this.textContent, {
        opacity: 1,
        ease: "slow(0.7,0.7,false)",
        duration: 1,
      }, "-=0.3");
  }

  animateFourthSection(timeline){
    this.textContent.innerHTML=`
They fell deeply in love, their hearts tethered by an unbreakable bond.
They loved each other not just dearly—but endlessly, profoundly, beyond measure.
A love that gave, that healed.
Mehdi, with a heart full of awe, felt forever indebted to the universe for granting him Shelly’s light.
To him, she was not just a blessing she was a miracle. And he, the luckiest soul alive.
    `
      this.arrowContainer.style.top = "auto";
      
      gsap.set(this.textBox, {
        top: "-100%",
        bottom: "auto",
        borderRadius: 32,
        width: "70%"
      });
      gsap.set(this.textContent, {
        opacity: 0,
      });

      timeline
        .fromTo(this.shellyFront1, {
          right: "-100%",
        }, {
          left: "80%",
          duration: 2,
          ease: "power2.out"
        })
        .fromTo(this.mehdiFront1, {
          left: "-100%",
        }, {
          left: "20%",
          duration: 2,
          delay: 0.1,
          ease: "power2.out"
        })
        .fromTo(this.textBox, {
          top: "-100%", 
          borderRadius: 32 
        }, {
          top: "0%",
          borderRadius: 0,
          ease: "power1.inOut",
          duration: 2.5,
        }, "-=1.5")
        .fromTo(this.arrowContainer, {
          top: "auto"
        }, {
          bottom: "0", 
          duration: 1, 
          ease: "power1.out"
        }, "-=2")
        .fromTo(this.textBox, {
          width: "70%", 
          borderRadius: "0 0 0 0"
        }, {
          width: "100%", 
          borderRadius: "0 0 32px 32px", 
          ease: "sine.inOut", 
          duration: 4
        }, "-=1")
        .to(this.textContent, {
        opacity: 1,
        ease: "power3.inOut",
        duration: 1,
      }, "-=0.3");
      }

      animateFifthSection(timeline) {
      this.textContent.innerHTML=`
And so, they lived happily ever after, wrapped in each other’s love until the end of time.
<br/><i>Happy Birthday to the most beautiful girl in the world.</i><br/>
1404/04/05<br/>
(I love you again sunshine <3)
`
      // Set initial states for all elements
      gsap.set(this.textBox, {
          top: "auto",
          bottom: "-100%",
          borderRadius: 0,
          width: "70%"
      });

      // Set initial state for heart (hidden and positioned off-screen)
      gsap.set(this.heart, {
          top: "-100%",
          opacity: 0
      });

      gsap.set(this.textContent, {
        opacity: 0,
      });

      timeline
          // Animate Mehdi from left
          .fromTo(this.mehdiFront2, {
              left: "-100%",
          }, {
              left: "20%",
              duration: 2,
              ease: "power4.out"
          })
          // Animate Shelly from right
          .fromTo(this.shellyFront2, {
              right: "-100%",
          }, {
              left: "80%",
              duration: 2,
              ease: "power4.out",
              delay: 0.1,
          })
          // Animate text box from bottom
          .fromTo(this.textBox, {
              bottom: "-100%",
              borderRadius: 32
          }, {
              bottom: "0%",
              borderRadius: 0,
              ease: "power1.inOut",
              duration: 2.5,
          }, "-=1.5")
          // Animate arrow container
          .fromTo(this.arrowContainer, {
              bottom: "auto"
          }, {
              top: "0",
              duration: 1,
              ease: "power1.out"
          }, "-=2")
          // Heart initial animation: move to 40% and fade in
          .fromTo(this.heart, {
              top: "-100%",
              opacity: 0
          }, {
              top: "40%",
              opacity: 1,
              duration: 1,
              ease: "bounce.inOut",
          })
          // Expand text box width and adjust border radius
          .to(this.textBox, {
              width: "100%",
              borderRadius: "32px 32px 0 0",
              ease: "bounce.inOut",
              duration: 2.5
          }, "-=1")
          .to(this.textContent, {
            opacity: 1,
            ease: "power2.inOut",
            duration: 1,
          }, "-=0.3")
          // Start continuous heart bouncing animation
          .add(() => {
              this.startHeartBounceAnimation();
          });
  }

  /**
   * Starts the continuous bouncing animation for the heart
   * Bounces every 0.7 seconds with alternate-reverse and bounce easing
   */
  startHeartBounceAnimation() {
      // Create infinite bouncing animation
      gsap.to(this.heart, {
          y: "-25px", // Bounce up by 20px
          duration: 0.7, // Half of 0.7 seconds for each direction
          ease: "bounce.out",
          repeat: -1, // Infinite repeat
          yoyo: true, // Alternate reverse (up then down)
          repeatDelay: 0 // No delay between repetitions
      });
  }

  /**
   * Stops the heart bouncing animation (useful for cleanup)
   */
  stopHeartBounceAnimation() {
      gsap.killTweensOf(this.heart);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const navigator = new SectionNavigator();
});