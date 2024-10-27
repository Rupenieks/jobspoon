import { ColorRing } from "react-loader-spinner";

const CustomColorRing = ({
  colors,
}: {
  colors: [string, string, string, string, string];
}) => {
  return (
    <ColorRing
      visible={true}
      height="80"
      width="80"
      ariaLabel="color-ring-loading"
      wrapperStyle={{}}
      wrapperClass="color-ring-wrapper"
      colors={colors}
    />
  );
};

export default CustomColorRing;
