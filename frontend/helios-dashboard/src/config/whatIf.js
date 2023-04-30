import bakke_center from "../assets/bakke-center.jpeg";
import discovery_building from "../assets/discovery-building.jpeg";
import kohl_center from "../assets/kohl-center.jpeg";
import nick_center from "../assets/nick-center.jpeg";
import pyle_center from "../assets/pyle-center.jpeg";
import union_south from "../assets/union-south.jpeg";

const BUILDINGS = [
  {
    name: "Kohl Center",
    beta: 10,
    gamma: 0,
    rho_g: 0.2,
    area: 12649,
    img: kohl_center,
  },
  {
    name: "Bakke Center",
    beta: 10,
    gamma: 0,
    rho_g: 0.2,
    area: 7989,
    img: bakke_center,
  },
  {
    name: "Pyle Center",
    beta: 10,
    gamma: 0,
    rho_g: 0.2,
    area: 3971,
    img: pyle_center,
  },
  {
    name: "Union South",
    beta: 10,
    gamma: 0,
    rho_g: 0.2,
    area: 3843,
    img: union_south,
  },
  {
    name: "Discovery Building",
    beta: 10,
    gamma: 0,
    rho_g: 0.2,
    area: 3640,
    img: discovery_building,
  },
  {
    name: "Nick Center",
    beta: 10,
    gamma: 0,
    rho_g: 0.2,
    area: 1512,
    img: nick_center,
  },
];

const ESTIMATION_ARRAY_ID = "omSPZlQzgyUsRKuT9bZE";

export { BUILDINGS, ESTIMATION_ARRAY_ID };
