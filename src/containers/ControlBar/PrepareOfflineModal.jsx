import { Modal, Typography, Progress, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { setOfflineStatus } from "@/redux/actions/common";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import OrgUnitContainer from "./OrgUnit";

import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as programRuleManager from "@/indexDB/ProgramRuleManager/ProgramRuleManager";
import * as programRuleVariable from "@/indexDB/ProgramRuleVariable/ProgramRuleVariable";
import ProgramSelectionContainer from "./ProgramSelectionContainer";

const downloadMapping = [
  { id: "metadata", label: "Download metadata" },
  { id: "event_program", label: "Download Program data" },
];

const PrepareOfflineModal = ({ open, onCancel, onClose }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const {  programMetadata, orgUnits } = useSelector((state) => state.metadata);

  // const userOrgUnits = useMemo(
  //   () => programMetadata?.organisationUnits?.filter(({ path }) => orgUnits.find(({ id }) => path.includes(id))),
  //   [programMetadata],
  // );

  const [selectedOrgUnits, setSelectedOrgUnit] = useState({ selected: [] });
  const [selectedProgram, setSelectedProgram] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({});
  const [ready, setReady] = useState(false);

  const handleSelectOrgUnit = (orgUnit) => {
    // const found = userOrgUnits.find(({ id }) => id === orgUnit.id);
    // if (found) setSelectedOrgUnit(orgUnit);
    const programs = orgUnits.find(ou => ou.id === orgUnit.id)?.programs;
    const sel = {...orgUnit,programs}
    setSelectedOrgUnit(sel);
  };

  const handleSelectedProgram = (program) => {
    setSelectedProgram(program)
  };

  const handleDispatchCurrentOfflineLoading = ({ id, percent }) => {
    setLoadingProgress({ id, percent });
  };

  const handleDownload = async () => {
    setLoading(true);
    const offlineSelectedOrgUnits = selectedOrgUnits.selected.map((path) => ({
      id: path.split("/").pop(),
    }));

    // pull metadata from server and save to indexedDB
    setLoadingProgress({ id: "metadata", percent: 0 });
    await meManager.pull();
    setLoadingProgress({ id: "metadata", percent: 15 });
    await organisationUnitLevelsManager.pull();
    setLoadingProgress({ id: "metadata", percent: 30 });
    await organisationUnitManager.pull();
    setLoadingProgress({ id: "metadata", percent: 45 });
    await programManager.pull(selectedProgram, true);
    setLoadingProgress({ id: "metadata", percent: 60 });
    await programRuleManager.pull();
    setLoadingProgress({ id: "metadata", percent: 75 });
    await programRuleVariable.pull();
    setLoadingProgress({ id: "metadata", percent: 100 });
    // pull data from server and save to indexedDB
    // await trackedEntityManager.pullNested({ handleDispatchCurrentOfflineLoading, offlineSelectedOrgUnits });

    const args = { handleDispatchCurrentOfflineLoading, offlineSelectedOrgUnits, selectedProgram };
    // await trackedEntityManager.pull(args);
    // await enrollmentManager.pull(args);
    await eventManager.getEventsRawData(args);
    setLoading(false);
    setReady(true);
  };

  return (
    <Modal
      title={t("preparingForOfflineMode")}
      open={open}
      // centered
      closeIcon={null}
      maskClosable={false}
      okText={t("OK")}
      onCancel={onCancel}
      onOk={() => {
        dispatch(setOfflineStatus(true));
        window.location.reload();
      }}
      okButtonProps={{ disabled: !ready }}
      width={700}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <OrgUnitContainer limit={3} singleSelection={false} onChange={handleSelectOrgUnit} value={selectedOrgUnits} />
        <ProgramSelectionContainer onChange={handleSelectedProgram} value={selectedProgram} orgUnit={selectedOrgUnits} />
        <Button
          type="primary"
          disabled={!selectedOrgUnits.selected.length  || !selectedProgram || loading || ready}
          onClick={handleDownload}
        >
          {t("download")}
        </Button>
      </div>
      <Typography className="mt-2" style={{ color: "#0277bd", fontWeight: "bold" }}>
        {t("downloadOfflineHelper")}
      </Typography>
      <div style={{ marginTop: 8, marginBottom: 24 }}>
        {(loading || ready) &&
          downloadMapping.map(({ label }, step) => {
            const currentStep = downloadMapping.findIndex(({ id }) => id === loadingProgress.id);

            let percent = 0;
            if (currentStep > -1) {
              if (currentStep > step) percent = 100;
              if (currentStep === step) percent = loadingProgress.percent;
            }

            return (
              <div key={label}>
                <Typography>{label}</Typography>
                <Progress percent={percent} format={() => `${percent.toFixed(0)}%`} />
              </div>
            );
          })}
      </div>
    </Modal>
  );
};

export default PrepareOfflineModal;
