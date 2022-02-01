'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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
*/

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
