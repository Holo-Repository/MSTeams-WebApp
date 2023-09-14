import { 
    TableClient, 
    AzureSASCredential 
} from "@azure/data-tables";


const account = process.env.REACT_APP_STORAGE_NAME;
const sas = process.env.REACT_APP_TABLE_SAS_TOKEN;
const tableName = process.env.REACT_APP_TABLE_NAME;


/**
 * Constructs a TableClient instance to connect to the Azure Table Storage
 * 
 * @returns TableClient
 */
export default function getTableClient() {
    if (!account || !sas || !tableName)
        throw raiseGlobalError(new Error('Azure Table Storage not configured'));

    return new TableClient(
        `https://${account}.table.core.windows.net`,
        tableName,
        new AzureSASCredential('?' + sas)
    );
}