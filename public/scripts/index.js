(function() {

  gsap.registerPlugin(ScrollTrigger);

  // setting a var for the window size if we need it
  let windowWidth = window.innerWidth; // Initial window width
  let resizeTimeout;

  window.addEventListener('resize', () => {
    // Clear any existing timeout when resizing starts
    clearTimeout(resizeTimeout);

    // Set a timeout to update the window width after resizing is done
    resizeTimeout = setTimeout(() => {
      windowWidth = window.innerWidth;
      ScrollTrigger.refresh();
      if(windowWidth < 1000) {
        capabilitiesStart = 'top 90%';
        capabilitiesEnd = 'top 30%';
      }
    }, 200);
  });

  // start the intro animation
  const t = setTimeout(()=> {
    document.querySelector('body').classList.add('start')
  }, 300);

  // setting the language
  function setBodyClass(lang) {
    document.body.classList.remove('lang-en', 'lang-fr');
    document.body.classList.add('lang-' + lang);
    localStorage.setItem('lang', lang);
    // refresh all the animations because we caused a layout shift
    ScrollTrigger.refresh();
  }

  // Function to check localStorage and set the body class on page load
  function checkClassFromLocalStorage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      setBodyClass(savedLang);
    }
  }

  // Run this on page load to check localStorage for a language if it is set
  checkClassFromLocalStorage();

  const langLinks = document.querySelectorAll('.lang-link');

  langLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const lang = this.dataset.lang;
      setBodyClass(lang);
    });
  });





  // intersection observer that toggles the navigation
  const intro = document.getElementById('intro-section');
  const navigation = document.getElementById('navigation');

  const introObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      navigation.classList.add('nav-hidden');
    } else {
      navigation.classList.remove('nav-hidden');
    }
  });

  introObserver.observe(intro);



  // Video actions
  const introVideo = document.getElementById('intro-video');
  const playIcon = document.getElementById('play-icon');

  introVideo.addEventListener('click', function (event) {
    playIcon.classList.add('hidden');
    if (introVideo.paused) {
      introVideo.controls = true;
      setTimeout(()=> {

        introVideo.play();
      }, 50) // Show controls when playing
    }
  });

  // reset the state of the video once it has ended.
  introVideo.addEventListener('ended', () => {
    playIcon.classList.remove('hidden')
    introVideo.controls = false;  // Hide controls after the video ends
    introVideo.load();  // This resets the video to the initial state and shows the poster
  });


  // intersection observer pauses the video when it's out of the viewport
  const videoObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && !introVideo.paused) {
      introVideo.pause();
    }
  });

  videoObserver.observe(introVideo);

  // GSAP Animations
  const introFadeout = new gsap.timeline({
    scrollTrigger: {
      trigger: '#intro-section',
      start: "top top",
      end: "bottom top",
      scrub: 1,
      markers: false
    }
  });

  introFadeout.to('#intro-animation', {
    opacity: 0,
    scale: 1.05,
    ease: 'ease-out'
  });


  const wordmark = new gsap.timeline({
    scrollTrigger: {
      trigger: '#better-together',
      start: "top top",
      end: "bottom top",
      toggleClass: "wordmark-active",
      scrub: 1,
      markers: false,
    }
  });

  wordmark.to('#better-together-wordmark', {
    opacity: 1,
    duration: 0.5,
    ease: 'ease-out'
  }).to('#better-together-wordmark', {
    opacity: 0,
    duration: 0.5,
    scale: 1.06,
    ease: 'ease-out'
  });


  const statement = new gsap.timeline({
    scrollTrigger: {
      trigger: '#position-statement',
      start: "top 60%",
      end: "bottom 70%",
      scrub: 1,
      markers: false,
    }
  });

  statement.from('#position-statement', {
    yPercent: 20,
    opacity: 0,
    ease: 'ease-out'
  });

  // animate the video in
  const videoContainer = new gsap.timeline({
    scrollTrigger: {
      trigger: '#video-section',
      start: "top bottom",
      end: "bottom bottom",
      scrub: 1,
      markers: false,
    }
  });

  videoContainer.from('#video-section', {
    scale: .8,
    ease: "ease-out"
  })


  // animate and swap the client images
  const $clientsList = document.getElementById('clients-list');

  const clientLogosSwap = new gsap.timeline({
    scrollTrigger: {
      trigger: '#clients-list',
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      markers: false,
      onUpdate: (self) => {
        if (self.progress > 0.5) {
          $clientsList.classList.add('active-secondary');
          $clientsList.classList.remove('active-primary');

        } else {
          $clientsList.classList.add('active-primary');
          $clientsList.classList.remove('active-secondary');
        }
      }
    }
  });


  // the overflow animation for the clients
  console.log('sizzlewidth', document.querySelector('.sizzle-wrapper').offsetWidth)

  const sizzleCarousel = new gsap.timeline({
    scrollTrigger: {
      trigger: '#sizzle-v2',
      start: "top top",
      end: "bottom bottom",
      scrub: .5,
      markers: false,
    }
  });

  sizzleCarousel.to('.sizzle-wrapper', {
    xPercent: -66.6666,
    ease: "ease-out"
  });


  // animate the video in
  const mapAnimation = new gsap.timeline({
    scrollTrigger: {
      trigger: '#company',
      start: "10% bottom",
      end: "bottom bottom",
      scrub: .5,
      markers: false,
    }
  });

  mapAnimation.to('#map-bg', {
    yPercent: 20,
    ease: "ease-out"
  });

  // a reusable animation for fade/sliding in cards
  const $capabilities = document.querySelectorAll(".capability");
  const $capabilitiesDiagram = document.getElementById('capabilities-diagram');

  let capabilitiesStart = 'top 70%';
  let capabilitiesEnd = 'bottom 15%';

  if (windowWidth < 1000) {
    // set the start and end to different values
    capabilitiesStart = 'top 90%';
    capabilitiesEnd = 'top 30%';
  }

  $capabilities.forEach((element, index) => {
    const capabilityAnimation = new gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: capabilitiesStart,
        end: capabilitiesEnd,
        scrub: .5,
        markers: false,
        onEnter: () => {
          // add classes to the SVG to create the animation
          $capabilitiesDiagram.classList.add('step-' + (index + 1));
        }
      }
    });

    capabilityAnimation.to(element, {
      opacity: 1,
      ease: "ease-out",
      duration: 0.2,

    }).to(element, {
      opacity: 0,
      ease: "ease-out",
      duration: 0.2,
    }, 1);
  });




  ScrollTrigger.create({
    trigger: '#capabilities-section',
    start: 'top bottom',
    end: 'bottom top',
    markers: false,
    onLeave: () => $capabilitiesDiagram.classList.remove('step-1', 'step-2', 'step-3', 'step-4'), // Remove multiple classes
    onLeaveBack: () => $capabilitiesDiagram.classList.remove('step-1', 'step-2', 'step-3', 'step-4')

  });

  // a reusable animation for fade/sliding in cards
  const $slideInCards = document.querySelectorAll(".slide-in-card");

  $slideInCards.forEach((element) => {
    const slideInElement = new gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 95%",
        end: "60% bottom",
        scrub: 1,
        markers: false
      }
    });

    slideInElement.from(element, {
      opacity: 0,
      yPercent: 20,
      ease: "ease-out"
    });
  });
})();









