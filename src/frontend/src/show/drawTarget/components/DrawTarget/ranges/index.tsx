import { DrawTargetProps } from "../drawTarget";
import styles from "./ranges.module.css";
import Range from "./range";

export default function Ranges({ options }: DrawTargetProps): JSX.Element {
    const ranges = options.ranges;
    let rows = 0;
    let columns = 0;
    if (Array.isArray(ranges[0])) {  // Two-dimensional array
        rows = ranges.length;
        columns = ranges[0].length;
    } else {
        rows = Math.floor(Math.sqrt((ranges.length - 1) / 3)) + 1;
        columns = Math.ceil(ranges.length / rows);
    }
    const flatRanges = ranges.flat(1);
    return (
        <div className={styles.drawTargetRanges} style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            fontSize: `${100 / rows}%`
        }}>
            {flatRanges.map((range: number) => (
                <Range id={range} highlightAssign={options.highlightAssign} key={range} />
            ))}
        </div>
    )
}