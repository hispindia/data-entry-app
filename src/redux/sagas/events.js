import { put, select, takeLatest, call, all } from "redux-saga/effects";
import { GET_EVENTS, GET_TEIS, TABLE_CHANGE_PAGE, TABLE_FILTER, TABLE_SORT } from "../types/teis";
import { dataApi } from "../../api";
import {
  changePager,
  filter,
  getTeisErrorMessage,
  getTeisSucceed,
  getTeisSuccessMessage,
  loadTeis,
  sort,
} from "../actions/teis";
import { returnFilterString } from "../../utils";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import { DATA_COLLECT_ATTRIBUTE_ID } from "@/constants/app-config";

function* getEvents(newPayload = {}) {
  const { offlineStatus } = yield select((state) => state.common);
  const me = yield select((state) => state.me);

  const { pager, filters, orderString } = yield select((state) => state.teis);
  yield put(loadTeis(true));
  yield put(getTeisSuccessMessage(null));
  yield put(getTeisErrorMessage(null));
  try {
    const currentPayload = {
      page: pager.page,
      pageSize: pager.pageSize,
      filters,
      orderString,
    };
    const nextPayload = Object.assign(currentPayload, newPayload);
    const selectedOrgUnit = yield select((state) => state.metadata.selectedOrgUnit);
    const programMetadata = yield select((state) => state.metadata.programMetadata);
    let instanceList = {};

    // OFFLINE MODE
    if (offlineStatus) {
      instanceList = yield call(eventManager.find, {
        orgUnit: selectedOrgUnit.id,
        program: programMetadata.id,
        pageSize: nextPayload.pageSize,
        page: nextPayload.page,
      });
    } else {
      instanceList = yield call(
        dataApi.getEvents,
        selectedOrgUnit.id,
        programMetadata.id,
        nextPayload.page,
        nextPayload.pageSize,
      );
    }
    var { events, ...pagelist } = instanceList;
    if(events.length) {
      events = events.map(event => ({
        eventId: event.event, 
        updatedAt: event.updatedAt,
        values: event.dataValues.map(dv => ({ id: dv.dataElement, value: dv.value }))
      }))
    }

    yield put(getTeisSucceed({ ...pagelist, trackedEntities:events }));
    yield all([
      put(filter(nextPayload.filters)),
      put(sort(nextPayload.orderString)),
      put(
        changePager({
          page: instanceList.page,
          pageSize: instanceList.pageSize,
          total: instanceList.total,
          pageCount: instanceList.pageCount,
        })
      ),
    ]);
    yield put(getTeisSuccessMessage("Get tracked entity instances successfully"));
  } catch (e) {
    const result = yield e.json();

    if (result.message) {
      yield put(getTeisErrorMessage(result.message));
    } else {
      yield put(getTeisErrorMessage(e.message));
    }
  } finally {
    yield put(loadTeis(false));
  }
}

export default function* getEventsSaga() {
  yield takeLatest(GET_EVENTS, getEvents);
  yield takeLatest(TABLE_FILTER, handleTableFilter);
  yield takeLatest(TABLE_SORT, handleTableSort);
  yield takeLatest(TABLE_CHANGE_PAGE, handleChangePage);
}

function* handleTableFilter({ value, teiId }) {
  try {
    const oldFilter = yield select((state) => state.teis.filters);
    let newFilters = [...oldFilter];
    if (value) {
      let find = newFilters.findIndex((e) => e.teiId === teiId);
      if (find >= 0) {
        newFilters[find].value = value;
      } else {
        newFilters.push({
          value,
          teiId,
        });
      }
    } else {
      let find = newFilters.findIndex((e) => e.teiId === teiId);
      newFilters.splice(find, 1);
    }
    yield call(getEvents, {
      page: 1,
      filters: newFilters,
    });
  } catch (e) {
    console.error(e);
    yield put(getTeisErrorMessage("Filter error!!!"));
  }
}

function* handleTableSort({ tableFilterData }) {
  try {
    if (tableFilterData) {
      let newOrderString = "";
      if (tableFilterData.order === "descend") {
        newOrderString = `order=${tableFilterData.columnKey}:desc`;
      } else {
        if (tableFilterData.order === "ascend") {
          newOrderString = `order=${tableFilterData.columnKey}:asc`;
        } else {
          newOrderString = `order=lastupdated:desc`;
        }
      }
      yield call(getEvents, {
        page: 1,
        orderString: newOrderString,
      });
    }
  } catch (e) {
    console.error(e);
    yield put(getTeisErrorMessage("Sort error!!!"));
  }
}

function* handleChangePage({ page: newPage, pageSize: newPageSize }) {
  try {
    yield call(getEvents, {
      page: newPage,
      pageSize: newPageSize,
    });
  } catch (e) {
    console.error(e);
    yield put(getTeisErrorMessage("Change page error!!!"));
  }
}
