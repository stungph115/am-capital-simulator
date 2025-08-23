"use client";

interface RefreshingSpinnerProps {
    message?: string;
}

export default function RefreshingSpinner({
    message = "Actualisation des données en cours...",
}: RefreshingSpinnerProps) {
    return (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 dark:text-gray-300">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
            <span>{message}</span>
        </div>
    );
}
