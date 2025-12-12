import { populateOptions } from "../../api/func.js";

export function fetchValueType(valueType, optionSetValue, optionSet, id) {

    switch(valueType){

    case "TEXT":
         if (optionSetValue && optionSet?.length > 0) {
            return `
                <select id="${id}" class="form-control">
                    ${populateOptions(optionSet)}
                </select>
            `;
        }
        return `<input id="${id}" type="text" class="form-control"/>`;
    
    case "EMAIL":
        return `<input id="${id}" type="email" class="form-control"/>`;

    case "DATE":
        return `<input id="${id}" type="date" class="form-control"/>`;

    case "NUMBER":
        return `<input id="${id}" type="number" class="form-control"/>`;
    
    case "PHONE_NUMBER":
        return `<input id="${id}" type="number" class="form-control"/>`;        

    case "BOOLEAN":
        return `
        <select id="${id}" class="form-control">
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
        </select>
        `;
        
    default:
        return `<input id="${id}" type="text" class="form-control"/>`;

    }
}