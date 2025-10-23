interface UserStats {
    finished: number;
    playing: number;
    planned: number;
    dropped: number;
}

export interface User {
    email: string;
    steam_url: string;
    photo: string;
    stats: UserStats;
}

export const emptyUser = { email: "", steam_url: "", photo: "", stats: { finished: 0, playing: 0, planned: 0, dropped: 0 } }