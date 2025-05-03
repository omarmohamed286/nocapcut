import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

const ButtonWithIcon = ({ onClick, children }: Props) => {
  return (
    <button
      className="flex items-center gap-2 m-5"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonWithIcon;
