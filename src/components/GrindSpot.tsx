import { Component } from "solid-js";
import { GrindSpot } from "../App";

interface GrindSpotProps {
    grindSpot: GrindSpot;
}

const GrindSpotComponent: Component<GrindSpotProps> = (props) => {
    return (
        <div class="flex rounded-md bg-base-200">
            <p class="text-xl">{props.grindSpot.name}</p>
        </div>
    )
}

export default GrindSpotComponent;
