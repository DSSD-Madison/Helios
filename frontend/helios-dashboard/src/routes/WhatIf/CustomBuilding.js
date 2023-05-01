import { Box, Button, FormHelperText, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { number, object, string } from "yup";

import PanelFields from "../../components/PanelFields";

const CustomBuilding = ({ onBuildingCreate }) => {
  const validationSchema = () =>
    object().shape({
      name: string().required(),
      beta: number().required(),
      gamma: number().required(),
      rho_g: number().required(),
      area: number().required(),
    });

  const handleSubmit = (values, { setSubmitting }) => {
    delete values.submit;

    onBuildingCreate(values);
    setSubmitting(false);
  };

  return (
    <>
      <Typography variant="h5" component="h2">
        Create a Custom Building
      </Typography>
      <Formik
        enableReinitialize
        initialValues={{
          name: "",
          beta: 0,
          gamma: 0,
          rho_g: 0,
          area: 0,
          submit: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <Stack spacing={2} sx={{ mt: 5 }}>
              <PanelFields formik={formik} simple={true} />
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                Create
              </Button>
              <Button
                onClick={() => onBuildingCreate(null)}
                disabled={formik.isSubmitting}
              >
                Go Back
              </Button>
            </Stack>

            {formik.errors.submit && (
              <Box mt={3}>
                <FormHelperText error sx={{ textAlign: "center" }}>
                  {formik.errors.submit}
                </FormHelperText>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CustomBuilding;
