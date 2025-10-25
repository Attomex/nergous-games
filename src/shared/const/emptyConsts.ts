import { GameInfo } from "shared/types";

export const EMPTY_GAME_INFO: GameInfo = {
    id: 0,
    title: "",
    preambula: "",
    image: "",
    developer: "",
    publisher: "",
    year: "",
    genre: "",
    url: "",
    status: "",
    priority: 0,
} as const;

export const EMPTY_USER = { email: "", steam_url: "", photo: "", stats: { finished: 0, playing: 0, planned: 0, dropped: 0 } };
