import ScaleText from "../../../../../components/ScaleText";
import styles from "./range.module.css";
import { useAppSelector } from "../../ranges-store/store";

export default function Name({ id }: { id: number }): React.JSX.Element {
    const range = useAppSelector((state) => state.ranges[id]);
    if (!range) return <></>;
    if (!range.active) return <></>;
    const name = range.shooter ? `${range.shooter.firstName} ${range.shooter.lastName}` : "- - - Frei - - -";
    return (
        <div className={styles.rangeName}>
            <ScaleText text={name} />
        </div>
    )
}