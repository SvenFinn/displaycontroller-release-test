import styles from "./fullscreen.module.css";
import icon from "./fullscreen.png";


export default function FullscreenButton(): JSX.Element {

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    return (
        <img src={icon} className={styles.fullscreen} alt="Fullscreen" onClick={toggleFullscreen} />
    );
}