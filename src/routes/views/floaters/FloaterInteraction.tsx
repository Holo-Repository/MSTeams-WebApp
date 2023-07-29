import {
    Pin12Filled as Pin,
    Delete12Filled as Delete,
} from "@fluentui/react-icons";

import styles from '../../../styles/FloaterInteraction.module.css'
import { Text } from "@fluentui/react-components";


function FloaterInteraction(props: {delete : () => void}) {
    return <div className={styles.body}>
                <Text className={styles.pin} onClick={() => {}}><Pin /></Text>
                <Text className={styles.handle}></Text>
                <Text className={styles.delete} onClick={props.delete}><Delete /></Text>
            </div>
} 

export default FloaterInteraction