import React from "react";

const useForm = (initialValues) => {
  const [values, setValues] = React.useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.includes(".")) {
      const path = name.split(".");
      let tempValues = { ...values };
      let current = tempValues;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      setValues(tempValues);
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  return [values, handleChange, setValues];
};

export default useForm;
