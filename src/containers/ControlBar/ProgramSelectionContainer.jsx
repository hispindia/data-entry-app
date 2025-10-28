import React, { useMemo } from "react";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import ProgramSelection from "@/components/ControlBar/ProgramSelection";
import { getProgram } from "@/redux/actions/metadata";

const ProgramSelectionContainer = ({onChange, value}) => {
  const dispatch = useDispatch();
  const { programsMetadata, programMetadata} = useSelector((state) => state.metadata);
  const programId = value ?? programMetadata?.id;
  // const disabled = location.pathname === "/form" || !isAssignedToOrg;
  const programs = programsMetadata.map(program => ({label: program.displayName, value: program.id}))
  const handleProgram = (program) => {
    sessionStorage.setItem("program", program);
    dispatch(getProgram(program))
  };
  return (
    <ProgramSelection  options={programs} onChange={onChange || handleProgram} value={programId} disabled={false} />
  );
};

export default withOrgUnitRequired()(ProgramSelectionContainer);
