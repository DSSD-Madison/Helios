import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";

const Loader = ({ isLoading }) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else {
    return <></>;
  }
};

export default Loader;
