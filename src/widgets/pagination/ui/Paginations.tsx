import React, { useState } from "react";
import "./Paginations.css";
import { useTranslation } from "react-i18next";

interface PaginationProps {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    onChange: (page: number) => void;
}

const PrevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
    </svg>
);

const NextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path
            fillRule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
        />
    </svg>
);


export const Paginations: React.FC<PaginationProps> = ({ totalItems, currentPage, pageSize, onChange }) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const [jumpPage, setJumpPage] = useState<string>("");
    const { t } = useTranslation("translation");

    const handleJump = () => {
        const page = Math.max(1, Math.min(totalPages, Number(jumpPage)));
        if (!isNaN(page)) {
            onChange(page);
            setJumpPage("");
        }
    };

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination-wrapper">
            <button className="pagination-btn arrow" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)}>
                <PrevIcon />
            </button>

            {pages.map((page) => (
                <button key={page} className={`pagination-btn ${page === currentPage ? "active" : ""}`} onClick={() => onChange(page)}>
                    {page}
                </button>
            ))}

            <button className="pagination-btn arrow" disabled={currentPage === totalPages} onClick={() => onChange(currentPage + 1)}>
                <NextIcon />
            </button>

            <div className="pagination-jump">
                <label htmlFor="jump-page" className="pagination-jump-label">
                    {t("pagination.text")}
                </label>
                <div className="pagination-jump-input-wrapper">
                    <input
                        id="jump-page"
                        type="number"
                        value={jumpPage}
                        min={1}
                        max={totalPages}
                        placeholder="№"
                        onChange={(e) => setJumpPage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleJump()}
                    />
                    <button className="pagination-jump-btn" onClick={handleJump}>
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};
