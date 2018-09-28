import {SET_SEARCH_RESULT, CACHE_BOOK_DETAILS}  from '../action/index';
import {ADD_TO_BOOKLIST, REMOVE_FROM_BOOKLIST, SET_BOOKLIST} from '../action/index';
import {SET_BOOK_SOURCE, SET_BOOK_PROGRESS} from '../action/index';
import {SET_BOOK_DETAILS, SET_BOOK_CHAPTERS} from '../action/index';

//搜索书籍
export const searchResults = (state = {books: [], name: ''}, action={}) => {
  switch (action.type){
    case SET_SEARCH_RESULT:
      let {
        data: {books},
        name
      } = action
      return Object.assign({}, state, {books, name});
    default:
      return state;
  }
}

//书籍详情
export const searchResultDetails = (state = {}, action={}) => {
  switch(action.type){
    case CACHE_BOOK_DETAILS:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}

//默认书单列表
export const bookList = (state = [], action={}) => {
  switch(action.type){
    case ADD_TO_BOOKLIST:
      var set = new Set(state);
      if (set.has(action.data._id)) {
        return state;
      }
      set.add(action.data._id);
      return Array.from(set);
    case REMOVE_FROM_BOOKLIST:
      var set = new Set(state);
      set.delete(action.data._id);
      return Array.from(set);
    case SET_BOOKLIST:
      return state;
    default:
      return state;
  }
}

export const readingState = (state = {}, action={}) => {
  var book = state[action.bookId] || {};
  switch(action.type) {
    case SET_BOOK_PROGRESS:
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, book, {readIndex: action.readIndex})
      });
    case SET_BOOK_SOURCE:
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, book, {sourceId: action.sourceId})
      });
    default:
      return state;
  }
}

export const bookData = (state = {}, action = {}) => {
  var book = state[action.bookId] || {};
  switch(action.type) {
    case SET_BOOK_DETAILS:
    return Object.assign({}, state, {
      [action.bookId]: Object.assign({}, book, {details: action.details})
    });
    case SET_BOOK_CHAPTERS:
    return Object.assign({}, state, {
      [action.bookId]: Object.assign({}, book, {chapterInfo: action.chapters})
    });
    default:
      return state;
  }
}