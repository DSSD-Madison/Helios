import { Avatar, Box, Button, Typography } from "@mui/material";

import college_library from "../../assets/college-library.jpeg";
import memorial_library from "../../assets/memorial-library.jpeg";
import memorial_union from "../../assets/memorial-union.jpeg";

const buildings = [
  {
    name: "Memorial Union",
    beta: 0,
    gamma: 0,
    rho_g: 0.2,
    area: 1000,
    img: memorial_union,
  },
  {
    name: "Memorial Library",
    beta: 0,
    gamma: 0,
    rho_g: 0.2,
    area: 2000,
    img: memorial_library,
  },
  {
    name: "College Library",
    beta: 0,
    gamma: 0,
    rho_g: 0.2,
    area: 1500,
    img: college_library,
  },
];

const BuildingChooser = ({ onBuildingChose }) => {
  return (
    <>
      <Typography variant="h5" component="h2">
        Choose a building
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
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
    </>
  );
};

export default BuildingChooser;
