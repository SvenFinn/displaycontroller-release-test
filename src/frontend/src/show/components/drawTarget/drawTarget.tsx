import { DrawTargetOptions } from "@shared/screens/drawTarget";
import Ranges from "./ranges";
import { Provider } from "react-redux";
import { store } from "./ranges-store/store"
import { setRange } from "./ranges-store/rangesReducer";
import RangesEvents from "../../../components/serverEvents/ranges"
import Header from "./header";

export interface DrawTargetProps {
    options: DrawTargetOptions;
}

export default function DrawTarget({ options }: DrawTargetProps): JSX.Element {
    const ranges = options.ranges.flat();
    return (
        <div style={{ height: "100%", fontSize: "100vh", userSelect: "none" }}>
            <Provider store={store}>
                <RangesEvents action={setRange} ranges={ranges} />
                <Header />
                <Ranges options={options} />
            </Provider>
        </div>
    )
}