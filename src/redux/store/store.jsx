import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as reducer from '../reducer/index';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga';
import {sagas} from '../saga/index';

// Shape of state
const initialState = {
  searchResults: {
    books: [],
    name: ''
  },
  searchResultDetails: {},
  searchHistory: [],
  readSetting: {},
  bookList: [],
  readingState: {},
  bookData: {}
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['bookList', 'readingState', 'searchHistory', 'readSetting']
}
 
const persistedReducer = persistReducer(persistConfig, combineReducers(reducer));

const sagaMiddleware = createSagaMiddleware();

//创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。
const  store = createStore(
  persistedReducer,
  initialState,
  applyMiddleware(thunk, sagaMiddleware)
);

sagaMiddleware.run(sagas);

const persistor = persistStore(store)

export {store, persistor};