import React from "react";
import { connect } from "react-redux";

const withProgramRequired = (Placeholder = () => null) => (Component) => {
  const programRequiredComponent = ({ programMetadata, ...props }) => {
    if (!programMetadata) {
      return <Placeholder />;
    }
    return <Component {...props} />;
  };
  const mapStateToProps = (state) => ({
    programMetadata: state.metadata.programMetadata,
  });
  const ConnectedStoreComponent = connect(mapStateToProps)(
    programRequiredComponent
  );
  return ConnectedStoreComponent;
};

export default withProgramRequired;
