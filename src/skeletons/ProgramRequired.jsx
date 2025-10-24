import React, { useMemo } from "react";
import withError from "../hocs/withFeedback/withError";
import { useTranslation } from "react-i18next";

const ProgramRequired = () => {
  const Component = useMemo(() => withError()(() => null), []);
  const { t } = useTranslation();
  return <Component disableAlert errorMessage={t("programRequired")} errorDisplaying={t("programRequired")} />;
};

export default ProgramRequired;
