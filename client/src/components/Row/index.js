import React from "react";

function Row(props) {
  const extra = props.className ? ` ${props.className}` : "";
  return <div className={`row${extra}`}>{props.children}</div>;
}

export default Row;
