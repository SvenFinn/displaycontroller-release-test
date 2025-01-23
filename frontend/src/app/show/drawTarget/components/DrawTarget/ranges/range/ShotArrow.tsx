import ShotArrow from "../../../../../components/ShotArrow";
import { useAppSelector } from "../../ranges-store/store";
import styles from "./range.module.css";

export default function ShotArrowW({ id }: { id: number }): React.JSX.Element {
    const range = useAppSelector((state) => state.ranges[id]);
    return (
        <ShotArrow hitIndex={-1} className={styles.shotArrow} range={range} />
    )
}