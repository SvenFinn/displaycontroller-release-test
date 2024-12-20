import { useEffect, useState } from "react";
import styles from "./clock.module.css";

export default function Clock({ locale }: { locale?: string }): JSX.Element {
    locale = locale || "de-DE";
    const [time, setTime] = useState<string>(new Date().toLocaleTimeString(locale));

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date().toLocaleTimeString(locale);
            if (date !== time) {
                setTime(date);
            }
        }, 100);
        return () => clearInterval(interval);
    });

    return (
        <div className={styles.clock}>
            {time}
        </div>);
}