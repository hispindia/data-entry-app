import { FAMILY_UID_ATTRIBUTE_ID, MEMBER_PROGRAM_ID, MEMBER_TRACKED_ENTITY_TYPE_ID } from "@/constants/app-config";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import { push } from "connected-react-router";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { dataApi } from "../../../../api";
import { editingAttributes } from "../../../actions/data";
import { getTeiError, getTeiSuccessMessage, loadTei } from "../../../actions/data/tei";
import { setSelectedOrgUnit } from "../../../actions/metadata";
import { GET_TEI } from "../../../types/data/tei";
import { getSelectedOrgUnitByOuId, getTeiId } from "../utils";
import initCascadeDataFromTEIsEvents from "./initCascadeData";
import handleInitData from "./initData";
import initInterviewCascadeDataFromTEIsEvents from "./initInterviewCascadeData";
import handleInitNewData from "./initNewData";
import queryString from "query-string";

export const teiMapping = {
  // firstname: "IEE2BMhfoSc",
  // lastname: "IBLkiaYRRL3",
  // sex: "DmuazFb368B",
  // ethnicity: "tJrT8GIy477",
  // birthyear: "bIzDI9HJCB0",
  // age: "BaiVwt8jVfg",
  // nationality: "NLth2WTyo7M",
  // status: "tASKWHyRolc",
  // agetype: "ck9h7CokxQE",
  // DOB: "tQeFLjYbqzv",
};

function* handleGetTei() {
  yield put(loadTei(true));

  try {
    const teiId = yield call(getTeiId);
    if (teiId) {
      yield call(initExistedDataSaga, teiId);
      yield put(getTeiSuccessMessage(`Get tracked entity instance: ${teiId}`));
    } else {
      const selectedOu = yield select((state) => state.metadata.selectedOrgUnit);
      if (!selectedOu) {
        return yield put(push("/"));
      }
      yield call(initNewDataSaga);
      yield put(getTeiSuccessMessage(`Open add new event`));
    }
  } catch (e) {
    console.error("handleGetTei", e);
    yield put(getTeiError(e.message));
  } finally {
    yield put(loadTei(false));
  }
}

export default function* getTei() {
  yield takeLatest(GET_TEI, handleGetTei);
}

function* initExistedDataSaga() {
  const { offlineStatus } = yield select((state) => state.common);
  const programId = yield select((state) => state.metadata.programMetadata.id);

  const searchString = yield select((state) => state.router.location.search);
  const { tei: teiId, event: eventId } = queryString.parse(searchString);

  let dataList = [];

  // OFFLINE MODE
  if (offlineStatus) {
    // clone new data object
    // dataList = yield call(trackedEntityManager.getTrackedEntityInstanceById, {
    //   trackedEntity: teiId,
    //   program: programId,
    // });
    dataList = yield call(eventManager.getEventById, {
      eventId
    });
  } else {
    // get Family TEI
    if(teiId) dataList = yield call(dataApi.getTrackedEntityInstanceById, teiId, programId);
    else if(eventId) dataList = yield call(dataApi.getEventById, eventId);
  }

  console.log("initExistedDataSaga", { dataList });

  // clone new data object
  const teiData = JSON.parse(JSON.stringify(dataList));

  const { orgUnit } = dataList;

  const selectedOrgUnit = yield call(getSelectedOrgUnitByOuId, orgUnit);


  if (!selectedOrgUnit) {
    throw new Error("Org Unit not found!");
  }

  yield put(setSelectedOrgUnit(selectedOrgUnit));
  yield call(handleInitData, teiData);
  yield call(initCascadeDataFromTEIsEvents, dataList);
  // yield call(initInterviewCascadeDataFromTEIsEvents, memberTEIsEvents, memberTEIs);
  yield put(editingAttributes(false));
}

function* initNewDataSaga() {
  yield call(handleInitNewData);
  yield put(editingAttributes(true));
}
