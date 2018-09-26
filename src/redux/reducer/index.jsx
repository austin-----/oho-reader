import {GET_BOOK_LIST, GET_BOOK_ITEM}  from '../action/index';
import {ADD_LIST, REMOVE_LIST, GET_LIST, REFRESH_LIST} from '../action/index';

//搜索书籍
export const fetchBookList = (state = {books: [], name: ''}, action={}) => {
  switch (action.type){
    case GET_BOOK_LIST:
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
export const fetchBookItem = (state = {}, action={}) => {
  switch(action.type){
    case GET_BOOK_ITEM:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}


//默认书单列表
export const bookList = (state = {list: [], id: new Set()}, action={}) => {
  switch(action.type){
    case ADD_LIST:
      if (state.id.has(action.data._id)) {
        return state;
      }
      var newId = new Set(state.id);
      newId.add(action.data._id);
      return Object.assign({}, state, {
        list: [
          ...state.list,
          action.data
        ],
        id: newId
      });
    case REMOVE_LIST:
      var newId = new Set(state.id);
      newId.delete(action.data._id);
      var newList = state.list.slice();
      for (let index in newList){
        if (newList[index]._id === action.data._id) {
          newList.splice(index, 1);
          break;
        }
      }
      return Object.assign({}, state, {
        list: newList,
        id: newId
      });
    case GET_LIST:
      return state;
    case REFRESH_LIST:
      return Object.assign({}, state, {
        bookList: {
          ...state.id,
          list: action.data
        }
      });
    default:
      return state;
  }
}

