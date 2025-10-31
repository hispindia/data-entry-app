import React, { useEffect, useMemo, useState } from "react";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import ProgramSelection from "@/components/ControlBar/ProgramSelection";
import { getProgram } from "@/redux/actions/metadata";

const ProgramSelectionContainer = ({selectedOrgUnit, program, onChange}) => {
  const dispatch = useDispatch();
  const { programsMetadata } = useSelector((state) => state.metadata);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    var programs = programsMetadata.filter(program => selectedOrgUnit?.programs?.some(p => program.id == p.id))
    .map(program => ({label: program.displayName, value: program.id}));
    setPrograms(programs);
  }, [programsMetadata, selectedOrgUnit])
  
  const handleProgram = (program) => {
    sessionStorage.setItem("program", program);
    dispatch(getProgram(program))
  };

  if(!selectedOrgUnit) return;
  return (
    <ProgramSelection  options={programs} onChange={onChange || handleProgram} value={program?.id} disabled={false} />
  );
};

export default ProgramSelectionContainer;
