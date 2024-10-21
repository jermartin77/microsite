
(function() {

  // start the intro animation
  const t = setTimeout(()=> {
    document.querySelector('body').classList.add('start')
  }, 300);

  // setting the language
  function setBodyClass(lang) {
    document.body.classList.remove('lang-en', 'lang-fr');
    document.body.classList.add('lang-' + lang);
    localStorage.setItem('lang', lang);
  }

  // Function to check localStorage and set the body class on page load
  function checkClassFromLocalStorage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      setBodyClass(savedLang);
    }
  }

  // Run this on page load to check localStorage
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

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      navigation.classList.add('nav-hidden');
    } else {
      navigation.classList.remove('nav-hidden');
    }
  });

  observer.observe(intro);

  // Animations


  gsap.registerPlugin(ScrollTrigger);

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
    scale: 1.08,
    ease: 'ease-out'
  });


  /*const slides = document.querySelectorAll('.slideshow-item');
  let activeSlide = 0;

  const sizzleShow = new gsap.timeline({
    scrollTrigger: {
      trigger: '#sizzle',
      start: "top 180px",
      end: "bottom 50%",
      toggleClass: {targets: "#slideshow", className: "active"},
      onUpdate: (self) => {
        const progress = self.progress; // Value from 0 to 1
        let slideIndex = Math.floor(progress * slides.length); // Determine active slide index
        slideIndex = slideIndex < slides.length ? slideIndex : slides.length - 1;
        slides[activeSlide].classList.remove('active')
        slides[slideIndex].classList.add('active');
        activeSlide = slideIndex;

      },
      scrub: 0,
      markers: false
    }
  });


  sizzleShow.to('#intro-animation', {
    opacity: 0,
    scale: 1.08,
    ease: 'ease-out'
  });*/

  console.log('sizzlewidth', document.querySelector('.sizzle-wrapper').offsetWidth)

  const sizzleCarousel = new gsap.timeline({
    scrollTrigger: {
      trigger: '#sizzle-v2',
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      markers: false
    }
  });

  sizzleCarousel.to('.sizzle-wrapper', {
    xPercent: -66.6666,
    ease: "ease-out"
  });


  const positionStatement = new gsap.timeline({
    scrollTrigger: {
      trigger: '#statement',
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      markers: false
    }
  });

  positionStatement.from('#position-statement', {
    opacity: 0,
    yPercent: 25,
    ease: "ease-out"
  });


  // const slideTextIn = new gsap.timeline({
  //   scrollTrigger: {
  //     trigger: '.clients h3',
  //     start: "top bottom",
  //     end: "bottom bottom",
  //     scrub: 1,
  //     markers: false
  //   }
  // });
  //
  // slideTextIn.from('.clients h3', {
  //   opacity: 0,
  //   yPercent: 20,
  //   ease: "ease-out"
  // });


  const $slideInCards = document.querySelectorAll(".slide-in-card");

  $slideInCards.forEach((element) => {
    const slideInElement = new gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        end: "bottom bottom",
        scrub: 1,
        markers: false
      }
    });

    slideInElement.from(element, {
      opacity: 0,
      yPercent: 25,
      ease: "ease-out"
    });
  });


})();









