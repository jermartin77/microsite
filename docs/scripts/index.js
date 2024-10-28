(function() {

  gsap.registerPlugin(ScrollTrigger);

  // setting a var for the window size if we need it
  let windowWidth = window.innerWidth; // Initial window width
  let windowHeight = window.innerHeight; // Initial window height
  let resizeTimeout;

  window.addEventListener('resize', () => {
    // Clear any existing timeout when resizing starts
    clearTimeout(resizeTimeout);

    // Set a timeout to update the window width after resizing is done
    resizeTimeout = setTimeout(() => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      initSizzleCarousel();

      // refreshing the stubborn ScrollTrigger.
      setTimeout(() =>  {
        ScrollTrigger.update();

      }, 500);
    }, 200);
  });

  // start the intro animation
  const t = setTimeout(()=> {
    document.querySelector('body').classList.add('start')
  }, 300);


  let lang = 'en';

  // setting the language
  function setBodyClass(lang) {
    document.body.classList.remove('lang-en', 'lang-fr');
    document.body.classList.add('lang-' + lang);
    localStorage.setItem('lang', lang);
    // refresh all the animations because we caused a layout shift
    setTimeout(() => {
      ScrollTrigger.update();
    }, 1000);
  }

  // Function to check localStorage and set the body class on page load
  function checkLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    lang = urlLang || localStorage.getItem('lang') || lang;

    if (lang) {
      setBodyClass(lang);
    }
  }

  // Run this on page load to check localStorage or the lang param for a language if it is set
  checkLanguage();

  const enFormId = 'c3fb226b-6134-4cdc-98ed-eeea263bb6fa'
  const frFormId = '9bdef6c2-b4a0-4b26-bdaa-c00bfe7553f4'

  function bindHsForm() {
    const $hsInputs = document.querySelectorAll('.hs-input');
    $hsInputs.forEach(function(input, index) {
      input.addEventListener('focus', function() {
        input.parentElement.parentElement.classList.add('field-focused');
      });

      input.addEventListener('blur', function() {
        if (!input.value) {
          input.parentElement.parentElement.classList.remove('field-focused');
        }
      });
    });
  }

  const langLinks = document.querySelectorAll('.lang-link');

  langLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      lang = this.dataset.lang;
      setBodyClass(lang);

      hbspt.forms.create({
        portalId: "44614467",
        formId: lang === 'en' ? enFormId : frFormId,
        target: "#hubspot-form",
        onFormReady: bindHsForm
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    hbspt.forms.create({
      portalId: "44614467",
      formId: lang === 'en' ? enFormId : frFormId,
      target: "#hubspot-form",
      onFormReady: bindHsForm
    });
  });

  // functionality for controling the click behaviour of the down arrow.
  const downArrowPosition = document.getElementById('down-arrow-position');

  let arrowStep = 0;
  let introOffset = 0;

  downArrowPosition.addEventListener('click',  (event) => {
    if(arrowStep === 0) {
      introOffset = document.getElementById('better-together').offsetTop;
    } else if (arrowStep === 1) {
      introOffset = document.getElementById('statement').offsetTop;
      // remove the snap because it's preventing from scrolling down
      document.documentElement.classList.remove('snap');
    }

    window.scrollTo({
      top: introOffset,
      behavior: 'smooth'
    })
  });

  // intersection observer that toggles the navigation
  const intro = document.getElementById('intro-section');
  const navigation = document.getElementById('navigation');

  const introObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      document.body.classList.add("nav-hidden");
      document.documentElement.classList.add('snap')
    } else {
      document.body.classList.remove("nav-hidden");
      document.documentElement.classList.remove('snap')
    }
  });

  introObserver.observe(intro);


  // Video actions
  const introVideo = document.getElementById('intro-video');
  const playIcon = document.getElementById('play-icon');

  let videoLoaded = false;

  introVideo.addEventListener('click', function (event) {
    if (videoLoaded) {
      return false;
    }

    videoLoaded = true;

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
    videoLoaded = false;
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
      end: "bottom 20%",
      scrub: .5,
      markers: false,
      onEnterBack: () => {
        arrowStep = 0;
      },
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
      start: "top 5%",
      end: "bottom 15%",
      toggleClass: "wordmark-active",
      onEnter: () => {
        arrowStep = 1;
      },
      onEnterBack: () => {
        arrowStep = 1;
      },
      scrub: .5,
      markers: false,
    }
  });

  wordmark.to('#better-together-wordmark', {
    opacity: 1,
    duration: 0.5,
    ease: 'ease-out'
  }).to('#better-together-wordmark', {
    opacity: 0,
    duration: 1,
    scale: 1.06,
    ease: 'ease-out'
  });

  const statement = new gsap.timeline({
    scrollTrigger: {
      trigger: '#position-statement',
      start: "top 70%",
      end: "bottom 80%",
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
  // console.log('sizzlewidth', document.querySelector('.sizzle-wrapper').offsetWidth)
let sizzleCarouselAnimation;
const $sizzleCarousel = document.getElementById('sizzle-carousel');

  function initSizzleCarousel() {
    if(typeof sizzleCarouselAnimation === 'object') {
      sizzleCarouselAnimation.kill();
    }
    if (windowWidth > windowHeight) {
      $sizzleCarousel.scrollLeft = 0;
      // landscape mode
      sizzleCarouselAnimation = new gsap.timeline({
        scrollTrigger: {
          trigger: '#sizzle-v2',
          start: "top top",
          end: "bottom bottom",
          scrub: .5,
          markers: false,
        }
      });

      sizzleCarouselAnimation.to('.sizzle-wrapper', {
        xPercent: -66.6666,
        ease: "ease-out"
      });

    } else {
      const $sizzleCarousel = document.getElementById('sizzle-carousel');

      $sizzleCarousel.scrollLeft = 400;



      sizzleCarouselAnimation = new gsap.timeline({
        scrollTrigger: {
          trigger: '#sizzle-v2',
          start: "top 70%",
          onEnter: () => {
            $sizzleCarousel.scrollLeft = 0;
          },
          markers: false,
        }
      });
    }
  }

  initSizzleCarousel();


  // animate the map in
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

  const $capabilities = document.querySelectorAll(".capability");
  const $capabilitiesDiagram = document.getElementById('capabilities-diagram');

  // intersection observer that adds a class to the capabilities diagram used specifically for mobile
  const mobileCapabilities = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      $capabilitiesDiagram.classList.add('capabilities-active');
    } else {
      $capabilitiesDiagram.classList.remove('capabilities-active');
    }
  });

  mobileCapabilities.observe($capabilitiesDiagram);

  $capabilities.forEach((element, index) => {
    const capabilityAnimation = new gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 50%',
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
      ease: "ease-out"
    })
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
