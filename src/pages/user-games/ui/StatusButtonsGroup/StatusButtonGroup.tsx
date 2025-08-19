import { Button } from "antd";
import { ButtonStyled } from "shared/ui";

interface StatusButtonsGroupProps {
    status: string;
    setStatus: (status: string) => void;
    setPage: (page: number) => void;
}

export const StatusButtonsGroup: React.FC<StatusButtonsGroupProps> = ({ status, setStatus, setPage }) => {
    const buttons: { title: string; status: string }[] = [
        {
            title: "Все",
            status: "",
        },
        {
            title: "Завершенные",
            status: "finished",
        },
        {
            title: "Запланировано",
            status: "planned",
        },
        {
            title: "В процессе",
            status: "playing",
        },
        {
            title: "Отложено",
            status: "dropped",
        },
    ]

    return (
        <ButtonStyled>
            {buttons.map((button) => (
                <Button
                    key={button.status}
                    style={{
                        backgroundColor: status === button.status ? "var(--accent-color)" : "var(--primary-color)",
                        color: status === button.status ? "white" : "var(--text-color)",
                    }}
                    onClick={() => {
                        setStatus(button.status);
                        setPage(1);
                    }}
                >
                    {button.title}
                </Button>
            ))}
        </ButtonStyled>
    );
};
