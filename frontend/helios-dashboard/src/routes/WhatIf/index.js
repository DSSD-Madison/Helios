import { Box, Container } from "@mui/system";
import { Button, Paper, Typography } from "@mui/material";

import BuildingChooser from "./BuildingChooser";
import Page from "../../layouts/Page";
import SavingsDisplay from "./SavingsDisplay";
import campus from "../../assets/campus.jpg";
import { useState } from "react";

const WhatIf = () => {
  const [building, setBuilding] = useState();

  return (
    <Page title="What If?" sx={{ p: "0 !important" }}>
      <Box
        sx={{
          height: "100%",
          px: 5,
          paddingTop: 15,
          backgroundSize: "cover",
          background: `url(${campus}) fixed center`,
        }}
      >
        <Container maxWidth="md" sx={{ height: "100%" }}>
          <Paper
            maxWidth="md"
            elevation={5}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              height: "100%",
              p: 5,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
              What if Campus Had More Solar?
            </Typography>
            {!building && (
              <BuildingChooser
                onBuildingChose={(_building) => setBuilding(_building)}
              />
            )}
            {building && (
              <>
                <SavingsDisplay buildingData={building} />
                <Button sx={{ mt: 5 }} onClick={() => setBuilding(null)}>
                  Choose Another Building
                </Button>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </Page>
  );
};

export default WhatIf;
