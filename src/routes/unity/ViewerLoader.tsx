import { useEffect, useState } from 'react';
import { IFluidContainer, SharedMap } from 'fluid-framework';

import ContainerManager from '../containers/ContainerManager';


// Declare the props
export interface ViewerLoaderProps {
    containerManager: ContainerManager;
    containerId: string;
}

function ViewerLoader(props: ViewerLoaderProps) {
    const [fluidObjects, setFluidObjects] = useState<{ container: IFluidContainer, floaters: SharedMap } | undefined>(undefined);

    useEffect(() => {(async () => {
        // Connect to the active Fluid container
        const { container } = await props.containerManager.getContainer(props.containerId);
        const floaters = container.initialObjects.floaters as SharedMap;
        setFluidObjects({ container, floaters });
    })()}, []);

    async function loadModel() {
        // Generate a dynamic map object
        const floater = await fluidObjects!.container.create(SharedMap);
        // Add the model to the map
        floater.set('type','model');
        floater.set('pos', { x: 0, y: 0 });
        
        // Generate a random ID for the floater
        let randomId;
        do {
            randomId = Math.floor(Math.random() * 1000000).toString();
        } while (fluidObjects!.floaters.has(randomId));
        fluidObjects!.floaters.set(randomId, floater.handle);
    }

    // Display a button to load a model
    return (
        <div>
            {!fluidObjects
            ? <p>Loading...</p>
            : <button onClick={loadModel}>Load Model</button>}
        </div>
    );
}

export default ViewerLoader;