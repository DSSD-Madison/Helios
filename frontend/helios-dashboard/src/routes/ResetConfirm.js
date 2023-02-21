import { Button, Typography } from "@mui/material";

import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import Page from "../layouts/Page";

const ResetConfirm = () => {
  return (
    <Page title={"Reset Email Sent"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Password Reset Email Sent
        </Typography>
        <Button component={Link} variant="contained" to="/auth/log-in">
          Back to Login
        </Button>
      </Box>
    </Page>
  );
};

export default ResetConfirm;
