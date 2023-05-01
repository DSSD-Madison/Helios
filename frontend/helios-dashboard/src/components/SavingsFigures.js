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
            <Typography sx={{ fontSize: ["10px", "10px"], fontWeight: "200" }}>*based on ${COST_PER_KW} per kWh</Typography>
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
            <Typography>lb CO<sub>2</sub> Saved</Typography>
            <Typography sx={{ fontSize: ["10px", "10px"], fontWeight: "200" }}>*based on {CO2_PER_KW}lb CO<sub>2</sub> per kWh</Typography>
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
