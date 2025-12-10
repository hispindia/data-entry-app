import { populateOptions } from "../../api/func.js";

export function fetchValueType(valueType, optionSetValue, optionSet) {

    switch(valueType){

    case "TEXT":
         if (optionSetValue && optionSet?.length > 0) {
            return `
                <select class="form-control">
                    ${populateOptions(optionSet)}
                </select>
            `;
        }
        return `<input type="text" class="form-control"/>`;
    
    case "EMAIL":
        return `<input type="email" class="form-control"/>`;

    case "DATE":
        return `<input type="date" class="form-control"/>`;

    case "NUMBER":
        return `<input type="number" class="form-control"/>`;
    
    case "PHONE_NUMBER":
        return `<input type="number" class="form-control"/>`;        

    case "BOOLEAN":
        return `
        <select class="form-control">
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
        </select>
        `;
        
    default:
        return `<input type="text" class="form-control"/>`;

    }
}