"use client";
import { useEffect, useState } from "react";

interface SliderInputProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
   /*  withNumber?: boolean; */
}

export default function SliderInput({
    label,
    min,
    max,
    step = 1,
    value,
    onChange,

}: SliderInputProps) {
    const [formatted, setFormatted] = useState<string>(value.toString());

    // format client-side only
    useEffect(() => {
        setFormatted(value.toLocaleString());
    }, [value]);

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium">{label}</label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full"
            />
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="border rounded px-2 py-1 w-32"
            />
            <div className="text-sm text-gray-500 mt-1">
                {formatted}{" "}
                {label.includes("m²")
                    ? "m²"
                    : label.includes("€")
                        ? "€"
                        : ""}
            </div>
        </div>
    );
}
