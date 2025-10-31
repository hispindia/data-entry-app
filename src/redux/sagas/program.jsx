import { metadataApi } from "@/api";
import { setProgramMetadata } from "../actions/metadata";
import { GET_PROGRAM_METADATA } from "../actions/metadata/type";
import { call, put, takeLatest } from "redux-saga/effects";

function* getProgramWorker(action) {
    try {
        const program = yield call(metadataApi.getProgramMetadata, action.payload.program);
        yield put(setProgramMetadata(program))
    } catch (e) {
        console.error("handleGetProgram", e);
    }  
}

export default function* getProgramSaga() {
  console.log('getProgramSaga running...');
      yield takeLatest(GET_PROGRAM_METADATA, getProgramWorker);
}