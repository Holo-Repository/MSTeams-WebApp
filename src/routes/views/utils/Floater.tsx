import { IFluidHandle } from "@fluidframework/core-interfaces";
import { useState } from "react";

function Floater(props: {handle : IFluidHandle}) {
    const [data, setData] = useState(undefined as unknown as { [key: string]: any } );

    let content = <p>Loading...</p>;

    if (data) 
    switch (data.type) {
        case "model":
            content = <p>Model</p>;
            break;
        default:
            content = <p>Unknown</p>;
            break;
    }
    
    return content;
}

export default Floater