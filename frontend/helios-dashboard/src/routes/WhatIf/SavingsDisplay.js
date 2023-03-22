import { Box, Stack, Typography } from "@mui/material";

import CountUp from "react-countup";

const SavingsDisplay = ({ buildingData }) => {
  return (
    <>
      <Typography variant="h5" component="h2">
        If the {buildingData.name} had solar panels on its {buildingData.area} m
        <sup>2</sup> of roof...
      </Typography>

      <Stack direction="row" spacing={6} sx={{ mt: 5, alignItems: "center" }}>
        <CountUp end={100}>
          {({ countUpRef }) => (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                component="p"
                ref={countUpRef}
                sx={{ fontWeight: "400" }}
              />
              <Typography>Dollars Saved</Typography>
            </Box>
          )}
        </CountUp>
        <CountUp end={100}>
          {({ countUpRef }) => (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h1"
                component="p"
                ref={countUpRef}
                sx={{ fontWeight: "500" }}
              />
              <Typography>CO2 Saved</Typography>
            </Box>
          )}
        </CountUp>
        <CountUp end={100}>
          {({ countUpRef }) => (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                component="p"
                ref={countUpRef}
                sx={{ fontWeight: "400" }}
              />
              <Typography>Watts Gen.</Typography>
            </Box>
          )}
        </CountUp>
      </Stack>
    </>
  );
};

export default SavingsDisplay;
