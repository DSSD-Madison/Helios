import { Box, Typography } from "@mui/material";

import CountUp from "react-countup";

const SavingsFigures = ({ dollars, watts, co2 }) => {
  return (
    <>
      <CountUp end={dollars} delay={0}>
        {({ countUpRef }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              ref={countUpRef}
              sx={{ fontSize: ["30px", "60px"], fontWeight: "400" }}
            />
            <Typography>Dollars Saved</Typography>
          </Box>
        )}
      </CountUp>
      <CountUp end={co2} delay={0}>
        {({ countUpRef }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              ref={countUpRef}
              sx={{ fontSize: ["40px", "80px"], fontWeight: "400" }}
            />
            <Typography>CO2 Saved</Typography>
          </Box>
        )}
      </CountUp>
      <CountUp end={watts} delay={0}>
        {({ countUpRef }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              ref={countUpRef}
              sx={{ fontSize: ["30px", "60px"], fontWeight: "400" }}
            />
            <Typography>Watts Gen.</Typography>
          </Box>
        )}
      </CountUp>
    </>
  );
};

export default SavingsFigures;
