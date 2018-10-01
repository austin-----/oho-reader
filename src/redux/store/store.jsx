import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as reducer from '../reducer/index';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, REHYDRATE } from 'redux-persist'
import StoreJs from '../../method/storejs';
import storage from 'redux-persist/lib/storage';
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
  bookData: {},
  chapterContent: {}
};

const persistConfig = {
  key: 'root',
  storage: StoreJs,
  whitelist: ['bookList', 'readingState', 'bookData', 'searchHistory', 'readSetting']
}

const persistConfigLocal = {
  key: 'local',
  storage
}
 
const { chapterContent, ...otherReducers } = reducer;

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    ...otherReducers,
    chapterContent: persistReducer(persistConfigLocal, chapterContent)
  }));

const sagaMiddleware = createSagaMiddleware();

//创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。
const  store = createStore(
  persistedReducer,
  initialState,
  applyMiddleware(thunk, sagaMiddleware)
);

sagaMiddleware.run(sagas);

const persistor = persistStore(store)

StoreJs.connectCallback = (key, state) => { persistor.dispatch ({
  type: REHYDRATE,
  payload: state,
  err: null,
  key
}) }

export {store, persistor};