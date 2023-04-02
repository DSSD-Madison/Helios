import { Box, Stack, Typography, useMediaQuery } from "@mui/material";

import SavingsFigures from "../../components/SavingsFigures";

const SavingsBanner = () => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#181818",
        px: 3,
        py: 2,
        mx: [-2, -5],
        mb: 2,
        color: "white",
      }}
    >
      <Typography variant="h3" component="h2">
        Savings
      </Typography>
      <Stack
        direction="row"
        spacing={isDesktop ? 6 : 3}
        sx={{
          width: "100%",
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SavingsFigures dollars={100} watts={100} co2={100} />
      </Stack>
    </Box>
  );
};

export default SavingsBanner;
