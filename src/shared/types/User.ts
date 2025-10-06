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
    isAdmin?: string;
}