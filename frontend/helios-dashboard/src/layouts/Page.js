import * as React from "react";

import { Box } from "@mui/material";
import Navigation from "../components/Navigation";

const Page = ({ title, sx, children }) => {
  React.useEffect(() => {
    document.title = `${title} | Helios` || "";
  }, [title]);

  return (
    <>
      <Navigation title={title} />

      <Box sx={{ height: "100%", p: 5, paddingTop: 10, position: "relative", ...sx }}>{children}</Box>
    </>
  );
};

export default Page;
