import { all } from 'redux-saga/effects';
import dataSaga from './data';
import teisSaga from './teis';
import common from './common';
import programSaga from './program';
import eventSaga from './events';

export default function* rootSaga() {
    yield all([dataSaga(), teisSaga(), eventSaga(),programSaga(), common()]);
}
