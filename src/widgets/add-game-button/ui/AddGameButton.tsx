import React from "react";
import "./AddGameButton.css";
import { Dropdown } from "widgets/dropdown";
import { DropdownProps } from "shared/types";

interface AddGameButtonProps {
    menuItems: DropdownProps["options"];
    placeholder: string;
    openModalCreateGame: (value: boolean) => void;
    openModalAddGames: (value: boolean) => void;
}

export const AddGameButton: React.FC<AddGameButtonProps> = ({ menuItems, placeholder, openModalCreateGame, openModalAddGames }) => {
    const handleItemClick: DropdownProps["onClick"] = ({ key }) => {
        if (key === 1) openModalCreateGame(true);
        else if (key === 2) openModalAddGames(true);
    };

    return (
        <div className="add-game-dropdown">
            <Dropdown options={menuItems} placeholder={placeholder} onClick={handleItemClick} className="add-game-button" />
        </div>
    );
};
