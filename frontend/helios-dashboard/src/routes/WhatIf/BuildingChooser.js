import { Avatar, Box, Button, Typography } from "@mui/material";

import buildings from "./Buildings";

const BuildingChooser = ({ onBuildingChose }) => {
  return (
    <>
      <Typography variant="h5" component="h2">
        Choose a building
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          pt: [2, 5],
        }}
      >
        {buildings.map((building) => (
          <Button
            sx={{ flexDirection: "column", textAlign: "center", mx: 1, px: 1 }}
            onClick={() => onBuildingChose(building)}
          >
            <Avatar
              alt={`Image of ${building.name}`}
              src={building.img}
              sx={{ width: 120, height: 120 }}
            />
            <Typography sx={{ pt: 1 }}>{building.name}</Typography>
          </Button>
        ))}
      </Box>
      <Button sx={{ mt: 5 }} onClick={() => onBuildingChose("custom")}>
        Or, Use a Custom Building
      </Button>
    </>
  );
};

export default BuildingChooser;
