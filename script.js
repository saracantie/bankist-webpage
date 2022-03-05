'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

//----- Modal window -----//
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

//----- Button Scrolling -----//
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());
  //vc ve a distancia do elemento target (o botao Learn More) ate a parte superior da viewport
  console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

  console.log(
    'height/width of the viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  //por isso vemos qual a coordenada da section 1(para onde tem que scroll qdo apertar Learn More)
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  //esse TOP eh relativo a viewport e nao ao documento todo. entao qd clicar de outro lugar ele n vai ao mesmo ponto. entao se soma o page offset pra saber a posicao em absoluta em relacao ao docmento, para sempre ir ao mesmo ponto

  //pra ficar melhor, se passa um objeto inteiro como argument, pra colocar o behviour como smooth:
  //   window.scrollTo({
  //     left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top + window.pageYOffset,
  //     behavior: 'smooth',
  //   });
  //

  //ESSE DE CIMA EH O JEITO OLD SCHOOL, vendo as distancias pra calcular etc
  //O MODO MODERNO EH SIMPLS ASSIm:

  section1.scrollIntoView({ behavior: 'smooth' });
});

//----- Page Navigation -----//

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//uma forma mais eficiente de fazer o mesmo que acima eh com Event Delegation. colocando a funcao num elemento pai comum a tds que queremos

//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target); //event.target eh quem diz onde o evento se originou
  e.preventDefault();

  //Matching strategy:
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//----- Tabbed Component -----//

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //GUARD CLAUSE
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//----- Menu Fade Animation -----//
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    //pegar o parent pra a partir dele pegar tds os siblings
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//passing "argument" into handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//----- Sticky Navigation -----//

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// //this callback function will be called each time the Observer element(section1) is intersecting the root element at the treshhold defined no matter if srolling up or down

// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//----- Reveal Sections -----//
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//----- Lazy Loading Images -----//
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src with data-src(good resolution img)
  entry.target.src = entry.target.dataset.src;
  //remove blur filter class
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//----- Slider -----//
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  //-functions-//
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      //o tamanho dos slides eh de 100, por isso os translateX mudam de -100 para 0 para 100 (pois 3 slides)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //-event handlers-//
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    //(mudar slides tbm pelo teclado)
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////

/*
console.log(document.documentElement); //mostra o documento html inteiro
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header'); //seleciona o primeiro .header que encontra
const allSections = document.querySelectorAll('.section'); //seleciona multiplos elementos .section
document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); //esse retorna uma html collction e nao node list. html collection vc edita e atualiza automaticamente
console.log(allButtons);

console.log(document.getElementsByClassName('btn')); //esse tb retorna live html collection

//CREATING AND INSERTING ELEMENTS

// .insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent =
  'We use cookies for improved functionality and analyctics.';
message.innerHTML;

header.prepend(message); //prepend - vai ser a 1a child, vai escrever no comeco da header
header.append(message); //no final

//DELETING ELEMENTS
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//STYLES
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//qd queremos um style que nao declaramos no css:
console.log(getComputedStyle(message).color);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//css custom properties(variables)
document.documentElement.style.setProperty('--color-primary', 'orangered');

//ATRIBUTES
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);

//Data Atributes
console.log(logo.dataset.versionNumber);

//CLASSES
logo.classList.add();
logo.classList.remove();
logo.classList.toggle();
logo.classList.contains(); //not includes, like in arrays


const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great, you are reading the heading');

  h1.removeEventListener('mouseenter', alertH1);
};
//colocar esse remove no mesmo elemento ai ele soh acontece uma vez e depois remove

h1.addEventListener('mouseenter', alertH1);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great, you are reading the heading');
// };

//o que mais se usa atualmente eh o addeventlistener. pq pode colcoar multiplos eventlisteners no mesmo evento


const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.styke.backgroundColo = randomColor();
});

document
  .querySelector('.nav__links')
  .addEventListener('click', function (e) {});

document.querySelector('.nav').addEventListener('click', function (e) {});


//DOM TRAVERSING

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); //esse seleciona todos highlight n importa o quao deep esteja na arvore depois de h1.esse abaixo funcionam soh pra direct children:
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.getElementsByClassName.color = 'white';
h1.lastElementChild.getElementsByClassName.color = 'orangered';

//Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
//eh igual queryselector mas ao inves de encontrar childrens nao importa onde encontra os parents

//Going sideways: siblings

//p elements:
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
//p nodes:
console.log(h1.previousSibling);
console.log(h1.nextSibling);
*/
