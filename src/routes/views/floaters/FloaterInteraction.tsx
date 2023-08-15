import { Toolbar, ToolbarButton, ToolbarDivider } from "@fluentui/react-components";
import {
    Delete24Regular as Delete,
    Drag24Regular as Drag,
    ArrowDownload24Regular as Export,
    PaddingTop24Filled as ToFront,
    PaddingDown24Filled as ToBottom,
} from "@fluentui/react-icons";


export interface FloaterInteractionProps {
    delete : () => void;
    drag : (event: any) => void;
    lastEdit: (reverse?: boolean) => void;
    export?: () => void;
}

function FloaterInteraction(props: FloaterInteractionProps) {
    return (
        <Toolbar size="small" >
            <ToolbarButton icon={<Drag />} title="Drag" as="button" appearance="subtle" draggable onDrag={props.drag}/>
            <ToolbarButton icon={<ToFront />} title="To Front" as="button" appearance="subtle" onClick={() => {props.lastEdit()}}/>
            <ToolbarButton icon={<ToBottom />} title="To Back" as="button" appearance="subtle" onClick={() => {props.lastEdit(true)}}/>
            {props.export && <ToolbarButton icon={<Export />} title="Export" as="button" appearance="subtle" onClick={props.export}/>}
            <ToolbarDivider />
            <ToolbarButton icon={<Delete />} title="Delete" as="button" appearance="subtle" onClick={props.delete}/>
        </Toolbar>
    );
} 

export default FloaterInteraction