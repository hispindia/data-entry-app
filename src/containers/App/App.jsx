import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import App from "../../components/App/App";
import { metadataApi } from "@/api";
import AppSkeleton from "../../skeletons/App";

/* REDUX */
import withSkeletonLoading from "@/hocs/withSkeletonLoading";
import {
  setOrgUnitLevels,
  setOrgUnits,
  setProgramMetadata,
  setProgramRules,
  setProgramsMetadata,
  setSelectedOrgUnit,
} from "@/redux/actions/metadata";
import { useDispatch, useSelector } from "react-redux";

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

  //ProgramRule configure
  const configureRules = (ruleVariables, rules, optionGroups) => {

    if(!rules || !ruleVariables) return [];
    const modifiedRules = [];
    const modifiedRuleVariables = {};
    const useCodeForOptionSet = {};
    const regex = /(?:#|A|V)\{(.*?)\}/g;
    ruleVariables.forEach(de => { 
      if(de?.dataElement?.id) {
      if(!modifiedRuleVariables[de.program.id]) modifiedRuleVariables[de.program.id] = {};
      if(!useCodeForOptionSet[de.program.id]) useCodeForOptionSet[de.program.id] = [];
      modifiedRuleVariables[de.program.id][de.name] = de.dataElement.id;
      useCodeForOptionSet[de.program.id].push({id:de.dataElement.id,value: de.useCodeForOptionSet});
      }}
    );
    rules.sort((a, b) => (a.priority || 999) - (b.priority || 999)).forEach(rule => {

        var modifiedRule = JSON.parse(JSON.stringify(rule));
        modifiedRule.programRuleActions.forEach(action => {
        action['useCodeForOptionSet'] = [];
        if(action.content)
          action['content'] = action.content.replace(regex, (_, key) => `ruleData[${modifiedRuleVariables[rule.program.id][key] || key}]`)?.replaceAll(/d2:/g, 'd2.');
        if(action.data) {
            action['data'] = action.data.replace(regex, (_, key) => `ruleData['${modifiedRuleVariables[rule.program.id][key] || key}']`)?.replaceAll(/d2:/g, 'd2.');
            if(useCodeForOptionSet[rule.program.id])  {
              const optionList = useCodeForOptionSet[rule.program.id].filter( de => (!de.value && action.data.includes(de.id))).map(de => de.id)
              if(optionList.length) {
                action['useCodeForOptionSet'] = optionList;
              }
            }                                                                                   
        } else if(action.optionGroup) {
          const optionGroup = optionGroups.find(group => group.id == action.optionGroup.id);
          if(optionGroup.id) {
            action.options ={};
            optionGroup.options.forEach(option => {
              action.options[option.code] = option.name;
            }) 
          }
        }
      })
      modifiedRule['condition'] = modifiedRule.condition?.replace(regex, (_, key) => `ruleData['${modifiedRuleVariables[rule.program.id][key] || key}']`)?.replaceAll(/d2:/g, 'd2.');
      modifiedRules.push(modifiedRule);
    })
    return modifiedRules;
  }

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
        dispatch(setProgramMetadata(results[5]));
        dispatch(setProgramRules(configureRules(results[6].programRuleVariables, results[7].programRules, results[8].optionGroups)));
        setLoading(false);
        setLoaded(true);
      });
    })();
  }, []);

  return <AppSkeletonLoading loading={loading} loaded={loaded} mask={true} metadata={metadata} />;
};
export default AppContainer;
