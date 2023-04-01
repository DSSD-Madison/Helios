import { Button, Typography } from "@mui/material";

import { Box } from "@mui/system";
import Page from "../layouts/Page";
import { auth } from "../firebase";
import { signOut } from "@firebase/auth";
import { useNavigate } from "react-router-dom";

const NotAdmin = () => {
  const navigate = useNavigate();

  const logOut = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <Page title={"Not an Admin"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          You Are Not a Helios Admin
        </Typography>
        <Typography gutterBottom>
          Please contact the Helios Team if you believe this is a mistake
        </Typography>
        <Button variant="contained" onClick={logOut}>
          Log Out
        </Button>
      </Box>
    </Page>
  );
};

export default NotAdmin;
