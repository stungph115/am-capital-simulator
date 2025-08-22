"use client";

import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export function Textarea({ className = "", ...props }: Props) {
  return (
    <textarea
      {...props}
      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#121f3e] ${className}`}
    />
  );
}
