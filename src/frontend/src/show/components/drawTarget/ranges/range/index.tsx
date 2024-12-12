import styles from "./range.module.css"
import RangeNr from "./rangeNr"
import RangeName from "./name"
import { useAppSelector } from "../../ranges-store/store"
import CurrentHit from "./currentHit"
import DrawRange from "./drawRange"
import SeriesList from "./seriesList"
import Total from "./total"

interface DrawTargetRangeProps {
    highlightAssign: boolean,
    id: number
}

export default function Range({ highlightAssign, id }: DrawTargetRangeProps): JSX.Element {
    const range = useAppSelector((state) => state.ranges[id]);
    if (highlightAssign) return <></>
    if (!range || !range.active) return (
        <div></div>
    )
    return (
        <div className={styles.range}>
            <RangeNr id={id} />
            <RangeName id={id} />
            <CurrentHit id={id} />
            <DrawRange id={id} />
            <SeriesList id={id} />
            <Total id={id} />
        </div>
    )
}