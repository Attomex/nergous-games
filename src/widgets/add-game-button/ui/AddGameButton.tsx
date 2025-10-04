import React from "react";
import "./AddGameButton.css";
import { Dropdown } from "widgets/dropdown";
import { DropdownProps } from "shared/types";

interface AddGameButtonProps {
    openModalCreateGame: (value: boolean) => void;
    openModalAddGames: (value: boolean) => void;
}

export const AddGameButton: React.FC<AddGameButtonProps> = ({ openModalCreateGame, openModalAddGames }) => {
    const handleItemClick: DropdownProps["onClick"] = ({key}) => {
        if (key === 1) openModalCreateGame(true);
        else if (key === 2) openModalAddGames(true);
    };

    const menuItems: DropdownProps["options"] = [
        {
            id: 1,
            label: "Добавить новую игру",
        },
        {
            id: 2,
            label: "Добавить несколько игр",
        },
    ];

    return (
        <div className="add-game-dropdown">
            <Dropdown options={menuItems} placeholder="Добавить игру" onClick={handleItemClick} className="add-game-button" />
        </div>
    );
};
