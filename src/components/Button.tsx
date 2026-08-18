import React from "react";
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "@/constants/buttonStyles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  );
};

export default Button;
