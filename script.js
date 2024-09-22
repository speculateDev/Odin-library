const cardsBox = document.querySelector('.cards-box');
// On load
const defaultData = [
  {
    title: 'Beyond good and evil',
    author: 'Nietzsche',
    rating: 8.8,
    imgUrl: 'https://m.media-amazon.com/images/I/81p5YYw2DcL._SY425_.jpg',
    status: 'Not Read',
  },
  {
    title: 'Critique of Pure Reason',
    author: 'Kant',
    rating: 9.5,
    imgUrl: 'https://m.media-amazon.com/images/I/81HFexTeoXL._AC_UF1000,1000_QL80_.jpg',
    status: 'Not Read',
  },
  {
    title: 'Peer Gynt',
    author: 'Henrik Ibsen',
    rating: 9.1,
    imgUrl: 'https://pictures.abebooks.com/inventory/21743758818.jpg',
    status: 'Not Read',
  },
  {
    title: 'Notes From Underground',
    author: 'Dostoevsky',
    imgUrl: 'https://m.media-amazon.com/images/I/61hKIP5eo-L._AC_UF1000,1000_QL80_.jpg',
    rating: undefined,
    status: 'Not Read',
  },
];

const getData = function () {
  return JSON.parse(localStorage.getItem('library')) || defaultData;
};

const updateStorage = function () {
  localStorage.setItem('library', JSON.stringify(myLibrary));
};

// Retreive Data
let myLibrary = getData();
updateStorage();

// HTML Renderer
const renderHtml = function (library) {
  cardsBox.textContent = '';
  let html = '';

  library.map((bk, i) => {
    html += `<div class="card" data-index="${i}">
          <img class="card__img" src="${bk.imgUrl}" alt="Book cover" />
          <div class="card__overlay">
            <svg class="delete target__btn">
              <use href="img/icons.svg#icon-trash"></use>
            </svg>
            <div class="card__rating">
              <svg class="star">
                <use href="./img/icons.svg#icon-logo"></use>
              </svg>
              <h2 class="card__rating-overall">${
                bk.rating ? bk.rating + ' / 10' : '? / 10'
              } </h2>
            </div>
  
            <div class="card__name">
              <h2 class="card__title">${bk.title}</h2>
              <h2 class="card__author">${bk.author}</h2>
            </div>
  
            <div class="card__toggle">
              <span class="card__status ${bk.status === 'Read' ? 'greenclr' : 'redClr'}">${
      bk.status
    }</span>
              <div class="btn target__btn">
                <svg class="btn__icon ${bk.status === 'Read' ? 'greenClr' : ''}">
                  <use href="./img/icons.svg#${
                    bk.status === 'Read' ? 'icon-check' : 'icon-x'
                  }"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>`;
  });
  cardsBox.insertAdjacentHTML('afterbegin', html);
};
// On load rendering
renderHtml(myLibrary);

cardsBox.addEventListener('click', (e) => {
  const btn = e.target.closest('.target__btn');
  if (!btn) return;

  // select Index
  const cardIndex = btn.closest('.card').dataset.index;

  if (btn.classList.contains('delete')) {
    // Delete based on index
    myLibrary.splice(cardIndex, 1);
    renderHtml(myLibrary);
    updateStorage();
  } else if (btn.classList.contains('btn')) {
    // Select all els
    const svgIcn = btn.querySelector('.btn__icon');
    const icon = svgIcn.querySelector('use');
    const hrefVal = icon.getAttribute('href');
    let cardStatus = btn.previousElementSibling;
    let iconId = hrefVal.slice(16);
    const newhref = hrefVal.slice(0, 16) + (iconId === 'icon-x' ? 'icon-check' : 'icon-x');

    // Update Text
    cardStatus.textContent = cardStatus.textContent === 'Not Read' ? 'Read' : 'Not Read';
    cardStatus.classList.toggle('redClr');
    cardStatus.classList.toggle('greenclr');

    // Update Arr and Storage
    myLibrary[cardIndex].status = cardStatus.textContent;
    updateStorage();

    // update icon
    icon.setAttribute('href', newhref);
    svgIcn.classList.toggle('active');
    svgIcn.classList.toggle('greenClr');
  }
});

// Modal
const addBtn = document.querySelector('.add__btn');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.modal__close');
const overlay = document.querySelector('.modal__overlay');

const closeModal = () => {
  modal.classList.add('hidden');
};

const showModal = () => {
  modal.classList.remove('hidden');
};

addBtn.addEventListener('click', showModal);
overlay.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);

// Library
const form = document.querySelector('.form');
const inputTitle = document.getElementById('title');
const inputAuthor = document.getElementById('author');
const inputImg = document.getElementById('imgUrl');
const inputRating = document.getElementById('rating');

class Book {
  constructor(title, author, imgUrl = './img/default-cover.jpg', rating = undefined) {
    this.title = title;
    this.author = author;
    this.imgUrl = imgUrl;
    this.rating = rating;
    this.status = 'Not Read';
  }
}

const addBookToLibrary = function (event) {
  event.preventDefault();
  // Get Inputs
  const title = inputTitle.value;
  const author = inputAuthor.value;
  const imgUrl = inputImg.value || './img/default-cover.jpg';
  const rating = inputRating.value;

  // Create Object
  const book = new Book(title, author, imgUrl, rating);

  // Close modal and clear inputs
  closeModal();
  form.reset();

  // Update data
  myLibrary.push(book);
  renderHtml(myLibrary);
  updateStorage();
};

form.addEventListener('submit', addBookToLibrary);

// Reset Functionality
const resetBtn = document.querySelector('.restore__btn');

const reset = function () {
  const res = prompt(`Type 'reset' to restore to default Data`);

  if (res.toLowerCase() !== 'reset') return;
  myLibrary = [...defaultData];
  localStorage.removeItem('library');

  renderHtml(myLibrary);
};

resetBtn.addEventListener('click', reset);

// Prevent Programmatic submit
// form.addEventListener('submit', (e) => {
// if (getComputedStyle(modal).display === 'none') {
// e.preventDefault(); // Prevent the form from submitting
// alert('The form cannot be submitted while hidden.');
// }
// });

// form.querySelectorAll('input, select, textarea').forEach((el) => (el.disabled = true));

// // Re-enable them when showing the form
// addBtn.addEventListener('click', () => {
// form.querySelectorAll('input, select, textarea').forEach((el) => (el.disabled = false));
// });
