import 'regenerator-runtime/runtime';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as bookApi from '../../method/bookApi';
import * as actions from '../action/index';

export function* sagas() {
    yield takeLatest(actions.REFRESH_BOOK, refreshBook);
    yield takeLatest(actions.REFRESH_BOOKLIST, refreshBooks);
}

function* refreshBook(action) {
    let bookId = action.bookId;
    yield refreshBooks({list: [bookId], readingState: []});
}

function* refreshBooks(action) {

    let localBookList = action.list;
    let bookIdArr = [];
    let bookSourceIdArr = [];

    try {
        for (let bookId of localBookList) {
            bookIdArr.push(bookId);

            var sourceId;
            var bookState = action.readingState[bookId];

            if (bookState == null || bookState.sourcdId == null) {

                sourceId = yield call(bookApi.getBookSourceId, bookId);
                yield put(actions.setBookSource(bookId, sourceId));
                yield put(actions.setBookProgress(bookId, 0));

            } else {
                sourceId = bookState.sourceId;
            }

            bookSourceIdArr.push(sourceId);
        }

        let details = bookIdArr.map(function* (item) {
            var data = yield call(bookApi.getBookDetails, item);
            yield put(actions.setBookDetails(data));
        });

        let chapters = bookSourceIdArr.map(function* (item, index) {
            var data = yield call(bookApi.getBookChapters, item);
            yield put(actions.setBookChapters(localBookList[index], data));
        });

        yield all([...details, ...chapters]);
    } catch (e) {
        console.log(e);
    }
}