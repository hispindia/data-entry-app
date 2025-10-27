import React from "react";
import { Select } from "antd";

const ProgramSelection = ({ onChange, disabled, value, ...props }) => {
  return (
    <Select
      prefix="Program:"
      style={{ width: 250 }}
      // disableElevation
      disabled={disabled}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};

export default ProgramSelection;
