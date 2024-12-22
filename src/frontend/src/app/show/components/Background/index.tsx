"use client";

import image from "./background.png"
import style from "./background.module.css"
import { useAppSelector } from "../Screens/store/store"

export default function Background() {
    const screens = useAppSelector((state) => state.screens);
    const isUnavailable = screens.every((screen) => screen === null);
    if (!isUnavailable) {
        return <div className={style.whiteBackground}></div>
    }
    return (
        <div className={style.background}>
            <img src={image.src} alt="Background" className={style.background} />
        </div>
    )
}