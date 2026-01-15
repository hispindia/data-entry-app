import React, { useEffect, useState } from "react";
/* REDUX */
import { useDispatch, useSelector } from "react-redux";
/*       */
/* Components */
import RegisteredTeiList from "../../components/RegisteredTeiList";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import withProgramRequired from "../../hocs/withProgramRequired";
import TeiListSkeleton from "../../skeletons/TeiList";
import { useHistory } from "react-router-dom";
import OrgUnitRequired from "../../skeletons/OrgUnitRequired";
import ProgramRequired from "../../skeletons/ProgramRequired";
import { deleteTei } from "../../redux/actions/data/tei";
import { compose } from "redux";
import withFeedback from "../../hocs/withFeedback";
import {
  getEvents,
  getTeis,
  getTeisErrorMessage,
  getTeisSuccessMessage,
  tableChangePage,
  tableFilter,
  tableSort,
} from "../../redux/actions/teis";

const LoadingRegisteredTeiList = compose(withFeedback(), withSkeletonLoading(TeiListSkeleton))(RegisteredTeiList);

const RegisteredTeiListContainer = () => {
  const dispatch = useDispatch();
  const onDeleteTei = (record) => dispatch(deleteTei(record.eventId));
  const { programMetadata, selectedOrgUnit } = useSelector((state) => state.metadata);
  const trackedEntityAttributes = useSelector((state) => state.metadata.programMetadata.trackedEntityAttributes);
  const stageElements = useSelector(state => state.metadata.programMetadata.programStages);
  const {
    teis,
    loading,
    success,
    error,
    pager: { page, pageSize, total },
  } = useSelector((state) => state.teis);
  const [header, setHeader] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if(programMetadata && selectedOrgUnit) {
      if(programMetadata.programType=="WITH_REGISTRATION") {
        setHeader(trackedEntityAttributes);
        dispatch(getTeis());
      } else if(programMetadata.programType=="WITHOUT_REGISTRATION") {
        setHeader(stageElements[0].dataElements);
        dispatch(getEvents())
      }
    }
    return () => {
      dispatch(getTeisSuccessMessage(null));
      dispatch(getTeisErrorMessage(null));
    };
  }, [selectedOrgUnit, programMetadata]);

  const onSort = (sorter) => {
    dispatch(tableSort(sorter));
  };

  const onChangePage = (page, pageSize) => {
    dispatch(tableChangePage(page, pageSize));
  };

  const onRowClick = (record) => {
    var param = '';
    if(record.teiId) param = `tei=${record.teiId}`;
    else if(record.eventId) param = `event=${record.eventId}`;
    history.push({
      pathname: "/form",
      search: `?${param}`,
    });
  };

  const onFilter = (value, teiId) => {
    dispatch(tableFilter(value, teiId));
  };
  
  return (
    <LoadingRegisteredTeiList
      errorMessage={error}
      successMessage={success}
      mask
      loading={loading}
      loaded={!!teis}
      teis={teis}
      page={page}
      pageSize={pageSize}
      total={total}
      trackedEntityAttributes={header}
      onDeleteTei={onDeleteTei}
      onSort={onSort}
      onChangePage={onChangePage}
      onRowClick={onRowClick}
      onFilter={onFilter}
    />
  );
};

export default compose(
  withOrgUnitRequired(OrgUnitRequired),
  withProgramRequired(ProgramRequired)
)(RegisteredTeiListContainer);
