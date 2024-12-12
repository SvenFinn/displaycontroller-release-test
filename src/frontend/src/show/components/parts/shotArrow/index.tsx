import { Hit } from "@shared/ranges/hits";
import arrowImage from "./arrow.png";


export default function ShotArrow({ hit, className }: { hit: Hit | null, className: string }): JSX.Element {

    if (!hit) return <></>;
    const angle = -Math.atan2(hit.y, hit.x) + Math.PI / 2;
    return (
        <img src={arrowImage} className={className} style={{
            transform: `rotate(${angle}rad)`
        }} />
    )
}
