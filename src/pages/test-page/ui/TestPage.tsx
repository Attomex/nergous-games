import React from "react";
import "./TestPage.css";
import { StatusModal } from "features/add-games/ui/StatusModal";

export const TestPage = () => {
    const [isOpen, setIsOpen] = React.useState(false);


    return (
        <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setIsOpen(true)}>dsds</button>
            <StatusModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};
