import React from "react";
import "./LoginForm.css";

export function Input(props) {
  return (
    <div className="form-group">
      <input className="form-control" {...props} />
    </div>
  );
}

export function FormBtn(props) {
  return (
    <button {...props} style={{ marginBottom: 10, marginTop: 10 }} className="btn btn-success">
      {props.children}
    </button>
  );
}

export function Form(props) {
    return <form className="LoginForm" {...props} />;
}

export function InputGroup({ id, labelText, ...inputProps }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{labelText}</label>
      <br/>
      <input id={id} {...inputProps} />
    </div>
  );
}

