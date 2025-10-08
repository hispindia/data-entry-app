import React, { useMemo } from "react";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import AddNewFamilyButton from "../../components/ControlBar/AddNewFamilyButton";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { makeStyles } from "@material-ui/core/styles";

const ProgramSelectionContainer = () => {
  const { programMetadata, selectedOrgUnit } = useSelector((state) => state.metadata);
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
debugger;
  const isAssignedToOrg = useMemo(() => {
    return programMetadata?.organisationUnits?.find((e) => e.id == selectedOrgUnit.id);
  }, [selectedOrgUnit]);

  const disabled = location.pathname === "/form" || !isAssignedToOrg;
  const onClick = (program) => {
    
    history.push("/list");
  };
  return (
    <ProgramSelection isAssignedToOrg={isAssignedToOrg} onClick={onClick} disabled={disabled} />
  );
};

export default withOrgUnitRequired()(ProgramSelectionContainer);
