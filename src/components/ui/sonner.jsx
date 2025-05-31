import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group custom-toast" // Add a custom class for styling
      style={{
        "--normal-bg": "white",
        "--normal-text": "black",
        "--normal-border": "gray",
        // You can also use Tailwind colors: "--normal-bg": "rgb(243 244 246)"
      }}
      {...props}
    />
  );
};

export { Toaster };
