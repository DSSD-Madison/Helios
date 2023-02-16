import { Button, Typography } from "@mui/material";

import Page from "../layouts/Page";
import { auth } from "../firebase.js";
import { signOut } from "@firebase/auth";
import { useNavigate } from "react-router";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <Page title="Admin">
      <Typography>
        Admin page: {auth.currentUser && (auth.currentUser.email || null)}
      </Typography>
      <Button
        variant="contained"
        onClick={() => signOut(auth) && navigate("/")}
      >
        Log out
      </Button>
    </Page>
  );
}
