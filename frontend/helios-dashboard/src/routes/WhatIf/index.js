import { Box, Container } from "@mui/system";
import { Button, Paper, Typography } from "@mui/material";

import BuildingChooser from "./BuildingChooser";
import CustomBuilding from "./CustomBuilding";
import Page from "../../layouts/Page";
import SavingsDisplay from "./SavingsDisplay";
import campus from "../../assets/campus.jpg";
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
    <Page title="What If?" sx={{ p: "0 !important", py: "0 !important" }}>
      <Box
        sx={{
          minHeight: "100%",
          px: [0, 5],
          paddingTop: 15,
          backgroundSize: "cover",
          background: `url(${campus}) fixed center`,
        }}
      >
        <Container maxWidth="md" sx={{ minHeight: "100%" }}>
          <Paper
            maxWidth="md"
            elevation={5}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: ["column"],
              minHeight: "100%",
              p: 5,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
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
      </Box>
    </Page>
  );
};

export default WhatIf;
