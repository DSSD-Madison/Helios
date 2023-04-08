import CountUp from "react-countup";
import shortenNum from "../util/shortenNum";

const ShortCountUp = ({ end, suffix, children, ...props }) => {
  const [num, numSuffix] = shortenNum(end);

  return (
    <CountUp
      end={num}
      suffix={numSuffix + (suffix || "")}
      decimals={2}
      {...props}
    >
      {children}
    </CountUp>
  );
};

export default ShortCountUp;
