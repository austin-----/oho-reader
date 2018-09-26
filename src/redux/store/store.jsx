import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as reducer from '../reducer/index';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


// Shape of state
const initialState = {
  fetchBookList: {
    books: [],
    name: ''
  },
  fetchBookItem: {},
  bookList: {
    id: [],
    list: []
  }
};

const persistConfig = {
  key: 'root',
  storage,
}
 
const persistedReducer = persistReducer(persistConfig, combineReducers(reducer));

//创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。
const  store = createStore(
  persistedReducer,
  initialState,
  applyMiddleware(thunk)
);

const persistor = persistStore(store)

export {store, persistor};