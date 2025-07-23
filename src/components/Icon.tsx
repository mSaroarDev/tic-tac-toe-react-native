import Feather from "react-native-vector-icons/Feather";

type IconProps = {
  iconName: string;
};

const Icon = ({ iconName }: IconProps) => {

  return (
    <>
      <Feather 
        name={iconName} 
        size={45} 
        color={iconName === "circle" ? "purple" : "red"} 
      />
    </>
  );
};

export default Icon;