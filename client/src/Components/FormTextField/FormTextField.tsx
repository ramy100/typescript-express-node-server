import React from "react";
import { Form } from "react-bootstrap";

const FormTextField = ({
  inputChange,
  fieldName,
  label,
  placeholder,
  type,
}: {
  inputChange: any;
  fieldName: string;
  label: string;
  placeholder: string;
  type?: string;
}) => {
  return (
    <Form.Group controlId={`formGroup${fieldName}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        placeholder={placeholder}
        name={fieldName}
        onChange={inputChange}
        type={type ? type : undefined}
      />
    </Form.Group>
  );
};

export default FormTextField;
