import { Button as MuiButton } from "@mui/material";

type ButtonProps = {
  variant: "primary" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function Button({
  variant,
  type = "button",
  onClick,
  disabled,
  children,
}: ButtonProps) {
  return (
    <MuiButton type={type} onClick={onClick} disabled={disabled} className={variant}>
      {children}
    </MuiButton>
  );
}
