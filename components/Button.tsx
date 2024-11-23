import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "icon" | "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "medium",
  variant = "primary",
  className,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2";
  const sizeStyles = {
    icon: "w-10 h-10 p-2",
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-5 py-3 text-lg",
  };
  const variantStyles = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
