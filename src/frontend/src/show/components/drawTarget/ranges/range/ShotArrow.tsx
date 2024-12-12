import ShotArrow from "../../../parts/shotArrow";
import { useAppSelector } from "../../ranges-store/store";
import styles from "./range.module.css";

export default function ShotArrowW({ id }: { id: number }): JSX.Element {
    const range = useAppSelector((state) => state.ranges[id]);
    if (!range) return <></>
    if (!range.active) return <></>
    if (!range.hits) return <></>
    const hits = range.hits[range.round];
    if (!hits) return <></>
    const hit = hits[hits.length - 1];
    if (!hit) return <></>
    return (
        <ShotArrow hit={hit} className={styles.shotArrow} />
    )
}