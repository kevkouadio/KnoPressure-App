import React from "react";


function Container(props) {
  const extra = props.className ? ` ${props.className}` : "";
  return (
    <div className={`container-body padding${extra}`} style={props.style}>
      {props.children}
    </div>
  );
}

export default Container;
