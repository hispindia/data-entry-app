import React from "react";
import { Select } from "antd";

const ProgramSelection = ({ onChange, disabled, ...props }) => {
  return (
    <Select
      prefix="Program:"
      style={{ width: 250 }}
      // disableElevation
      disabled={disabled}
      onChange={onChange}
      {...props}
    />
  );
};

export default ProgramSelection;
