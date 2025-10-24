import { Dropdown } from "widgets/dropdown";
import type { DropdownOption } from "shared/types";
import { EyeIcon, EditIcon } from "widgets/icons";
import { Modal } from "widgets/modal";
import "./TestPage.css";
import { useState } from "react";

export const TestPage = () => {
    const [open, setOpen] = useState(false);

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
                />
            </div>
            <button onClick={() => setOpen(true)}>Открыть модалку</button>
            <div style={{ fontSize: "10rem", wordBreak: "break-word" }}>dskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdjdskjdjhsdj hsjh dsjhd jshdjhs djhaskj dhweiu hashfj sjdhf ajhsgjk fhsdkjf hsjkf jskhf jshf</div>
            <Modal name="test" title="Modal title" open={open} onClose={() => setOpen(false)} onOk={() => setOpen(false)}>Modal content</Modal>
            
        </>
    );
};
