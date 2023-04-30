import { Box, Typography } from "@mui/material";
import { CO2_PER_KW, COST_PER_KW } from "../config/savings";

import ShortCountUp from "./ShortCountUp";

const SavingsFigures = ({ kwhOutput }) => {
  return (
    <>
      <ShortCountUp end={kwhOutput * COST_PER_KW} delay={0}>
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
      <ShortCountUp end={kwhOutput * CO2_PER_KW} delay={0}>
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
      <ShortCountUp end={kwhOutput} delay={0}>
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
