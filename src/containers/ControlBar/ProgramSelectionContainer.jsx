import React, { useEffect, useMemo, useState } from "react";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import ProgramSelection from "@/components/ControlBar/ProgramSelection";
import { getProgram } from "@/redux/actions/metadata";

const ProgramSelectionContainer = ({onChange, value, orgUnit}) => {
  const dispatch = useDispatch();
  const { programsMetadata, programMetadata, selectedOrgUnit} = useSelector((state) => state.metadata);
  const programId = value ?? programMetadata?.id;
  const [programs ,setPrograms] = useState([]);

  useEffect(() => {
    const ou = orgUnit || selectedOrgUnit
    var programs = programsMetadata.filter(program => ou?.programs?.some(p => program.id == p.id))
    .map(program => ({label: program.displayName, value: program.id}));
    setPrograms(programs);
  }, [programMetadata, selectedOrgUnit, orgUnit])
  // const disabled = location.pathname === "/form" || !isAssignedToOrg;
  debugger;
  const handleProgram = (program) => {
    sessionStorage.setItem("program", program);
    dispatch(getProgram(program))
  };
  return (
    <ProgramSelection  options={programs} onChange={onChange || handleProgram} value={programId} disabled={false} />
  );
};

export default withOrgUnitRequired()(ProgramSelectionContainer);
