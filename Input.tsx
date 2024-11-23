import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${className}`}
      {...props}
    />
  );
};
