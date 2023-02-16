import { TextField } from "@mui/material";

const Input = ({ name, formik, ...rest }) => {
  return (
    <TextField
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      {...rest}
    />
  );
};

export default Input;
