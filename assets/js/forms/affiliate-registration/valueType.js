import { populateOptions } from "../../api/func.js";

export function fetchValueType({valueType, optionSetValue, optionSet, id, value="", disabled = false}) {

    switch(valueType){

    case "TEXT":
         if (optionSetValue && optionSet?.length > 0) {
            return `
                <select id="${id}" class="form-control" ${disabled ? 'disabled' : ''} />
                    ${populateOptions(optionSet, value)}
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
            <input type="file" id="${id}" name="${id}" class="form-control show-for-sr"  value="${value}" ${disabled ? 'disabled' : ''}/>
            <a id="${id}-download" style="display: none;" target="_blank"></a>
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