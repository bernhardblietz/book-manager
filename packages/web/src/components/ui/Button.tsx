type ButtonProps = {
  variant: "primary" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function Button({ variant, type = "button", onClick, disabled, children }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded ${variant} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <div>{children}</div>
    </button>
  )
}