import bakke_center from "../assets/bakke-center.jpeg";
import discovery_building from "../assets/discovery-building.jpeg";
import kohl_center from "../assets/kohl-center.jpeg";
import nick_center from "../assets/nick-center.jpeg";
import pyle_center from "../assets/pyle-center.jpeg";
import union_south from "../assets/union-south.jpeg";

// specify each building that should be shown on the What If page, and
// the parameters for its array
// to sepcify the image you want to use, either upload it into the ../assets folder
// and import it as is done above, or paste a link to a image available on the web
const BUILDINGS = [
  {
    name: "Kohl Center",
    beta: 10,
    gamma: 0,
    rho_g: 0.2,
    area: 12649,
    img: "https://www.travelwisconsin.com/uploads/places/4a/4aa95bba-6d6a-4fdc-9256-213492ec884e-uw-madison-kohl-center002_1.jpg?preset=listing-page-slider-desktop",
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

// Array to use to estimate the output of the arrays on the What If page
const ESTIMATION_ARRAY_ID = "enjOdZmU43u4bD4jWlog"; //Gordon Pre-Expansion

export { BUILDINGS, ESTIMATION_ARRAY_ID };
