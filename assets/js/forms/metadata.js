import { PROGRAM_RULE_TYPES } from "../constant.js";

export const convert = {
    attributes: ({program, disabled = false}) => {
        var attributes = [];
        var sections = [];
        var values = {};
        var mandatory = {};
        var mandatoryList = [];
        var displayInList = {};
        var metadata = {};

        //Mandatory
        if(program.programTrackedEntityAttributes){
            program.programTrackedEntityAttributes.forEach(element => {
                if(element.mandatory) mandatoryList.push(element.trackedEntityAttribute.id);
                mandatory[element.trackedEntityAttribute.id] = element.mandatory;
                displayInList[element.trackedEntityAttribute.id] = element.displayInList;
                attributes.push(element.trackedEntityAttribute.id);
            });
        }

        //Convert metadata for programRules
        program.programSections.forEach(section => {
            section.trackedEntityAttributes.forEach(attr => {
                values[attr.id] = '';
                attr['code'] = attr.id;
                attr['name'] = attr.name;
                attr['hidden'] = false;
                attr['disabled'] = disabled;
                attr['mandatory'] = mandatory[attr.id];
                attr['displayInList'] = displayInList[attr.id];
                if(attr.optionSetValue) {
                attr.optionSet.options = attr.optionSet.options.map(option => ({
                    label: option.name,
                    value: option.code,
                }))
                attr['valueSet'] = [...attr.optionSet.options];
                }
                metadata[attr.id] = attr;
            })
            sections.push({
                name: section.name,
                items: section.trackedEntityAttributes
            })
        })

        return {
            name: program.name,
            attributes,
            sections,
            values,
            mandatoryList,
            metadata,
        }
    },
    stage: ({programStage, disabled=false}) => {
        var sections = [];
        var dataElements = [];
        var values = {};
        var mandatory = {};
        var mandatoryList = [];
        var metadata = {};
        var fileType = [];

        //Mandatory
        if(programStage.programStageDataElements){
            programStage.programStageDataElements.forEach(element => {
                if(element.compulsory) mandatoryList.push(element.dataElement.id);
                mandatory[element.dataElement.id] = element.compulsory;
                dataElements.push(element.dataElement.id);
            })
        }

        //Convert metadata for programRules
        programStage.programStageSections.forEach(section => {
            section.dataElements.forEach(element => {
                values[element.id] = '';
                element['code'] = element.id;
                element['name'] = element.formName;
                element['hidden'] = false;
                element['disabled'] = disabled;
                element['mandatory'] = mandatory[element.id];
                if(element.valueType == 'FILE_RESOURCE') fileType.push(element.id);
                if(element.optionSetValue) {
                element.optionSet.options = element.optionSet.options.map(option => ({
                    label: option.name,
                    value: option.code,
                }))
                element['valueSet'] = [...element.optionSet.options];
                }
                metadata[element.id] = element;
            })
            sections.push({
                id: section.id,
                name: section.name,
                items: section.dataElements
            })
        })

        return {
            dataElements,
            sections,
            values,
            mandatoryList,
            metadata,
            fileType,
        }
    },
}

//ProgramRule configure
export const configureRules = (ruleVariables, rules, optionGroups) => {

    if(!rules || !ruleVariables) return [];
    const modifiedRules = [];
    const modifiedRuleVariables = {};
    const useCodeForOptionSet = {};
    const regex = /(?:#|A|V)\{(.*?)\}/g;
    ruleVariables.forEach(de => { 
      var id = "";
      if(de?.dataElement?.id) id = de.dataElement.id;
      if(de?.trackedEntityAttribute?.id) id = de.trackedEntityAttribute.id;
      if(!modifiedRuleVariables[de.program.id]) modifiedRuleVariables[de.program.id] = {};
      if(!useCodeForOptionSet[de.program.id]) useCodeForOptionSet[de.program.id] = [];
      modifiedRuleVariables[de.program.id][de.name] = id;
      modifiedRuleVariables[de.program.id][de.name] = id;
      useCodeForOptionSet[de.program.id].push({id:id, value: de.useCodeForOptionSet});
    }
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
      modifiedRule['condition'] = modifiedRule.condition?.replace(regex, (_, key) => `ruleData['${modifiedRuleVariables[rule.program.id][key] || key}']`).replace(/\(\s*['"]([^'"]+)['"]\s*\)/g,(_, key) => `(ruleData['${modifiedRuleVariables[rule.program.id][key] || key}'])`)?.replaceAll(/d2:/g, 'd2.');
      modifiedRules.push(modifiedRule);
    })
    return modifiedRules;
  }


export const ruleCallback = (programRules, programMetadata, mandatoryList, metadata, data) => {
      //Save on registration date

      for(let data in metadata) {
        metadata[data].hidden = false;
        metadata[data].mandatory = false;
        metadata[data].error = '';
        metadata[data].warning = '';
        if(metadata[data].optionSet) {
          metadata[data].valueSet = metadata[data].optionSet.options;
        }
      }
      mandatoryList.forEach(data => metadata[data].mandatory = true)
      //From Program rules
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
          length: (value) => value.length,
        }
        
        programRules.forEach(rule => {
            try {
              if(rule.condition.includes('ruleData')) {
                const regex = /ruleData\s*\[\s*['"]([^'"]+)['"]\s*\]/g;
                const ids = [...rule.condition.matchAll(regex)].map(m => m[1]);
                const ruleData = {...data}
                ids.map(id => {
                  if(!ruleData[id]) ruleData[id] = "";
                  else if(ruleData[id] == 'true' || ruleData[id] == 'false') ruleData[id] = JSON.parse(ruleData[id])
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
                        data[action.dataElement.id] = `${eval(action.data)}`;
                      break;
                      case PROGRAM_RULE_TYPES.HIDEFIELD:
                        if(!eval(rule.condition)) data[action.dataElement.id] = '';
                        metadata[action.dataElement.id].hidden = eval(rule.condition);
                      break;
                      case PROGRAM_RULE_TYPES.HIDESECTION: 
                        const dataElements = programMetadata.find(sec => sec.id === action.programStageSection.id)?.items || [];
                        if(dataElements.length) {
                          dataElements.forEach(element => {
                            if(data[element.id]) data[element.id] = '';
                            metadata[element.id].hidden = true;
                          })
                        }
                      break;
                      case PROGRAM_RULE_TYPES.SHOWERROR: 
                        metadata[action.dataElement.id].error = action.content;
                      break;
                      case PROGRAM_RULE_TYPES.HIDEOPTIONGROUP:
                        if(metadata[action.trackedEntityAttribute.id]) {
                          const valueSets = metadata[action.trackedEntityAttribute.id].valueSet.filter(option => !action.options[option.value]);
                          metadata[action.trackedEntityAttribute.id].valueSet = valueSets;
                        }
                        else if(metadata[action.dataElement.id]) {
                          const valueSets = metadata[action.dataElement.id].valueSet.filter(option => !action.options[option.value]);
                          metadata[action.dataElement.id].valueSet = valueSets;
                        }
                      break;
                      case PROGRAM_RULE_TYPES.SETMANDATORYFIELD:
                        metadata[action.dataElement.id].mandatory = true;
                      break;
                      case PROGRAM_RULE_TYPES.SHOWWARNING:
                        metadata[action.dataElement.id].warning = action.content;
                      break;
                    }
                  })
                }
              }
          }
          catch(err) {
            console.log('rule error', err)
          }
        })
      
    } ;



export function fetchValueType({id, valueType, valueSet}, value, href, disabled) {

    switch(valueType){

    case "TEXT":
         if (valueSet) {
            return `
                <select id="${id}" class="form-control" ${disabled ? 'disabled' : ''} />
                    ${populateOptions(valueSet, value)}
                </select>
            `;
        }
        return `<input id="${id}" type="text" class="form-control" value="${value}" ${disabled ? 'disabled' : ''}/>`;
    
    case "EMAIL":
        return `<input id="${id}" type="email" class="form-control" value="${value}" ${disabled ? 'disabled' : ''}/>`;

    case "DATE":
        return `<input id="${id}" type="date" class="form-control" value="${value}" ${disabled ? 'disabled' : ''}/>`;

    case "NUMBER":
        return `<input id="${id}" type="number" class="form-control" value="${value}" ${disabled ? 'disabled' : ''}/>`;
    
    case "PHONE_NUMBER":
        return `<input id="${id}" type="number" class="form-control" value="${value}" ${disabled ? 'disabled' : ''}/>`;        

    case "FILE_RESOURCE":
      return `<div>
        <input type="file"  ${disabled ? 'disabled' : ''} id="${id}" name="${id}" class="file-upload" hidden accept=".pdf,.doc,image/jpeg,.jpg,.jpeg">
          <label onclick="document.getElementById('${id}').click();"
                style="background-color: #000000;  
                background-color: #000000;
                color: #ffffff;
                padding: 8px 14px;
                border-radius: 4px;
                cursor: pointer;
                display: inline-block;">Upload document</label>
                <a id="${id}-link" href="${href}" style="margin-left:10px; color:#3b71ca; text-decoration:underline;">${value?.name || ""}</a>
              </div>`;

    case "BOOLEAN":
        return `
        <select id="${id}" class="form-control" ${disabled ? 'disabled' : ''}>
            <option ${(value==""? 'selected' : '')} value="">Select</option>
            <option ${(value=="true"? 'selected' : '')} value="true" >Yes</option>
            <option ${(value=="false"? 'selected' : '')} value="false">No</option>
        </select>
        `;
        
    default:
        return `<input id="${id}" type="text" class="form-control"/>`;

    }
}

export function populateOptions(options, value) {
    var optionSet = `<option ${(value=="" ? 'selected' : '')} value="">Select</option>`;
    if (options && Array.isArray(options)) {
        options.forEach(opt => {
            optionSet += `<option ${(value == opt.value ? 'selected' : '')} value="${opt.value}">${opt.label}</option>`;
        })
    }
    return optionSet;
}


