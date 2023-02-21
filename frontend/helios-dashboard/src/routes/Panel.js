import {
  Button,
  CircularProgress,
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
  updateDoc,
} from "@firebase/firestore";
import { db, store } from "../firebase";
import { getMetadata, listAll, ref, uploadBytes } from "@firebase/storage";
import { number, object, string } from "yup";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Box } from "@mui/system";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Input from "../components/Input";
import MUIDataTable from "mui-datatables";
import Page from "../layouts/Page";
import { useConfirm } from "material-ui-confirm";

const Panel = () => {
  const { panelId } = useParams();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const solarRef = collection(db, "Solar Arrays");
  const uploadRef = ref(store);
  const [uploads, setUploads] = useState([]);
  const [panel, setPanel] = useState({});
  const [isLoading, setLoading] = useState(false);

  const getPanel = async (id) => {
    const panelRef = doc(solarRef, id);
    const panelDoc = await getDoc(panelRef);

    setPanel(panelDoc.data());

    const uploadList = await listAll(uploadRef);

    let data = [];
    for (const doc of uploadList.items) {
      let parsedUpload = [];

      const nameParts = doc.name.split(/_|\./);
      if (nameParts.length < 3) continue;
      const date = Number(nameParts[1]);

      if (nameParts[0] !== panelId) continue;

      const metaRef = ref(store, doc.fullPath);
      const metadata = await getMetadata(metaRef);

      const origName =
        metadata && metadata.customMetadata && metadata.customMetadata.origName
          ? metadata.customMetadata.origName
          : "none";

      parsedUpload.push(origName);
      parsedUpload.push(date);

      data.push(parsedUpload);
    }

    setUploads(data);
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
    } catch (e) {}
  };

  const columns = [
    { name: "Uploaded Name" },
    {
      name: "Date",
      options: {
        filter: false,
        customBodyRender: (value) => new Date(value).toLocaleString(),
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
    <Page title={panel.name + " Panel"}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Typography variant="h5" gutterBottom>
        Manage {panel.name} Panel
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={4}
            sx={{ marginBottom: "2rem", padding: "1rem", paddingLeft: "24px" }}
          >
            <Typography variant="h6" gutterBottom>
              Update Panel Properties
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
                        Delete Panel
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
            title={"Data Uploads"}
            data={uploads}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Panel;
