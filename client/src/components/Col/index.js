import React from "react";

function Col(props) {
  const size = props.size.split(" ").map(size => "col-" + size).join(" ");
  const extra = props.className ? ` ${props.className}` : "";

  return <div className={`${size}${extra}`}>{props.children}</div>;
}

export default Col;
