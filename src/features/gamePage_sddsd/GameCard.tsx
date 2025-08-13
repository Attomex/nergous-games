import React from "react";
import style from "./GameCard.module.css";

interface GameInfo {
    id: number;
    title: string;
    preambula: string;
    image: string;
    developer: string;
    publisher: string;
    year: string;
    genre: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface GameCardProps {
    games: GameInfo[];
}

const GameCard = ({ games }: GameCardProps) => {
    return (
        <div>
            {games.map((gameInfo) => {
                return (
                    <div className={style.game_card} key={gameInfo.id}>
                        <div className={style.game_card__title}>{gameInfo.title}</div>
                        <div className={style.game_card__image}>
                            <img src={gameInfo.image} alt={gameInfo.title} />
                        </div>

                        <div className={style.game_card__info}>
                            <div className={style.year_genre}>
                                Год: {gameInfo.year}<br />
                                Жанр: {gameInfo.genre}
                            </div>
                            <div className={style.dev_pub}>
                                Разработчик: {gameInfo.developer} <br />
                                Издатель: {gameInfo.publisher}
                            </div> 
                        </div>

                        <div className={style.game_card__description}>
                            {gameInfo.preambula}
                        </div>

                        <button className={style.game_card__status}>
                            {gameInfo.status}
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default GameCard;