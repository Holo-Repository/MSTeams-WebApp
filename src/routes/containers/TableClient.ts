import { 
    TableClient, 
    AzureSASCredential 
} from "@azure/data-tables";


// TODO: This should be an environment variable at least.
// TODO: A better authentication method should be used.
const account = "genericfluidstorage";
const sas = "?sv=2022-11-02&ss=t&srt=sco&sp=rwdlacu&se=2023-10-01T07:25:11Z&st=2023-08-28T23:25:11Z&spr=https&sig=7qZ3S1UYlC9dmYSrclzhJOnxOQAKHabYL4JKXFcKSD8%3D";
const tableName = "LocationIDtoFluidKey";


/**
 * Constructs a TableClient instance to connect to the Azure Table Storage
 * 
 * @returns TableClient
 */
export default function getTableClient() {
    return new TableClient(
        `https://${account}.table.core.windows.net`,
        tableName,
        new AzureSASCredential(sas)
    );
}