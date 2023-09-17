import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormHelperText,
  Paper,
  Typography,
  useMediaQuery,
  Link
} from "@mui/material";
import { Form, Formik } from "formik";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import { auth, db } from "../firebase.js";
import { number, object, string } from "yup";
import { useEffect, useState } from "react";

import MUIDataTable from "mui-datatables";
import Page from "../layouts/Page";
import PanelFields from "../components/PanelFields.js";
import { Stack } from "@mui/system";
import { signOut } from "@firebase/auth";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router";

export default function Admin() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const isDesktop = useMediaQuery("(min-width:600px)");

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
            if (docId === currentUser.uid) {
              //Don't want admins to accidentally disable their access
              confirm({
                title: "Action Denied",
                description: "You cannot update your own admin status",
                hideCancelButton: true,
              });
              return;
            }
            updateValue(isAdmin); //updating checkbox in the table
            await updateDoc(doc(usersRef, docId), { isAdmin }); //updating isAdmin in firestore document
          };
          return <Checkbox checked={value} onChange={updateAdmin} />;
        },
      },
    },
  ];

  const usersOptions = {
    filter: false,
    viewColumns: false,
    selectableRows: "none",
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
              <Stack direction={isDesktop ? "row" : "column"} spacing={2}>
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
      <Paper sx={{ marginBottom: "2rem" }}>
        <MUIDataTable
          title={"Array List"}
          data={panels}
          columns={columns}
          options={options}
        />
      </Paper>
      <Paper elevation={4}>
        <MUIDataTable
          title={"Users"}
          data={usersData}
          columns={usersColumns}
          options={usersOptions}
        />
      </Paper>
      <Paper elevation={4} sx={{ marginTop: "2rem", padding: "1rem" }}>

        <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
          Additional Configuration
        </Typography>

        <Typography>
          <Link href="https://github.com/DSSD-Madison/Helios/blob/main/frontend/helios-dashboard/src/config/filterRemappings.js">
            Combine arrays into one
          </Link> e.g. if the array was upgraded and any of the parameters changed
        </Typography>
        <Typography>
          <Link href="https://github.com/DSSD-Madison/Helios/blob/main/frontend/helios-dashboard/src/config/savings.js">
            Update Cost/CO<sub>2</sub> per kW
          </Link>
        </Typography>
        <Typography>
          <Link href="https://github.com/DSSD-Madison/Helios/blob/main/frontend/helios-dashboard/src/config/whatIf.js">
            Update WhatIf page
          </Link> e.g. what arrays and their parametes, or what array to use to estimate their output
        </Typography>

      </Paper>
    </Page>
  );
}

