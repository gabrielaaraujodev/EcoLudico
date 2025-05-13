import React from "react";

const useForm = (initialValues) => {
  const [values, setValues] = React.useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return [values, handleChange, setValues, resetForm];
};

export default useForm;
