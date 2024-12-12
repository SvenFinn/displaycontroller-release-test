import { useEffect, useState } from "react";

export default function Clock({ locale = "de-DE" }: { locale: string }) {
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

    return <div>{time}</div>;
}