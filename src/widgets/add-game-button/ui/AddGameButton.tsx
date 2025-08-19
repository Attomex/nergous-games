import { Button, ConfigProvider, Dropdown, MenuProps, Space } from "antd";
import { ButtonStyled, DropdownStyled } from "shared/ui";

interface AddGameButtonProps {
    openModalCreateGame: (value: boolean) => void;
    openModalAddGames: (value: boolean) => void;
}
const itemsGame: MenuProps["items"] = [
    { key: "1", label: "Создать игру" },
    { key: "2", label: "Добавить игры" },
];

export const AddGameButton: React.FC<AddGameButtonProps> = ({
    openModalCreateGame,
    openModalAddGames
}) => {
    const onClick: MenuProps["onClick"] = ({ key }) => {
        if (key === "1") openModalCreateGame(true);
        else if (key === "2") openModalAddGames(true);
    };
    return (
        <DropdownStyled>
                        <ButtonStyled>
                            <Dropdown menu={{ items: itemsGame, onClick }} trigger={["click"]}>
                                <Space>
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Button: {
                                                    colorBorder: "rgba(var(--third-color-rgb), 0.5)",
                                                },
                                            },
                                        }}
                                    >
                                        <Button>Добавить новые игры</Button>
                                    </ConfigProvider>
                                </Space>
                            </Dropdown>
                        </ButtonStyled>
                    </DropdownStyled>
    );
};