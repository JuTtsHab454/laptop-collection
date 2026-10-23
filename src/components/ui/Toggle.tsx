'use client';

import React from 'react';

export interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  helperText?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  helperText,
}) => {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 ${
          checked ? 'bg-accent-blue' : 'bg-gray-300 dark:bg-brand-steel'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      {label && (
        <div className="flex flex-col select-none cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
          {helperText && <span className="text-xs text-gray-500">{helperText}</span>}
        </div>
      )}
    </div>
  );
};

export default Toggle;
