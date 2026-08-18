import React from "react";
import { ICONS, type IconName } from "@/constants/icons";

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const Component = ICONS[name];
  return <Component className={className} aria-hidden="true" />;
};

export default Icon;
