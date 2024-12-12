import { Range } from "@shared/ranges";
import { useEffect, useRef, useState } from "react";
import Rings from "./rings";
import Hits from "./hits";
import CountsCorner from "./CountsCorner";

interface DrawRangeProps {
    range: Range
    className?: string
}

export default function DrawRange({ range, className }: DrawRangeProps): JSX.Element {
    const ref = useRef<SVGSVGElement>(null);
    const [size, setSize] = useState<[number, number]>([0, 0]);
    const [strokeWidth, setStrokeWidth] = useState<number>(0);


    useEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver(handleResize);
        observer.observe(ref.current);
        function handleResize() {
            if (!ref.current) return;
            const newSize = getSize(range, ref.current);
            if (newSize !== size) {
                setSize(newSize);
                const strokeWidth = Math.round(newSize[0] / ref.current.clientWidth);
                setStrokeWidth(isNaN(strokeWidth) ? 0 : strokeWidth);
            }
        }
        return () => observer.disconnect();
    }, [range, size]);

    if (!range.active) return <></>
    if (!range.discipline) return <></>
    const round = range.discipline.rounds[range.round];
    if (!round) return <></>

    const layout = range.discipline.layouts[round.layoutId];
    if (!layout) return <></>

    const viewBox = `${-size[0] / 2} ${-size[1] / 2} ${size[0]} ${size[1]}`;

    return (
        <svg ref={ref} className={className} viewBox={viewBox} strokeWidth={strokeWidth}>
            <Rings layout={layout} color={range.discipline.color} />
            <Hits range={range} />
            <CountsCorner counts={round.counts} size={size} />
        </svg>
    )
}

function getSize(range: Range, ref: SVGSVGElement): [number, number] {
    if (ref.clientHeight === 0 || ref.clientWidth === 0) return [0, 0];
    if (!range.active) return [0, 0];
    return getSizeInt(range, ref).map(size => Math.round(size * 100)) as [number, number];
}


function getSizeInt(range: Range, ref: SVGSVGElement): [number, number] {
    if (!range.active) return [0, 0];
    if (!range.discipline) return [0, 0];
    const gauge = range.discipline.gauge;
    const round = range.discipline.rounds[range.round];
    if (!round) return [0, 0];
    if (round.zoom.mode === "auto") {
        if (!range.hits) return [0, 0];
        const hits = range.hits[range.round];
        if (!hits || hits.length == 0) {
            const layout = range.discipline.layouts[round.layoutId];
            if (!layout) return [0, 0];
            const diameter = layout[layout.length - 1].diameter + gauge * 1.1;
            if (diameter === 0) return [0, 0];
            const diameterRelative = diameter / Math.min(ref.clientWidth, ref.clientHeight)
            return [diameterRelative * ref.clientWidth, diameterRelative * ref.clientHeight];
        }
        const largestDimensions = [Math.max(...hits.map(hit => Math.abs(hit.x) + gauge * 1.1)),
        Math.max(...hits.map(hit => Math.abs(hit.y) + gauge * 1.1)) / ref.clientHeight * ref.clientWidth];
        const largestW = Math.max(...largestDimensions) * 2;
        return [largestW, largestW / ref.clientWidth * ref.clientHeight];
    } else if (round.zoom.mode === "fixed") {
        const zoom = round.zoom;
        const layout = range.discipline.layouts[round.layoutId];
        if (!layout) return [0, 0];
        const ring = layout.find(ring => ring.value === zoom.value);
        if (!ring) return [0, 0];
        const diameter = ring.diameter + gauge * 1.1;
        const diameterRelative = diameter / Math.min(ref.clientWidth, ref.clientHeight);
        return [diameterRelative * ref.clientWidth, diameterRelative * ref.clientHeight];
    } else if (round.zoom.mode === "none") {
        const layout = range.discipline.layouts[round.layoutId];
        if (!layout) return [0, 0];
        const diameter = layout[0].diameter + gauge * 1.1;
        const diameterRelative = diameter / Math.min(ref.clientWidth, ref.clientHeight);
        return [diameterRelative * ref.clientWidth, diameterRelative * ref.clientHeight];
    } else {
        return [0, 0];
    }
}