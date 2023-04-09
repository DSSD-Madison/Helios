import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import { db, store } from "../firebase";
import { number, object, string } from "yup";
import { ref, uploadBytes } from "@firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Box } from "@mui/system";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Loader from "../components/Loader";
import MUIDataTable from "mui-datatables";
import Page from "../layouts/Page";
import PanelFields from "../components/PanelFields";
import { useConfirm } from "material-ui-confirm";

const Panel = () => {
  const { panelId } = useParams();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const solarRef = collection(db, "Solar Arrays");
  const uploadRef = ref(store);
  const [dateRanges, setDateRanges] = useState([]);
  const [panel, setPanel] = useState({});
  const [isLoading, setLoading] = useState(false);

  // Get panel data
  const getPanel = async (id) => {
    // Fetch panel properties
    const panelRef = doc(solarRef, id);
    const panelDoc = await getDoc(panelRef);

    // Set panel properties state
    setPanel(panelDoc.data());

    // Fetch panel output
    const outputRef = collection(panelRef, "Output");
    const outputSnapshot = await getDocs(outputRef);

    // Get dates of panel output
    let dates = [];
    outputSnapshot.forEach((doc) => {
      const { Output: output } = doc.data();
      for (const dateStr of Object.keys(output)) {
        dates.push(new Date(dateStr));
      }
    });
    dates.sort((d1, d2) => d1.getTime() - d2.getTime());
    let zeroHourDates = dates.map(date => new Date(date));
    zeroHourDates.forEach(date => date.setUTCHours(0, 0, 0, 0));

    let _dateRanges = [];
    let startDate = dates[0];
    let lastDate = dates[0];
    let lastZeroHourDate = zeroHourDates[0];
    for (let i = 1; i < dates.length + 1; i++) {
      let currentDate = dates[i] || new Date(3000, 1, 1); //pad end with extra date so final range in added to _dateRanges
      let currentZeroHourDate = zeroHourDates[i] || new Date(3000, 1, 1);
      if (currentZeroHourDate.getTime() > lastZeroHourDate.getTime() + 24 * 60 * 60 * 1000) {
        console.log({ lastDate, currentDate });
        _dateRanges.push([startDate, lastDate]);
        startDate = currentDate;
      }
      lastZeroHourDate = currentZeroHourDate;
      lastDate = currentDate;
    }

    setDateRanges(_dateRanges);
  };

  useEffect(() => {
    getPanel(panelId);

    // eslint-disable-next-line
  }, [panelId]);

  const validationSchema = () =>
    object().shape({
      name: string().required(),
      beta: number().required(),
      gamma: number().required(),
      rho_g: number().required(),
      area: number().required(),
    });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      delete values.submit;

      await updateDoc(doc(solarRef, panelId), values);
    } catch (err) {
      setErrors({ submit: err.message });
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    try {
      await confirm({ description: "This action is permanent!" });
      deleteDoc(doc(solarRef, panelId));
      navigate("/admin");
    } catch (e) { }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en", options);
  };

  const columns = [
    {
      name: "Start Date",
      options: {
        filter: false,
        customBodyRender: formatDate,
      },
    },
    {
      name: "End Date",
      options: {
        filter: false,
        customBodyRender: formatDate,
      },
    },
  ];
  const options = {
    filter: false,
    selectableRows: "none",
    customToolbar: () => <UploadButton />,
  };

  const handleCapture = async ({ target }) => {
    const file = target.files[0];

    const name = `${panelId}_${new Date().getTime()}.csv`;

    const metadata = {
      customMetadata: {
        origName: file.name,
      },
    };

    setLoading(true);
    try {
      await uploadBytes(ref(uploadRef, name), file, metadata);
    } finally {
      setLoading(false);
      getPanel(panelId);
    }
  };

  const UploadButton = () => {
    return (
      <Tooltip title="Upload">
        <IconButton component="label">
          <input
            hidden
            accept=".csv"
            multiple
            type="file"
            onChange={handleCapture}
          />
          <FileUploadIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Page title={panel.name + " Array"}>
      <Loader isLoading={isLoading} />
      <Typography variant="h5" gutterBottom>
        Manage {panel.name} Panel Array
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={4}
            sx={{ marginBottom: "2rem", padding: "1rem", paddingLeft: "24px" }}
          >
            <Typography variant="h6" gutterBottom>
              Update Array Properties
            </Typography>
            <Formik
              enableReinitialize
              initialValues={{
                name: panel.name || "",
                beta: panel.beta || 0,
                gamma: panel.gamma || 0,
                rho_g: panel.rho_g || 0,
                area: panel.area || 0,
                submit: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Form>
                  <Stack spacing={2}>
                    <PanelFields formik={formik} />
                    <Stack direction="row" spacing={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={formik.isSubmitting}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        disabled={formik.isSubmitting}
                        onClick={handleDelete}
                      >
                        Delete Array
                      </Button>
                    </Stack>
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
        </Grid>
        <Grid item xs={12} lg={6}>
          <MUIDataTable
            title={"Uploaded Data Ranges"}
            data={dateRanges}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Panel;
