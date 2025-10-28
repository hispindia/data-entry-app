import { CHILD_VACCINES, FAMILY_MEMBER_METADATA_CUSTOMUPDATE, MIN_MAX_TEXT, MOBILE_NUM_REGEX } from "@/components/constants";
import _ from "lodash";
import { useRef, useState } from "react";

const useForm = (metadata, data, uiLocale, displayFields) => {
  const [formMetadata, setMetadata] = useState(metadata);
  const [formData, setFormData] = useState(data);
  const [warningLocale, setWarningLocale] = useState(uiLocale);
  const [validationText, setValidationText] = useState({});
  const [warningText, setWarningText] = useState({});
  const [isFormFulfilled, setIsFormFulfilled] = useState(true); // TRUE to skip validation for now [WIP]

  const validationTypes = ["compulsory"];
  const prevData = useRef(data);

  const validationCheck = (type, value) => {
    switch (type) {
      case "compulsory":
        if (value == "" || value == null || value == undefined) {
          if (warningLocale && warningLocale.compulsory) return { text: warningLocale.compulsory };
          return { text: "This field is required" };
        }

      default:
        return null;
    }
  };

  const checkFormFulfilled = () => {
    const filableFields = formMetadata
      .filter((md) => !md.hidden && !md.disabled)
      .filter((md) => displayFields.includes(md.code));
    const filableFieldCodes = filableFields.map((md) => md.code || md.id);
    
    const currentValuesKeys = [];
    for (const key in formData) {
      if (formData[key]) {
        currentValuesKeys.push(key);
      }
    }

    const isFulfilled = filableFieldCodes.every((code) => currentValuesKeys.includes(code));
    // const remainList = filableFieldCodes.filter((code) => !currentValuesKeys.includes(code));
    // console.log({ remainList, isFulfilled });
    setIsFormFulfilled(isFulfilled);
  };

  const initFromData = (data) => {
    setFormData(data);
  };

  // handle validation from form input value basis of prediclated field
  const changeValue = (property, value) => {
    let temp = JSON.parse(JSON.stringify(formData));
    prevData.current = { ...temp };
    formData[property] = value;

    setFormData({ ...formData });
  };

  const changeMetadata = (metadata) => {
    setMetadata(metadata);
    onSubmit();
  };

  const validation = (code, otherError) => {
    if (otherError) {
      return otherError;
    } else {
      return validationText[code] ? validationText[code].text : null;
    }
  };

  const validationWarning = (code) => {
    return warningText[code] ? warningText[code].text : null;
  };

  const onSubmit = (external) => {
    let valText = {};
    let warningText = {};

    validationTypes.forEach((vt) => {
      let filterMDbyType = _.filter(formMetadata, { [vt]: true });

      filterMDbyType.forEach((mdf) => {
        let valRes = validationCheck(vt, formData[mdf.code || mdf.id] || null);
        if (valRes) valText[mdf.code || mdf.id] = valRes;
      });
    });

    // run external layer
    if (external) {
      valText[external.attribute] = external.error;
    }

    // validation from metadata
    if (formMetadata) {
      formMetadata.forEach((mdf) => {
        if (mdf.error) {
          valText[mdf.code || mdf.id] = { text: mdf.error };
        }
        if (mdf.warning) {
          warningText[mdf.code || mdf.id] = { text: mdf.warning };
        }

        // fieldMask validation
        if (mdf.fieldMask && formData[mdf.code || mdf.id]) {
          const fieldValue = formData[mdf.code || mdf.id];
          const regex = new RegExp(mdf.fieldMask, "i"); // case insensitive
          if (!regex.test(fieldValue)) {
            valText[mdf.code || mdf.id] = {
              text: `Invalid format. ${mdf.description}`,
            };
          }
        }
      });
    }

    console.log({ valText, warningText });
    // custom fileds validations
    setValidationText(valText);
    setWarningText(warningText);

    return _.isEmpty(valText);
  };

  const clear = () => {
    setFormData({});
    setMetadata([]);
    setWarningLocale({});
  };

  return {
    formMetadata,
    prevData,
    isFormFulfilled,
    checkFormFulfilled,
    changeMetadata,
    formData,
    setFormData,
    changeValue,
    initFromData,
    validation,
    validationWarning,
    onSubmit,
    clear,
    // validateFamilyMemberForm,
  };
};
export default useForm;
