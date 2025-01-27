import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, type = 'button', children }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
    >
      {children}
    </button>
  );
};

export default Button;
