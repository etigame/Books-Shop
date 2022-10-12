'use strict'

const STORAGE_KEY = 'bookShopDB'
const PAGE_SIZE = 1

var gPageIdx = 0
var gBooks
var gFilterBy = {
  maxPrice: 40,
  minRate: 0,
  txt: '',
}

_createBooks()

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY)

  if (!books || !books.length) {
    books = [
      {
        id: makeId(),
        bookName: 'Harry Potter and the Chamber of Secrets',
        price: getRandomIntInclusive(20, 30),
        imgURL:
          'https://upload.wikimedia.org/wikipedia/en/5/5c/Harry_Potter_and_the_Chamber_of_Secrets.jpg',
        rate: 0,
      },
      {
        id: makeId(),
        bookName: 'Zen and the Art of Motorcycle Maintenance',
        price: getRandomIntInclusive(30, 40),
        imgURL:
          'https://readinglist.click/wp-content/uploads/2017/04/zen-motorcycle-maintenance.png',
        rate: 0,
      },
      {
        id: makeId(),
        bookName: 'The Art of Hearing Heartbeats',
        price: getRandomIntInclusive(30, 40),
        imgURL:
          'https://m.media-amazon.com/images/I/51E-l7kWDdL._SX332_BO1,204,203,200_.jpg',
        rate: 0,
      },
    ]
  }

  gBooks = books
  _saveBooksToStorage()
}

function _createBook(name, price, imgURL) {
  return {
    id: makeId(),
    bookName: name,
    price: price,
    imgURL: imgURL,
    rate: 0,
  }
}

function getBooksForDisplay() {
  // Filtering:
  var books = gBooks.filter(
    (book) =>
      book.price <= gFilterBy.maxPrice &&
      book.rate >= gFilterBy.minRate &&
      book.bookName.toLowerCase().includes(gFilterBy.txt.toLowerCase())
  )

  // Paging:
  const startIdx = gPageIdx * PAGE_SIZE
  books = books.slice(startIdx, startIdx + PAGE_SIZE)

  return books
}

function removeBook(bookID) {
  var bookIdx = gBooks.findIndex((book) => book.id === bookID)
  gBooks.splice(bookIdx, 1)
  _saveBooksToStorage()
}

function addBook(name, price, imgURL) {
  var addedBook = _createBook(name, price, imgURL)
  gBooks.unshift(addedBook)
  _saveBooksToStorage()
}

function updateBook(bookID, bookPrice) {
  var book = getBookById(bookID)
  book.price = bookPrice
  _saveBooksToStorage()
}

function decreaseRate(bookID) {
  var book = getBookById(bookID)
  if (book.rate > 0) {
    book.rate--
    _saveBooksToStorage()
  }
}

function increaseRate(bookID) {
  var book = getBookById(bookID)
  if (book.rate < 10) {
    book.rate++
    _saveBooksToStorage()
  }
}

function setBookFilter(filterBy = {}) {
  // filterBy.maxPrice can be 0 and that would be falsy - thats why !== undefined
  // same for filterBy.txt can be '' that would be falsy
  if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
  if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
  if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt

  return gFilterBy
}

function prevPage() {
  gPageIdx--
  if (gPageIdx * PAGE_SIZE < 0) gPageIdx = 0
}

function nextPage() {
  gPageIdx++
}

function isLastPage(){
    return gPageIdx * PAGE_SIZE >= gBooks.length - 1
}

function getPageIdx() {
  return gPageIdx
}

function getBookById(bookID) {
  var book = gBooks.find((book) => book.id === bookID)
  return book
}

function _saveBooksToStorage() {
  saveToStorage(STORAGE_KEY, gBooks)
}
