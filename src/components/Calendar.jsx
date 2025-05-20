import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function Calendar({ className, ...props }) {
    return (
        <div className={`p-3 ${className}`}>
            <DayPicker
                className="rounded-md border bg-white dark:bg-gray-800"
                {...props}
            />
        </div>
    );
}