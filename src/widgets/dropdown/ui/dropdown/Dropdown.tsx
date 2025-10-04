import { useEffect, useRef, useState } from "react";
import dropdownStyles from "./Dropdown.module.css";
import type { DropdownDivider, DropdownOption, DropdownProps, DropdownItem } from "shared/types";

const isDivider = (o: DropdownOption): o is DropdownDivider => {
    return (o as DropdownDivider).type === "divider";
};

export const Dropdown: React.FC<DropdownProps> = ({
    placeholder = "",
    options,
    buttonStyle = "default",
    buttonIcon,
    onClick,
    styles,
    className = "",
}) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<"left" | "right">("right");

    const handleToggle = () => {
        if (!isOpen) {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;

                if (rect.left + rect.width / 2 > viewportWidth / 2) {
                    setPosition("right");
                } else {
                    setPosition("left");
                }
            }
        }

        setIsOpen(!isOpen);
    };

    const handleClick = (item: DropdownItem, event: React.MouseEvent<HTMLLIElement>) => {
        setIsOpen(false);
        onClick?.({
            key: item.id,
            label: item.label,
            value: item.value,
            domEvent: event,
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    let listClasses = `${dropdownStyles["dropdown-list"]} ${
        position === "left" ? dropdownStyles["position-left"] : dropdownStyles["position-right"]
    } ${isOpen ? dropdownStyles["open"] : ""}`;

    let toggleClasses = `${dropdownStyles["dropdown-toggle"]} ${
        (buttonStyle === "shaped" && placeholder === "") || (buttonIcon && placeholder === "") ? dropdownStyles["shaped"] : dropdownStyles["default"]
    } ${className}`;

    return (
        <div className={dropdownStyles["dropdown-wrapper"]} ref={rootRef}>
            <button className={toggleClasses} onClick={handleToggle} ref={buttonRef} style={styles}>
                {buttonIcon && <span className={dropdownStyles["icon"]}>{buttonIcon}</span>}
                {placeholder}
            </button>
            <ul className={listClasses}>
                {options.map((item, index) => {
                    if (isDivider(item)) {
                        return <li key={`divider-${index}`} className={dropdownStyles["dropdown-divider"]}></li>;
                    }
                    return (
                        <li
                            key={item.id}
                            className={
                                dropdownStyles["dropdown-item"] +
                                " " +
                                (item?.active ? dropdownStyles["active"] : "") +
                                " " +
                                (item?.danger ? dropdownStyles["danger"] : "")
                            }
                            value={item.value}
                            onClick={(e) => handleClick(item, e)}
                        >
                            {item.icon && <span className={dropdownStyles["icon-left"] + " " + dropdownStyles["icon"]}>{item.icon}</span>}
                            <span className={dropdownStyles["label"]}>{item.label}</span>
                            {item?.extra && <span className={dropdownStyles["icon-right"] + " " + dropdownStyles["icon"]}>{item.extra}</span>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
