
import { Button, Card, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import CaptureForm from "../CaptureForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import _ from "lodash";
import { CloseOutlined } from "@ant-design/icons";
import { FORM_ACTION_TYPES } from "../constants";
import { updateCascade } from "@/redux/actions/data/tei/currentCascade";
import { transformEvent } from "@/utils/event";
import { submitEvent } from "@/redux/actions/data";

const MainForm = ({onCloseClick}) => {
    const dispatch = useDispatch();

    const { programMetadata, selectedOrgUnit, programRules } = useSelector((state) => state.metadata);
    const currentCascade = useSelector((state) => state.data.tei.data.currentCascade);
    const currentEvents = useSelector((state) => state.data.tei.data.currentEvents);
    const tei = useSelector(state => state.data.tei.data.currentTei);
    const [data, setData] = useState(currentCascade || {});
    const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

    const [metadata, setMetadata] = useState(_.cloneDeep(convertOriginMetadata({programMetadata})));

  const handleAddNew = (e, newData, continueAdd) => {
    setData(newData);
    
    // submit new event
    const { id: event, ...dataValues } = newData;

    // init new event
    const occurredAt = new Date();

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
    setFormDirty(false);
  };


  const handleEditRow = (e, row, rowIndex) => {
    // Update data
    debugger;
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
    const { id, disabled, key, ...dataValues } = row;

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

    const editRowCallback = (metadata, previousData, data, code, value) => {
       const d2 = {
            hasValue: (value) => (value ? true : false),
            ceil: (value) => (Math.ceil(value)),
            floor: (value) => (Math.floor(value)),
            round: (value) => (Math.round(value)),
            daysBetween: (presentDate, pastDate) => ((pastDate - presentDate) / (1000 * 60 * 60 * 24)),
        }
        programRules.forEach(rule => {
          if(rule.program.id == programMetadata.id) {
            var value;
            var condition = rule.condition;
            if(rule.condition.includes('data')) {
                if(condition.includes('d2:hasValue')) {
                    condition = condition.replace(/^d2:hasValue\(\s*(.*?)\s*\)$/, "$1");
                    // value = d2.hasValue(eval(condition));
                } else value = true;
                
                if(value) {
                    rule.programRuleActions.forEach(action => {
                        if(action.programRuleActionType == "ASSIGN") {
                            if(action.data.includes('d2:hasValue')) {
                                let condition = action.data.replace(/^d2:hasValue\(\s*(.*?)\s*\)$/, "$1");
                                if(d2.hasValue(eval(condition))) data[action.dataElement.id] = eval(condition);

                            } else {
                                if(action.data.includes('data')) data[action.dataElement.id] = eval(action.data);
                                else data[action.dataElement.id] = action.data;
                            }
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
      title={`Program: ${programMetadata.name}`}
      extra={<Button type="text"><CloseOutlined onClick={onCloseClick} /></Button>}
      >
       <CaptureForm 
        data={data}  
        editRowCallback={editRowCallback}
        setData={setData}
        metadata={metadata} 
        setMetadata={setMetadata} 
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
        de.code= de.id;
      });
      return [...acc, ...stage.dataElements];
    }, []);
  }

  return [...trackedEntityAttributes, ...programStagesDataElements];
};


export default MainForm;

