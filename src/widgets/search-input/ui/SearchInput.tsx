import React from "react";
import "./SearchInput.css";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    width?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Поиск...", width = 300 }) => {
    return (
        <div className="search-input-wrapper" style={{ maxWidth: width, width: width, height: 34 }}>
            <input id="search-input" className="search-input" type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
            {value && (
                <button className="search-clear-btn" onClick={() => onChange("")}>
                    ×
                </button>
            )}
        </div>
    );
};
