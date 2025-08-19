export const gameStatuse: { [key: string]: string } = {
    "planned": "В планах",
    "playing": "В процессе",
    "finished": "Завершен",
    "dropped": "Брошено"
};

export type GameStatusKey = keyof typeof gameStatuse;