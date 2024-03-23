'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
//nodeList
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// -----implementing Button scrolling - the smooth scroll effect
//1 select the button
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

//2. add event listener
btnScrollTo.addEventListener('click', function (e) {
  //3. get the coordinates of the element that we
  //want to scroll to
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //4. Scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left +window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // 6. a more modern way, only works in modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

// ---Page Navigation, using propagation

//queryselectorall returns a node list, therefore the foreach method
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     // console.log('link');
//     const id = this.getAttribute('href');
//     // const id2 = this.href;
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//---method using event delegation (use case)
// 1. Add event listener to common parent element which is .nav__links
// 2. determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //figure out where the event actually happened using e.target
  e.preventDefault();
  console.log(e.target); //(element thats clicked)
  //3. use a matching strategy
  if (e.target.classList.contains('nav__link')) {
    // console.log('LINK');
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// --Implementing the Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabscontainer = document.querySelector('.operations__tab-container');
const tabcontent = document.querySelectorAll('.operations__content');

tabscontainer.addEventListener('click', function (e) {
  // console.log(e.target);
  //1. add eventlistner to parent (container)
  //2. find which button is clicked
  const clicked = e.target.closest('.operations__tab');
  console.log(e.target);
  console.log(clicked);

  //3. Guard clause
  if (!clicked) return; //will return null but wont return
  //error meesage

  //4. Activate tab,  command way is first remove all
  //active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // 5. and then add the active class to the clicked tab
  clicked.classList.add('operations__tab--active');

  //
  //6. activate the content
  //7. before activation, remove the content active class from all the content
  tabcontent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ----Menu fade animation (mouse over)

//6. make the below a function (refactoring)
const handleHover = function (e) {
  //2. if users acually clicked the link (<a class='nav__link'> tag is clicked)
  if (e.target.classList.contains('nav__link')) {
    //3. select all the involved elements
    //actual clicked link
    const link = e.target;
    //the sibs of links
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //4. set the opacity
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// 1. use event delegation
//1.1 attach event listner to parent
const nav = document.querySelector('.nav');
//add event listner should pass on a real function
//use bind method: allow us to use the 'This' keyword, addEventListener requires a function as parameter
nav.addEventListener('mouseover', handleHover.bind(0.5));
//5. mouse out
nav.addEventListener('mouseout', handleHover.bind(1));

// ---- Sticky navigation (bad performance)
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if(this.window.scrollY > initialCoords.top)nav.classList.add('sticky')
//   else nav.classList.remove('sticky');
// });

// ---- Sticky navigation: Intersection Oberserver API
// Logic of intersaction observer
// entries are actually an array of the threshold entries.
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, (the whole viewport)
//   threshold: 0.2,
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

// --- Implementing sticky navigation using Intersaction Observer
// observe the header (when we cant see the header, therefore 0%
//intersaction)
const header = document.querySelector('.header');
//how to get the value of nav height (used in rootMargin)
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  // console.log(entries);
  const [entry] = entries;
  // console.log(entry);
  // logic: when not intersacting, add class to nav, else remove class
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// -- Reveal Sections (with hidden-class)
const sections = document.querySelectorAll('.section');

const revealSec = function (entries, observer) {
  // console.log(entries);
  const [entry] = entries;
  // console.log(entry);
  // console.log(observer);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //to unobserve, and not receiving more entries
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSec, {
  root: null,
  threshold: 0.15,
});
//observing a nodeList
sections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// --Lazy loading images (good for performance)
// IntersectionObserver use case
//1. selecting all the images that has the attribute of data-src
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  //Guard clause
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //remove filter (once img is loaded, then remove filter)
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  //let the loading finish before reaching the threshold
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

// --Slider
const slider = function(){
// initial condition to make them side by side
const slides = document.querySelectorAll('.slide');
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';
// slider.style.overflow = 'visible';
// 1. first set the transformer property to make the images visible
// the percentage of 4 imagines are 0%, 100%, 200%, 300%, therefore
//the formula

//we create current slide variable
let curSlide = 0;
const maxSlide = slides.length;

//2. work on the functionality - make them slide
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
//-- implementing the dot component
const dotContainer = document.querySelector('.dots');

// Functions 
//creat dots function
const createDots = function () {
  //_, throwaway variable, cause we only need the index
  //we are using the slides because we have 4 slides terefore 4 dots
  slides.forEach(function (_, i) {
    //creating HTML element
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

//activate the correspondent dot
const activateDot = function (slide) {
  //first remove activate class on all dots, loop all the dots
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  //add the active class to clicked dot
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
//3.3 refactoring
const goToSlide = function (slide) {
  // console.log(slide);
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
// the above are all declaration, so here is the start of the operation
//we then first call the function to set the first slide = 0

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    //if we reach the final slide, go back to first slide
    curSlide = 0;
  } else {
    //3.2 increase curSlide by 1
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const preSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);

};

init();
//Event handlers 
btnRight.addEventListener(
  'click',
  nextSlide
  //3. making them slide is basically changing the value of the transformer
  //to begin with we have 0%, to move to next we have to increase that
  //3.3curslide = 1: -100%, 0%, 100%, 200%
  //3.4 make it stop when we reach the last one, define maxSlide
);
btnLeft.addEventListener('click', preSlide);

//-- implementing keyboard event to slider
document.addEventListener('keydown', function (e) {
  // console.log(e);
  if (e.key === 'ArrowLeft') preSlide();
  //short circutting
  e.key === 'ArrowRight' && nextSlide();
});

//using event delegation to add event listner to dots
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    // console.log('DOT');
    // console.log(e.target);
    //destructuring
    const { slide } = e.target.dataset;
    goToSlide(slide);
    //activate the dot
    activateDot(slide);
  };
});
};
slider();



// --- For REVIEWING 
//selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// ----------------This is for future reference
// --------- SELECTING ELEMENTS
//----SELECTING THE WHOLE DOCUMENT----
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// //select specific element
// const header = document.querySelector('.header');
// //select multiple elements - returns a node list that contains all the sections
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// // Get element by ID
// document.getElementById('#section--1');
// // Get element by tag name - returns HTML(live) Collection - updates automatically
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// // Get element by Class name - live HTML collection
// document.getElementsByClassName('btn');

// // ---CREATING AND INSERTING ELEMENTS
// //This is how we make the cookie message
// // quick way to create element --> .insertAdjacentHTML
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // Inserting elements
// //DOM element is unique can only appear in one of the positions, therefore can both insert element and move element
// //INSERT AT THE BEGINNING
// // header.prepend(message);
// header.append(message);
// //if we want to insert multiple elements,
// //we first clone it
// // header.append(message.cloneNode(true));

// // another insert method --- siblings
// // header.before(message);
// // header.after(message);

// // Delete elements
// const cookieBtn = document.querySelector('.btn--close-cookie');
// cookieBtn.addEventListener('click', function () {
//   //remove() is more recent
//   message.remove();
//   // message.parentElement.removeChild(message);
// });

// //styles ---- inline style
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style);
// console.log(message.style.color);
// console.log(message.style.backgroundColor);

// //computedStyle
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// //returns the root element of the document
// // document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes - getting attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// //setting attributes
// logo.alt = 'Beautiful logo';

// // Non-standard
// console.log(logo.designer); //returns undefined
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// //getting URL
// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// //getting href
// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // DATA Attribute
// console.log(logo.dataset.versionNumber);

// //classes the 4 classes
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c'); //not includes

// --- more ways to listen events
// ** most important ones: mouse & keyboard

//1. mouse enter - acts like hovering in CSS
// const h1 = document.querySelector('h1');
// // 3. exporting the function so we can do removal
// const alertH1 = function (e) {
//   alert('addEventListener: You are reading the heading :D');

//   // 4. remove the event listener, cause we only want to listen to the event once.
//   // h1.removeEventListener('mouseenter', alertH1);
// };
// // 5. add event listener using the outside function
// h1.addEventListener('mouseenter', alertH1);

// // 2. this is an old way to listen to events
// // h1.onmouseenter = function (e) {
// //   alert('onmouseenter: You are reading the header :D');
// // };

// //6. we can also remove the event listener after some time
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// 7. an old-fashion way add it to the html, refer to html h1 tag

// --Event propagation
//generate random color when click
// const randomInt = (min, max) => Math.floor(Math.random() * (max-min+1)+min);
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target);

//   //Stop propagation, not a good idea to stop propagation in general
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target);
// });

// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target);
//   //if last parameter set true, it's captured (rarely used)
// });

//// --DOM TRAVERSING - selecting an element from another element

// Going downwards: child
//selecting the child element of h1
// const h1 = document.querySelector('h1');

// console.log(h1.querySelector('.highlight'));
// //select direct children
// console.log(h1.childNodes); //returns all the nodes
// console.log(h1.children); //returns HTML collection
// //first and last element child, setting their style
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards: parents
// console.log(h1.parentNode); //returns all the nodes
// console.log(h1.parentElement); //returns all the element
// //closest finds the parent while queryselector finds the children
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// //going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //if we need all the siblings we can move up to parent elment and see
// //all the children

// console.log(h1.parentElement.children);//returns iterable HTML collection
//making change to all the children element except the h1 itself
// [...h1.parentElement.children].forEach(function (el){
//   if(el !== h1) el.style.transform = 'scale(0.5)';
// });


//Lifecycle DOM Event
//DOM Content loaded 
document.addEventListener('DOMContentLoaded', function(e){
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function(e){
  console.log('page fully loaded', e);
});

// when ask users really want to close the page 
window.addEventListener('beforeunload', function(e){
  e.preventDefault();
  console.log(e);
  e.returnValue='';
});