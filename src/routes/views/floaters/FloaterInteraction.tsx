import { Toolbar, ToolbarButton, ToolbarDivider } from "@fluentui/react-components";
import {
    Pin12Regular as Pin,
    Delete12Regular as Delete,
    Drag24Regular as Drag,
} from "@fluentui/react-icons";


export interface FloaterInteractionProps {
    delete : () => void;
    drag : (event: any) => void;
}

function FloaterInteraction(props: FloaterInteractionProps) {
    return (
        <Toolbar size="small" >
            <ToolbarButton icon={<Drag />} title="Drag" as="button" appearance="subtle" draggable onDrag={props.drag}/>
            <ToolbarDivider />
            <ToolbarButton icon={<Pin />} title="Pin" as="button" appearance="subtle"/>
            <ToolbarDivider />
            <ToolbarButton icon={<Delete />} title="Delete" as="button" appearance="subtle" onClick={props.delete}/>
        </Toolbar>
    );
} 

export default FloaterInteraction