import { faArrowDownAZ, faArrowDownZA } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, SelectProps } from "antd";
import { AscIcon, DescIcon } from "widgets/icons";
import { Sort } from "shared/types";
import { SelectStyled } from "shared/ui";

interface SortButtonProps {
    value: Sort;
    onChange: (sort: Sort) => void;
    onPageReset: (page: number) => void;
}

export const SortButton: React.FC<SortButtonProps> = ({ value, onChange, onPageReset }) => {
    const options: SelectProps["options"] = [
        { label: "Название", value: JSON.stringify({ field: "title", order: "asc" }), icon: <FontAwesomeIcon icon={faArrowDownAZ} /> }, // по возрастанию
        { label: "Название", value: JSON.stringify({ field: "title", order: "desc" }), icon: <FontAwesomeIcon icon={faArrowDownZA} /> }, // по убыванию
        { label: "Год", value: JSON.stringify({ field: "year", order: "desc" }), icon: <DescIcon /> }, // по убыванию
        { label: "Год", value: JSON.stringify({ field: "year", order: "asc" }), icon: <AscIcon /> }, // по возрастанию
        { label: "Приоритет", value: JSON.stringify({ field: "priority", order: "desc" }), icon: <DescIcon /> }, // по убыванию
        { label: "Приоритет", value: JSON.stringify({ field: "priority", order: "asc" }), icon: <AscIcon /> }, // по возрастанию
    ];

    const handleChange = (v: string) => {
        const newSort = JSON.parse(v) as Sort;
        onChange(newSort);
        onPageReset(1);
    };

    return (
        <SelectStyled>
            <Select value={JSON.stringify(value)} onChange={handleChange} style={{ width: 200 }} optionLabelProp="label">
                {options.map((option) => (
                    <Select.Option
                        key={option.value}
                        value={option.value}
                        label={
                            <span>
                                {option.icon} {option.label}
                            </span>
                        }
                    >
                        <span>
                            {option.icon} {option.label}
                        </span>
                    </Select.Option>
                ))}
            </Select>
        </SelectStyled>
    );
};
