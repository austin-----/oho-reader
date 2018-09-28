import * as bookApi from '../../method/bookApi';

export const SET_SEARCH_RESULT = 'SET_SEARCH_RESULT';
export const CACHE_BOOK_DETAILS = 'CACHE_BOOK_DETAILS';

export const ADD_TO_BOOKLIST = 'ADD_TO_BOOKLIST';
export const REMOVE_FROM_BOOKLIST = 'REMOVE_FROM_BOOKLIST';

export const SET_BOOK_SOURCE = 'SET_BOOK_SOURCE';
export const SET_BOOK_PROGRESS = 'SET_BOOK_PROGRESS';

export const SET_BOOK_DETAILS = 'SET_BOOK_DETAILS';
export const SET_BOOK_CHAPTERS = 'SET_BOOK_CHAPTERS';

export const REFRESH_BOOKLIST = 'REFRESH_BOOKLIST';

// export const GET_BOOK_SOURCE = 'GET_BOOK_SOURCE';
// export const GET_CHAPTER_CONTENT = 'GET_CHAPTER_CONTENT';
// export const GET_CHAPTER_LIST = 'GET_CHAPTER_LIST';

export const setSearchResult = (data, name) => {
  return {
    type: SET_SEARCH_RESULT,
    data,
    name
  }
}

// Search for books
export const searchBook = (name) => {
  return dispatch => {
    bookApi.searchBook(name)
      .then(books => dispatch(setSearchResult(books, name)))
      .catch(error => {
        console.log(error);
      });
  }
}

export const cacheBookDetails = (data) => {
  return {
    type: CACHE_BOOK_DETAILS,
    data
  }
}

// Retrieve book details
export const retrieveBookDetails = (id) => {
  return dispatch => {
    bookApi.getBookDetails(id)
      .then(data => dispatch(cacheBookDetails(data)))
      .catch(error => {
        console.log(error);
      });
  }
}

// remove a book from book list
export const deleteBook = (data) => {
  return {
    type: REMOVE_FROM_BOOKLIST,
    data
  }
}

export const addToBookList = (data) => {
  return {
    type: ADD_TO_BOOKLIST,
    data
  }
}

export const setBookSource = (bookId, sourceId) => {
  return {
    type: SET_BOOK_SOURCE,
    bookId,
    sourceId
  }
}

export const setBookProgress = (bookId, readIndex) => {
  return {
    type: SET_BOOK_PROGRESS,
    bookId,
    readIndex
  }
}

export const setBookDetails = (book) => {
  return {
    type: SET_BOOK_DETAILS,
    bookId: book._id,
    details: book
  }
}

export const setBookChapters = (bookId, chapters) => {
  return {
    type: SET_BOOK_CHAPTERS,
    bookId,
    chapters
  }
}

// add a book to book list
export const addBook = (data) => {
  let book = data;
  return dispatch => {
    var bookId = book._id;

    bookApi.getBookSourceId(bookId)
      .then(sourceId => {
        dispatch(addToBookList(book));
        dispatch(setBookProgress(bookId, 0));
        dispatch(setBookSource(bookId, sourceId));
        dispatch(setBookDetails(book));

        bookApi.getBookChapters(sourceId)
          .then(chapters => {
            dispatch(setBookChapters(bookId, chapters));
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export const changeSource = (bookId, sourceId) => {
  return dispatch => {
    dispatch(setBookSource(bookId, sourceId));

    bookApi.getBookChapters(sourceId)
    .then(data => {
      // set chapters and sourceId
      dispatch(setBookChapters(bookId, data));
    })
    .catch(error => {
      console.log(error);
    })
  }
}

// refresh books in book list
export const refreshBooks = (list, readingState) => {
  return {
    type: REFRESH_BOOKLIST,
    list,
    readingState
  }
}