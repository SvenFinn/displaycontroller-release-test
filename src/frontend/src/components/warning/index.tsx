import styles from "./warning.module.css";
import { ReactNode } from "react";

interface WarningProps {
    children?: ReactNode;
    level?: number;
}

export default function Warning({ children, level = 1000 }: WarningProps): JSX.Element {
    return (
        <div className={styles.warning} style={{
                zIndex: level
            }}>
            {children}
        </div>
    );
}