import { Box, Container } from "@mui/system";
import { Button, Paper, Typography } from "@mui/material";

import BuildingChooser from "./BuildingChooser";
import CustomBuilding from "./CustomBuilding";
import Page from "../../layouts/Page";
import SavingsDisplay from "./SavingsDisplay";
import campus from "../../assets/campus.jpeg";
import { useState } from "react";

const WhatIf = () => {
  const [building, setBuilding] = useState();

  const Component = () => {
    if (building === "custom") {
      return (
        <CustomBuilding
          onBuildingCreate={(_building) => setBuilding(_building)}
        />
      );
    } else if (!building) {
      return (
        <BuildingChooser
          onBuildingChose={(_building) => setBuilding(_building)}
        />
      );
    } else {
      return (
        <>
          <SavingsDisplay buildingData={building} />
          <Button sx={{ mt: 5 }} onClick={() => setBuilding(null)}>
            Choose Another Building
          </Button>
        </>
      );
    }
  };

  return (
    <Page
      title="What If?"
      sx={{ p: "0 !important", py: "0 !important", overflow: "hidden" }}
    >
      <Box
        sx={{
          position: "absolute",
          height: "110%",
          width: "110%",
          transform: "translate(-5%,-5%)",
          zIndex: -1,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${campus})`,
          filter: "blur(5px)",
        }}
      ></Box>
      <Container maxWidth="md" sx={{ maxHeight: "100%", overflow: "scroll" }}>
        <Paper
          elevation={5}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
            mx: [0, 5],
            marginTop: 15,
            p: 5,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            What if Campus Had More Solar?
          </Typography>
          <Component />
        </Paper>
      </Container>
    </Page>
  );
};

export default WhatIf;
