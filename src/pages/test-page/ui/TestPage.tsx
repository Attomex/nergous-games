import { Dropdown } from "widgets/dropdown";
import type { DropdownOption, DropdownProps } from "shared/types";
import { EyeIcon, EditIcon } from "widgets/icons";

export const TestPage = () => {
    const handleDropdownClick: DropdownProps["onClick"] = ({ key }) => {
        console.log(key);
    };

    const options: DropdownOption[] = [
        {
            id: 1,
            label: "ДЛИННЫЙ ",
            value: "value1",
            extra: <EditIcon />,
            icon: <EyeIcon />,
        },
        {
            id: 2,
            label: "Option 2",
            value: "value2",
        },
    ];

    return (
        <>
            <div style={{ display: "flex", justifyContent: "right" }}>
                <Dropdown
                    placeholder="Бла бла бла"
                    // buttonIcon={<EyeIcon />}
                    options={options}
                    onClick={handleDropdownClick}
                />
            </div>
            <div style={{ fontSize: "10rem" }}>dskjdjhsdj hsjh dsjhd jshdjhs djhaskj dhweiu hashfj sjdhf ajhsgjk fhsdkjf hsjkf jskhf jshf</div>
        </>
    );
};
