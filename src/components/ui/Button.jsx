import React from 'react';

const Button = ({ children, onClick, href, variant = "primary", className = "", type }) => {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition hover:opacity-90";
  const styles = {
    primary: "bg-blue-600 text-white",
    outline: "bg-white text-blue-700 ring-1 ring-blue-200",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
  };

  if (href) {
    return (
      <a href={href} className={`${base} ${styles[variant]} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button type={type || "button"} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

export { Button };