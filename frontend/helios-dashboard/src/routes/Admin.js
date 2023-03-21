import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormHelperText,
  Paper,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { addDoc, collection, deleteDoc, doc, getDocs, getDocscollection, updateDoc, } from "@firebase/firestore";
import { auth, db } from "../firebase.js";
import { boolean, number, object, string } from "yup";
import { useEffect, useState } from "react";

import Input from "../components/Input";
import MUIDataTable from "mui-datatables";
import Page from "../layouts/Page";
import PanelFields from "../components/PanelFields.js";
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
    console.log("fetching array data")
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
  }, []);

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


  //For users table
  const [usersData, setUsersData] = useState([]);
  const usersRef = collection(db, "users");

  const getUsers = async () => {
    const snapshot = await getDocs(usersRef);
    let data = [];

    snapshot.forEach((doc) => {
      const user = doc.data();
      let userInfo = [];
      userInfo.push(doc.id);
      userInfo.push(user.email);
      userInfo.push(user.isAdmin);

      data.push(userInfo);
    });
    setUsersData(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const usersColumns = [
    {
      name: "UID",
      options: {
        display: false,
      },
    },
    {
      name: "Email",
    },
    {
      name: "Admin",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const docId = tableMeta.rowData[0];
          const updateAdmin = async (event) => {
            const isAdmin = event.target.checked;
            const currentUser = auth.currentUser;
            if (docId === currentUser.uid) { //Don't want admins to accidently disable their access
              window.alert("You cannot update your own admin status");
              return;
            }
            updateValue(isAdmin); //updating checkbox in the table
            await updateDoc(doc(usersRef, docId), { isAdmin }); //updating isAdmin in firestore document
          };
          return (
            <Checkbox checked={value} onChange={updateAdmin} />
          );
        },
      },
    },
  ];

  const usersOptions = {
    // filter: false,
    // selectableRows: "none",
  };

  const userValidationSchema = () =>
    object().shape({
      email: string().required(),
      isAdmin: boolean().required(),
    });

  const userHandleSubmit = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      delete usersRef.submit;

      await addDoc(usersRef, values);
      await getUsers();
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
        Manage Panel Arrays
      </Typography>
      <Paper
        elevation={4}
        sx={{ marginBottom: "2rem", padding: "1rem", paddingLeft: "24px" }}
      >
        <Typography variant="h6" gutterBottom>
          Add an Array
        </Typography>
        <Formik
          initialValues={{
            name: "",
            beta: 0,
            gamma: 0,
            rho_g: 0.2,
            area: 0,
            submit: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <Stack direction="row" spacing={2}>
                <PanelFields formik={formik} />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  Add
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
      <Paper
        sx={{ marginBottom: "2rem" }}
      >
        <MUIDataTable
          title={"Array List"}
          data={panels}
          columns={columns}
          options={options}
        />
      </Paper>
      <Paper
        elevation={4}
      // sx={{ marginBottom: "2rem", padding: "1rem", paddingLeft: "24px" }}
      >
        {/* <Typography variant="h6" gutterBottom>
          Add a User
        </Typography>
        <Formik
          initialValues={{
            email: "",
            isAdmin: false
          }}
          validationSchema={userValidationSchema}
          onSubmit={userHandleSubmit}
        >
          {(formik) => (
            <Form>
              <Stack direction="row" spacing={3}>
                <Input
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  formik={formik}
                  required="true"
                  sx={{
                    width: .3,
                    height: "100%",
                  }}
                />
                <Input
                  name="isAdmin"
                  label="Admin"
                  type="checkbox"
                  variant="outlined"
                  formik={formik}
                  sx={{
                    width: .1,
                    height: "100%",
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  Add
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
        </Formik> */}

        <MUIDataTable
          title={"Users"}
          data={usersData}
          columns={usersColumns}
          options={usersOptions}
        />
      </Paper>
    </Page >
  );
}
