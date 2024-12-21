import React from "react";
import styles from "./fullscreen.module.css";
import icon from "./fullscreen.png";


export default function FullscreenButton(): React.JSX.Element {

    const toggleFullscreen = () => {
        document.documentElement.requestFullscreen();
    }

    return (
        <img src={icon.src} className={styles.fullscreen} alt="Fullscreen" onClick={toggleFullscreen} />
    );
}