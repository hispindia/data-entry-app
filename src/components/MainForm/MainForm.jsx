
import { Button, Card, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import CaptureForm from "../CaptureForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import _, { cond } from "lodash";
import { CloseOutlined } from "@ant-design/icons";
import { FORM_ACTION_TYPES, PROGRAM_RULE_TYPES } from "../constants";
import { updateCascade } from "@/redux/actions/data/tei/currentCascade";
import { transformEvent } from "@/utils/event";
import { submitEvent } from "@/redux/actions/data";
import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears, format } from "date-fns";

const MainForm = ({onCloseClick}) => {
    const dispatch = useDispatch();

    const { programMetadata, selectedOrgUnit, programRules } = useSelector((state) => state.metadata);
    const currentCascade = useSelector((state) => state.data.tei.data.currentCascade);
    const currentEvents = useSelector((state) => state.data.tei.data.currentEvents);
    const tei = useSelector(state => state.data.tei.data.currentTei);
    const [data, setData] = useState(currentCascade || {});
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

    const [metadata, setMetadata] = useState(_.cloneDeep(convertOriginMetadata({programMetadata})));

  const handleAddNew = (e, newData, continueAdd) => {
    setData(newData);
    
    // submit new event
    const { id: event, event_date: occurredAt, ...dataValues } = newData;


    // const eventPayload = transformEvent({
    //   event,
    //   enrollment,
    //   occurredAt,
    //   status: "ACTIVE",
    //   programStage: HOUSEHOLD_INTERVIEW_RESULT_PROGRAM_STAGE_ID,
    //   trackedEntity,
    //   orgUnit: selectedOrgUnit.id,
    //   program: programMetadata.id,
    //   dataValues,
    //   _isDirty: true,
    // });

    const eventPayload = transformEvent({
      event,
      occurredAt,
      status: "ACTIVE",
      orgUnit: selectedOrgUnit.id,
      program: programMetadata.id,
      dataValues,
      _isDirty: true,
    });

    // dispatch(submitAttributes({ ...attributes, [HH_STATUS_ATTR_ID]: hhStatus }));
    dispatch(submitEvent(eventPayload));
  };


  const handleEditRow = (e, row, rowIndex) => {
    // Update data
    let newData = _.clone(data);
    newData[rowIndex] = { ...row };

    setData(newData);

    // callbackFunction && callbackFunction(metadata, newData, rowIndex, "edit");

    // let updatedMetadata = updateMetadata(metadata, newData);
    // console.log("handleEditRow", { updatedMetadata, newData });

    // setMetadata([...updatedMetadata]);
    setFormStatus(FORM_ACTION_TYPES.NONE);
    // setSelectedRowIndex(null);

    // save event
    const currentEvent = currentEvents.find((e) => e.event === row.id);
    const { id, disabled, key, event_date: occurredAt, ...dataValues } = row;

    // const occurredAt = currentEvent.occurredAt;
    const eventPayload = transformEvent({
      ...currentEvent,
      _isDirty: true,
      // occurredAt,
      // dueDate: occurredAt,
      dataValues,
    });

    dispatch(submitEvent(eventPayload));
  };

    const editRowCallback = (metadata, previousData, data, code, value, label) => {
      //Save on registration date
      if(data.event_date) setSaveDisabled(false);

      for(let data in metadata) metadata[data].hidden = false;
      //Dyanimcally used inside eval
       window.d2 = {
            hasValue: (value) => (value ? true : false),
            ceil: (value) => (Math.ceil(value)),
            floor: (value) => (Math.floor(value)),
            round: (value) => (Math.round(value)),
            daysBetween: (curr, eventDate) => differenceInDays(new Date(eventDate), new Date(curr)),
            yearsBetween: (curr, eventDate) => differenceInYears(new Date(eventDate), new Date(curr)),
            monthsBetween: (curr, eventDate) => differenceInMonths(new Date(eventDate), new Date(curr)),
            weeksBetween: (curr, eventDate) => differenceInWeeks(new Date(eventDate), new Date(curr)),
            concatenate: (...args) => args.join(''),
        }
        programRules.forEach(rule => {
          if(rule.program.id == programMetadata.id) {
            if(rule.condition.includes('ruleData')) {
              const regex = /ruleData\s*\[\s*['"]([^'"]+)['"]\s*\]/g;
              const ids = [...rule.condition.matchAll(regex)].map(m => m[1]);
              const ruleData = {...data}
              ids.map(id => {
                if(!ruleData[id]) ruleData[id] = "";
              })
              if(eval(rule.condition)) {
                rule.programRuleActions.forEach(action => {
                  const dataElements = action.useCodeForOptionSet.filter(de => action.data.includes(de));
                  if(dataElements.length) {
                    dataElements.forEach(de => {
                      if(ruleData[de]) {
                        const value = metadata[de].valueSet.find(option => option.value == ruleData[de]);
                        ruleData[de] = value.label;
                      }
                    })
                  }  
                  switch(action.programRuleActionType) {
                    case PROGRAM_RULE_TYPES.ASSIGN:
                      data[action.dataElement.id] = eval(action.data);
                    break;
                    case PROGRAM_RULE_TYPES.HIDEFIELD:
                      if(!eval(rule.condition)) data[action.dataElement.id] = '';
                      metadata[action.dataElement.id].hidden = eval(rule.condition);
                    break;
                    case PROGRAM_RULE_TYPES.HIDESECTION: 
                      const dataElements = programMetadata.programStages
                                      .flatMap(stage => stage.programStageSections || [])
                                      .find(sec => sec.id === action.programStageSection.id)?.dataElements || [];
                      if(dataElements.length) {
                        dataElements.forEach(element => {
                          if(data[element.id]) data[element.id] = '';
                          metadata[element.id].hidden = true;
                        })
                      }
                    break;
                  }
                })
              }
            }
          }
        })
      
    } ;

    useEffect(() => {
      if(tei.isNew) {
        setFormStatus(FORM_ACTION_TYPES.ADD_NEW)
      } 
      else if(tei.isNew === false) {
        setFormStatus(FORM_ACTION_TYPES.EDIT)
      }
    }, [tei])

  return (
    <Card size="small" 
      style={{ borderRadius: 0, borderTop: 0 }} 
      title={`Program: ${programMetadata.displayName}`}
      extra={<Button type="text"><CloseOutlined onClick={onCloseClick} /></Button>}
      >
       <CaptureForm 
        data={data}  
        editRowCallback={editRowCallback}
        setData={setData}
        metadata={metadata} 
        setMetadata={setMetadata} 
        saveDisabled={saveDisabled}
        onCancel={onCloseClick}
        formStatus={formStatus} 
        handleAddNewRow={handleAddNew}
        handleEditRow={handleEditRow} />
    </Card>
  );
};

const convertOriginMetadata = ({
  programMetadata,
  eventIncluded = true,
}) => {
  let trackedEntityAttributes = programMetadata.trackedEntityAttributes.map((attr) => {
    return {
      ...attr,
      code: attr.id,
    };
  });

  let programStagesDataElements = [];
  if (eventIncluded) {
    programStagesDataElements = programMetadata.programStages.reduce((acc, stage) => {
      stage.dataElements.forEach((de) => {
        de.code = de.id;
        de.hidden = false;
      });
      return [...acc, ...stage.dataElements];
    }, []);
  }

  return [...trackedEntityAttributes, ...programStagesDataElements];
};


export default MainForm;

