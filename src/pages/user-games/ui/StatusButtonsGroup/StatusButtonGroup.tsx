import { Button } from "antd";
import { ButtonStyled } from "shared/ui";

interface StatusButtonsGroupProps {
    status: string;
    setStatus: (status: string) => void;
    setPage: (page: number) => void;
}

export const StatusButtonsGroup: React.FC<StatusButtonsGroupProps> = ({ status, setStatus, setPage }) => {
    return (
        <ButtonStyled>
            <Button
                style={{
                    backgroundColor: status === "" ? "var(--accent-color)" : "var(--primary-color)",
                    color: status === "" ? "white" : "var(--text-color)",
                }}
                onClick={() => {
                    setStatus("");
                    setPage(1);
                }}
            >
                Все
            </Button>
            <Button
                style={{
                    backgroundColor: status === "finished" ? "var(--accent-color)" : "var(--primary-color)",
                    color: status === "finished" ? "white" : "var(--text-color)",
                }}
                onClick={() => {
                    setStatus("finished");
                    setPage(1);
                }}
            >
                Завершенные
            </Button>
            <Button
                style={{
                    backgroundColor: status === "planned" ? "var(--accent-color)" : "var(--primary-color)",
                    color: status === "planned" ? "white" : "var(--text-color)",
                }}
                onClick={() => {
                    setStatus("planned");
                    setPage(1);
                }}
            >
                Запланировано
            </Button>
            <Button
                style={{
                    backgroundColor: status === "playing" ? "var(--accent-color)" : "var(--primary-color)",
                    color: status === "playing" ? "white" : "var(--text-color)",
                }}
                onClick={() => {
                    setStatus("playing");
                    setPage(1);
                }}
            >
                В процессе
            </Button>
            <Button
                style={{
                    backgroundColor: status === "dropped" ? "var(--accent-color)" : "var(--primary-color)",
                    color: status === "dropped" ? "white" : "var(--text-color)",
                }}
                onClick={() => {
                    setStatus("dropped");
                    setPage(1);
                }}
            >
                Брошено
            </Button>
        </ButtonStyled>
    );
};
