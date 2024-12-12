import { getHitString, getRoundName } from "../../../../lib/ranges";
import { useAppSelector } from "../../ranges-store/store"
import styles from "./range.module.css"
import ShotArrowW from "./ShotArrow";

interface CurrentHitProps {
    id: number
}

export default function CurrentHit({ id }: CurrentHitProps): JSX.Element {
    const range = useAppSelector((state) => state.ranges[id]);
    if (!range?.active) return <></>
    const hit = getHitString(range) || getRoundName(range);
    if (!hit) return <></>
    return (
        <div className={styles.currentShot}>
            <ShotArrowW id={id} />
            {hit}
        </div>
    )
}