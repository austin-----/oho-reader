import { SET_SEARCH_RESULT, CACHE_BOOK_DETAILS } from '../action/index';
import { ADD_TO_BOOKLIST, REMOVE_FROM_BOOKLIST, SET_BOOKLIST } from '../action/index';
import { SET_BOOK_SOURCE, SET_BOOK_PROGRESS, SET_BOOK_READSCROLL, REMOVE_BOOK_READING } from '../action/index';
import { SET_BOOK_DETAILS, SET_BOOK_CHAPTERS, REMOVE_BOOK_DATA } from '../action/index';
import { ADD_TO_SEARCH_HISTORY, CLEAR_SEARCH_HISTORY } from '../action/index';
import { SET_READ_SETTING } from '../action/index';
import { CACHE_CHAPTER_CONTENT, REMOVE_CHAPTER_CONTENT, CLEAR_CHAPTER_CONTENT } from '../action/index';

//搜索书籍
export const searchResults = (state = { books: [], name: '' }, action = {}) => {
  switch (action.type) {
    case SET_SEARCH_RESULT:
      let {
        data: { books },
        name
      } = action
      return Object.assign({}, state, { books, name });
    default:
      return state;
  }
}

//书籍详情
export const searchResultDetails = (state = {}, action = {}) => {
  switch (action.type) {
    case CACHE_BOOK_DETAILS:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}

//搜索历史
export const searchHistory = (state = [], action = {}) => {
  switch (action.type) {
    case ADD_TO_SEARCH_HISTORY:
      var history = state.slice();
      return [action.search, ...history];
    case CLEAR_SEARCH_HISTORY:
      return [];
    default:
      return state;
  }
}

//阅读设置
export const readSetting = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_READ_SETTING:
      return Object.assign({}, state, action.setting);
    default:
      return state;
  }
}

//默认书单列表
export const bookList = (state = [], action = {}) => {
  switch (action.type) {
    case ADD_TO_BOOKLIST:
      var set = new Set(state);
      if (set.has(action.bookId)) {
        return state;
      }
      set.add(action.bookId);
      return Array.from(set);
    case REMOVE_FROM_BOOKLIST:
      var set = new Set(state);
      set.delete(action.bookId);
      return Array.from(set);
    case SET_BOOKLIST:
      return action.list;
    default:
      return state;
  }
}

// 阅读进度
export const readingState = (state = {}, action = {}) => {
  var book = state[action.bookId] || {};
  switch (action.type) {
    case SET_BOOK_PROGRESS:
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, book, { readIndex: action.readIndex })
      });
    case SET_BOOK_SOURCE:
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, book, { sourceId: action.sourceId })
      });
    case SET_BOOK_READSCROLL:
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, book, { readScroll: action.readScroll })
      });
    case REMOVE_BOOK_READING:
      const { [action.bookId]: _, ...newState } = state;
      return newState;
    default:
      return state;
  }
}

// 书籍章节
export const bookData = (state = {}, action = {}) => {
  var book = state[action.bookId] || {};
  switch (action.type) {
    case SET_BOOK_DETAILS:
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, book, { details: action.details })
      });
    case SET_BOOK_CHAPTERS:
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, book, { chapterInfo: action.chapters })
      });
    case REMOVE_BOOK_DATA:
      const { [action.bookId]: _, ...newState} = state;
      return newState;
    default:
      return state;
  }
}

// 缓存章节
export const chapterContent = (state = {}, action = {}) => {
  const chapters = state[action.bookId] || {};
  switch (action.type) {
    case CACHE_CHAPTER_CONTENT:
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, chapters, action.chapterContents)
      });
    case REMOVE_CHAPTER_CONTENT:
      var c = Object.assign({}, chapters);
      action.chapterIds.forEach(i => {
        delete c[i];
      });
      return Object.assign({}, state, {
        [action.bookId]: Object.assign({}, c)
      });
    case CLEAR_CHAPTER_CONTENT:
      const { [action.bookId]: _, ...newState } = state;
      return newState;
    default:
      return state;
  }
}