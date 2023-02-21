import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Paper,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { addDoc, collection, getDocs } from "@firebase/firestore";
import { auth, db } from "../firebase.js";
import { number, object, string } from "yup";
import { useEffect, useState } from "react";

import Input from "../components/Input";
import MUIDataTable from "mui-datatables";
import Page from "../layouts/Page";
import { Stack } from "@mui/system";
import { signOut } from "@firebase/auth";
import { useNavigate } from "react-router";

export default function Admin() {
  const navigate = useNavigate();

  const userEmail = auth.currentUser && (auth.currentUser.email || "");
  const logOut = () => {
    signOut(auth);
    navigate("/");
  };

  const columns = [
    {
      name: "ID",
      options: {
        display: false,
      },
    },
    {
      name: "Name",
    },
    {
      name: "Beta",
    },
    {
      name: "Gamma",
    },
    {
      name: "Rho_g",
    },
    {
      name: "Area",
    },
  ];
  const options = {
    filter: false,
    selectableRows: "none",
    onRowClick: (rowData) => {
      navigate(`/admin/panel/${rowData[0]}`);
    },
  };

  const [panels, setPanels] = useState();
  const solarRef = collection(db, "Solar Arrays");

  const getPanels = async () => {
    const snapshot = await getDocs(solarRef);
    let data = [];

    snapshot.forEach((doc) => {
      const panel = doc.data();
      let parsedPanel = [];
      parsedPanel.push(doc.id);
      parsedPanel.push(panel.name);
      parsedPanel.push(panel.beta);
      parsedPanel.push(panel.gamma);
      parsedPanel.push(panel.rho_g);
      parsedPanel.push(panel.area);

      data.push(parsedPanel);
    });
    setPanels(data);
  };

  useEffect(() => {
    getPanels();
  });

  const validationSchema = () =>
    object().shape({
      name: string().required(),
      beta: number().required(),
      gamma: number().required(),
      rho_g: number().required(),
      area: number().required(),
    });

  const handleSubmit = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      delete solarRef.submit;

      await addDoc(solarRef, values);
      await getPanels();
      resetForm();
    } catch (err) {
      setErrors({ submit: err.message });
    }
    setSubmitting(false);
  };

  return (
    <Page title="Admin">
      <Alert
        action={
          <Button color="inherit" size="small" onClick={logOut}>
            Log Out
          </Button>
        }
        sx={{ marginBottom: "2rem" }}
      >
        Welcome, {userEmail}!
      </Alert>
      <Typography variant="h5" gutterBottom>
        Manage Panels
      </Typography>
      <Paper
        elevation={4}
        sx={{ marginBottom: "2rem", padding: "1rem", paddingLeft: "24px" }}
      >
        <Typography variant="h6" gutterBottom>
          Add a Panel
        </Typography>
        <Formik
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
              <Stack direction="row" spacing={2}>
                <Input
                  name="name"
                  label="Name"
                  type="text"
                  variant="outlined"
                  formik={formik}
                />
                <Input
                  name="beta"
                  label="Beta"
                  type="number"
                  variant="outlined"
                  formik={formik}
                />
                <Input
                  name="gamma"
                  label="Gamma"
                  type="number"
                  variant="outlined"
                  formik={formik}
                />
                <Input
                  name="rho_g"
                  label="Rho_g"
                  type="number"
                  variant="outlined"
                  formik={formik}
                />
                <Input
                  name="area"
                  label="Area"
                  type="number"
                  variant="outlined"
                  formik={formik}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  Submit
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
      </Paper>
      <MUIDataTable
        title={"Panels List"}
        data={panels}
        columns={columns}
        options={options}
      />
    </Page>
  );
}
