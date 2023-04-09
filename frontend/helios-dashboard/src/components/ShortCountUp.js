import CountUp from "react-countup";
import shortenNum from "../util/shortenNum";
import { useMediaQuery } from "@mui/material";

const ShortCountUp = ({ end, suffix, children, ...props }) => {
  const isDesktop = useMediaQuery("(min-width:600px)");
  const [num, numSuffix] = shortenNum(end);

  return (
    <CountUp
      end={num}
      suffix={numSuffix + (suffix || "")}
      decimals={isDesktop ? 2 : 1}
      {...props}
    >
      {children}
    </CountUp>
  );
};

export default ShortCountUp;
