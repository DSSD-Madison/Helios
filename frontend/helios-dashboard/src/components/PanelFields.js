import Input from "./Input";
import { InputAdornment } from "@mui/material";

const PanelFields = ({ formik, simple }) => {
  return (
    <>
      <Input
        name="name"
        label="Name"
        type="text"
        variant="outlined"
        formik={formik}
      />
      {!simple && (
        <>
          <Input
            name="beta"
            label="Panel Slope"
            type="number"
            variant="outlined"
            formik={formik}
            InputProps={{
              endAdornment: <InputAdornment position="end">°</InputAdornment>,
            }}
          />
          <Input
            name="gamma"
            label="Surface Azimuth"
            type="number"
            variant="outlined"
            formik={formik}
            InputProps={{
              endAdornment: <InputAdornment position="end">°</InputAdornment>,
            }}
          />
          <Input
            name="rho_g"
            label="Reflectance"
            type="number"
            variant="outlined"
            formik={formik}
          />
        </>
      )}
      <Input
        name="area"
        label="Area"
        type="number"
        variant="outlined"
        formik={formik}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              m<sup>2</sup>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default PanelFields;
