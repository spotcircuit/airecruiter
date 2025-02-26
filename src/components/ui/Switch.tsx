'use client';

import { useState } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  className = '',
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`${
        isChecked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      disabled={disabled}
      aria-pressed={isChecked}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={`${
          isChecked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
}
