import { Box, Typography } from "@mui/material";

import ShortCountUp from "./ShortCountUp";

const SavingsFigures = ({ dollars, watts, co2 }) => {
  return (
    <>
      <ShortCountUp end={dollars} delay={0}>
        {({ countUpRef }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              ref={countUpRef}
              sx={{ fontSize: ["30px", "60px"], fontWeight: "400" }}
            />
            <Typography>$ Saved</Typography>
          </Box>
        )}
      </ShortCountUp>
      <ShortCountUp end={co2} delay={0}>
        {({ countUpRef }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              ref={countUpRef}
              sx={{ fontSize: ["40px", "80px"], fontWeight: "400" }}
            />
            <Typography>
              lb CO<sup>2</sup> Saved
            </Typography>
          </Box>
        )}
      </ShortCountUp>
      <ShortCountUp end={watts} delay={0}>
        {({ countUpRef }) => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              ref={countUpRef}
              sx={{ fontSize: ["30px", "60px"], fontWeight: "400" }}
            />
            <Typography>kWh Gen.</Typography>
          </Box>
        )}
      </ShortCountUp>
    </>
  );
};

export default SavingsFigures;
