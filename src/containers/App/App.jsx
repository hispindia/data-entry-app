import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import App from "../../components/App/App";
import { metadataApi } from "@/api";
import AppSkeleton from "../../skeletons/App";

/* REDUX */
import withSkeletonLoading from "@/hocs/withSkeletonLoading";
import {
  getProgram,
  setOrgUnitLevels,
  setOrgUnits,
  setProgramMetadata,
  setProgramRules,
  setProgramsMetadata,
  setSelectedOrgUnit,
} from "@/redux/actions/metadata";
import { useDispatch, useSelector } from "react-redux";

import { setReportId } from "@/redux/actions/common";
import { setMe } from "@/redux/actions/me";
import { getMetadataSet } from "@/utils/offline";

const AppSkeletonLoading = withSkeletonLoading(AppSkeleton)(App);

const AppContainer = () => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const metadata = useSelector((state) => state.metadata);
  const isOfflineMode = useSelector((state) => state.common.offlineStatus);

  const findAttribute = (attributes, attributeId) => {
    const found = attributes.find((attr) => attr.attribute.id === attributeId);
    if (found) {
      return found.value;
    } else {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      const me = await metadataApi.getMe();
      const currentLocale = me.settings.keyDbLocale;
      i18n.changeLanguage(currentLocale);

      Promise.all(getMetadataSet(isOfflineMode)).then(async (results) => {
        dispatch(setMe(results[1]));
        dispatch(setOrgUnitLevels(results[2].organisationUnitLevels));
        const savedSelectedOrgUnit = sessionStorage.getItem("selectedOrgUnit");

        if (savedSelectedOrgUnit) {
          let orgUnitJsonData = null;
          try {
            orgUnitJsonData = JSON.parse(savedSelectedOrgUnit);
          } catch (e) {
            console.log(e);
          }

          dispatch(setSelectedOrgUnit(orgUnitJsonData));
          // history.push("/list");
        }

        dispatch(setOrgUnits(results[3].organisationUnits));
        dispatch(setProgramsMetadata(results[4]));
        if(results[6]?.programRules && results[7]?.programRuleVariables) {
          var rules = [];
          const ruleVariables = {};
          results[7]?.programRuleVariables.forEach(de => {
                if(de?.dataElement?.id) ruleVariables[de.name] = de.dataElement.id;
          });
          results[6].programRules.forEach(rule => {
                  var modifiedRule = JSON.parse(JSON.stringify(rule));
                  modifiedRule.programRuleActions.forEach(action => {
                    if(action.content)
                    action['content'] = action.content.replace(/#\{(.*?)\}/g, (_, key) => `${ruleVariables[key] || key}`);
                    if(action.data) action['data'] = modifiedRule.condition.replace(/(?:#|A)\{(.*?)\}/g, (_, key) => `data['${ruleVariables[key] || key}']`);
                })
              modifiedRule['condition'] = modifiedRule.condition.replace(/(?:#|A)\{(.*?)\}/g, (_, key) => `data['${ruleVariables[key] || key}']`);
              rules.push(modifiedRule);
            
          })
          dispatch(setProgramRules(rules));
        }
        dispatch(setProgramMetadata(results[5]));
        setLoading(false);
        setLoaded(true);
      });
    })();
  }, []);

  return <AppSkeletonLoading loading={loading} loaded={loaded} mask={true} metadata={metadata} />;
};
export default AppContainer;
