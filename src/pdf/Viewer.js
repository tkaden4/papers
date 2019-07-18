import React from "react";

export const Viewer = ({ url }) => {
  return (
    <iframe
      src={`/web/viewer.html?file=${url}`}
      width="100%"
      height="100%"
      frameBorder="0"
    />
  );
};

export default Viewer;
