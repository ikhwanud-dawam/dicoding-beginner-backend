const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name || name === null || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (name) {
    const filteredBooksByName = books.filter(book => book.name.toLowerCase().includes(name.toLowerCase())).map(({ id, name, publisher }) => ({ id, name, publisher }))

    return {
      status: 'success',
      data: {
        books: filteredBooksByName
      }
    }
  }

  if (reading === '0') {
    const unreadingBooks = books.filter(book => book.reading === false).map(({ id, name, publisher }) => ({ id, name, publisher }))

    return {
      status: 'success',
      data: {
        books: unreadingBooks
      }
    }
  }

  if (reading === '1') {
    const readingBooks = books.filter(book => book.reading === true).map(({ id, name, publisher }) => ({ id, name, publisher }))

    return {
      status: 'success',
      data: {
        books: readingBooks
      }
    }
  }

  if (finished === '0') {
    const unfinishedBooks = books.filter(book => book.finished === false).map(({ id, name, publisher }) => ({ id, name, publisher }))

    return {
      status: 'success',
      data: {
        books: unfinishedBooks
      }
    }
  }

  if (finished === '1') {
    const finishedBooks = books.filter(book => book.finished === true).map(({ id, name, publisher }) => ({ id, name, publisher }))

    return {
      status: 'success',
      data: {
        books: finishedBooks
      }
    }
  }

  return {
    status: 'success',
    data: {
      books: books.map(({ id, name, publisher }) => ({ id, name, publisher })).map(({ id, name, publisher }) => ({ id, name, publisher }))
    }
  }
}

const getDetailedBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter(book => book.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name || name === null || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const index = books.findIndex((book) => book.id === bookId)

  const updatedAt = new Date().toISOString()
  const finished = pageCount === readPage

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex(book => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getBooksHandler, getDetailedBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
