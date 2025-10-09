import { metadataApi } from "@/api";
import { setProgramMetadata } from "../actions/metadata";
import { GET_PROGRAM_METADATA } from "../actions/metadata/type";
import { call, put, takeLatest } from "redux-saga/effects";

function* getProgramWorker(action='') {
    const program = yield call(metadataApi.getProgramMetadata, action.payload.program);
    yield put(setProgramMetadata(program))
    
}

export default function* getProgramSaga() {
  console.log('getProgramSaga running...');
      yield takeLatest(GET_PROGRAM_METADATA, getProgramWorker);
}