import React, { useMemo } from "react";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import ProgramSelection from "@/components/ControlBar/ProgramSelection";
import { getProgram } from "@/redux/actions/metadata";

const ProgramSelectionContainer = () => {
  const { programsMetadata, selectedOrgUnit } = useSelector((state) => state.metadata);
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  // const isAssignedToOrg = useMemo(() => {
  //   return programMetadata?.organisationUnits?.find((e) => e.id == selectedOrgUnit.id);
  // }, [selectedOrgUnit]);

  // const disabled = location.pathname === "/form" || !isAssignedToOrg;
  const programs = programsMetadata?.programs.map(program => ({label: program.displayName, value: program.id}))
  const onChange = (program) => {
    debugger
    dispatch(getProgram(program))
    // history.push("/list");
  };
  return (
    <ProgramSelection  options={programs} onChange={onChange} disabled={false} />
  );
};

export default withOrgUnitRequired()(ProgramSelectionContainer);
