import React from "react";
type ButtonProps = {
  bgHoverColor: string;
  text: string;
  icon: string;
  style: React.CSSProperties;
  handleClick: () => void;
};
const Button = ({
  bgHoverColor,
  text,
  style,
  icon,
  handleClick,
}: ButtonProps) => {
  return (
    <button
      type="submit"
      style={style}
      onClick={handleClick}
      className={`flex flex-col items-center justify-center hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
    >
      {icon !== "" && <img className="md:mb-1" src={icon} alt="" />}
      {text}
    </button>
  );
};

export default Button;
