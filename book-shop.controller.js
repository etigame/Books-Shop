'use strict'

function onInit() {
  renderFilterByQueryStringParams()
  renderBooks()
}

function renderBooks() {
  var books = getBooksForDisplay()

  var strHTMLs = books.map(
    (book) => `<tr>
    <td>${book.id}</td>
    <td>${book.bookName}</td>
    <td>${book.price} $</td>
    <td><img src="${book.imgURL}" alt="${book.bookName} img"/></td>
    <td>${book.rate}</td>
    <td class="actions-container">
    <button class="btn-read" onclick="onReadBook('${book.id}')">Read</button>
    <button class="btn-update" onclick="onUpdateBook('${book.id}')">Update</button>
    <button class="btn-remove" onclick="onRemoveBook('${book.id}')">Remove</button>
    </td>
    </tr>`
  )

  document.querySelector('tbody').innerHTML = strHTMLs.join('')
}

function onRemoveBook(bookID) {
  removeBook(bookID)
  renderBooks()
}

function onAddBook() {
  var bookName = prompt('Book Name:')
  var bookPrice = +prompt('Price:')
  var bookImg = prompt('Img URL:')

  if (bookName && bookPrice && bookImg) {
    addBook(bookName, bookPrice, bookImg)
    renderBooks()
  }
}

function onUpdateBook(bookID) {
  const book = getBookById(bookID)
  var bookPrice = +prompt('New price:')
  if (bookPrice && book.price !== bookPrice) {
    updateBook(bookID, bookPrice)
    renderBooks()
  }
}

function onReadBook(bookID) {
  const book = getBookById(bookID)
  var elModal = document.querySelector('.modal-book')
  elModal.querySelector('h3').innerText = book.bookName
  elModal.querySelector('img').src = `${book.imgURL}`
  elModal.querySelector('img').alt = `${book.bookName} img`
  elModal.querySelector('h4 span').innerText = `${book.price} $`

  elModal.querySelector('.rate-container').innerHTML = `Rate: 
    <button class="btn-minus-rate" onclick="onDecreaseRate('${bookID}')">-</button>
    <div class="currRate">${book.rate}</div>
    <button class="btn-plus-rate" onclick="onIncreaseRate('${bookID}')">+</button>`

  elModal.querySelector('p').innerText = makeLorem(40)
  elModal.classList.add('open')
  // document.querySelector('body').classList.add('open-modal')
  console.log(window.location.search)
  const modalOpenStr = `?&modalOpen=${bookID}` // set func that add ? if there are no queryparams
  // dont forget to remove modal from queryparam
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    window.location.search +
    modalOpenStr
  window.history.pushState({}, '', newUrl) // what should be in the state parameter?

}

function onCloseModal() {
  document.querySelector('.modal-book').classList.remove('open')
  // document.querySelector('body').classList.remove('open-modal')
}

function onDecreaseRate(bookID) {
  decreaseRate(bookID)
  renderBooks()

  const book = getBookById(bookID)
  document.querySelector('.currRate').innerText = `${book.rate}`
}

function onIncreaseRate(bookID) {
  increaseRate(bookID)
  renderBooks()

  const book = getBookById(bookID)
  document.querySelector('.currRate').innerText = `${book.rate}`
}

function onSetFilterBy(filterBy) {
  filterBy = setBookFilter(filterBy) // need to return it because of queryStringParams
  renderBooks()

  const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}&searchText=${filterBy.txt}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const filterBy = {
    maxPrice: queryStringParams.get('maxPrice') || 40,
    minRate: queryStringParams.get('minRate') || 0,
    txt: queryStringParams.get('searchText') || '',
  }

  if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.txt) return

  document.querySelector('.filter-max-price').value = filterBy.maxPrice
  document.querySelector('.filter-min-rate').value = filterBy.minRate
  document.querySelector('.filter-search-box').value = filterBy.txt

  setBookFilter(filterBy)
}

function onPrevPage() {
  if (isLastPage())
    document.querySelector('.btn-next').removeAttribute('disabled')

  prevPage()
  const pageIdx = getPageIdx()
  if (pageIdx === 0)
    document.querySelector('.btn-prev').setAttribute('disabled', '')

  renderBooks()
}

function onNextPage() {
  const currPageIdx = getPageIdx()
  if (currPageIdx === 0) {
    document.querySelector('.btn-prev').removeAttribute('disabled')
  }

  nextPage()
  //   var isLast = isLastPage()
  if (isLastPage())
    document.querySelector('.btn-next').setAttribute('disabled', '')

  //   const pageIdx = getPageIdx()
  //   const elPrevBtn = document.querySelector('.btn-prev')
  //   if (pageIdx > 0) elPrevBtn.removeAttribute('disabled')

  renderBooks()
}
