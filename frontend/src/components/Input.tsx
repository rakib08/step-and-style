import React from 'react';

interface InputProps {
  id: string;
  type: string;
  value: string;
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ id, type, value, label, placeholder, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
      />
    </div>
  );
};

export default Input;
