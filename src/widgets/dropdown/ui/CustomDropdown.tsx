import React, { useState, useEffect, useRef } from "react";
import styles from "./CustomDropdown.module.css";

/**
 * Переиспользуемый компонент выпадающего списка.
 * @param {object[]} items - Массив элементов для списка. Каждый элемент должен иметь `id` и `label`.
 * @param {object} initialSelectedItem - Элемент, выбранный по умолчанию.
 * @param {function} onChange - Callback-функция, вызываемая при выборе элемента.
 */
interface ItemsProps {
    id: number;
    label: string;
    extra: React.ReactNode;
}

interface CustomDropdownProps {
    items: ItemsProps[];
    initialSelectedItem: string;
    onChange: (item: { id: number }) => void;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ items = [], initialSelectedItem, onChange }) => {
    // Определяем начальный выбранный элемент. Если он не передан, берем первый из списка.
    const [selectedItem, setSelectedItem] = useState<ItemsProps>();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Обработчик для закрытия списка при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!event.composedPath().includes(dropdownRef.current as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleItemClick = (item: ItemsProps) => {
        setSelectedItem(item);
        setIsOpen(false);
        // Вызываем переданную извне функцию onChange и передаем в нее выбранный элемент
        if (onChange) {
            onChange(item);
        }
    };

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className={styles.dropdownButton}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}>
                    <span className={styles.buttonLabel}>{initialSelectedItem ? initialSelectedItem : "Не выбрано"}</span>
                    {items.find((item) => item.label === initialSelectedItem)?.extra}
                </button>
            </div>

            {isOpen && (
                <div className={styles.dropdownMenu} role="listbox">
                    <ul className={styles.dropdownList}>
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className={styles.dropdownItem}
                                onClick={() => handleItemClick(item)}
                                role="option"
                                aria-selected={selectedItem === item}>
                                {item.label}
                                {item.extra}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
