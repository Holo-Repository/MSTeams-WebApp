import { 
    TableClient, 
    AzureSASCredential 
} from "@azure/data-tables";


// TODO: This should be an environment variable at least.
// TODO: A better authentication method should be used.
const account = "genericfluidstorage";
const sas = "?sv=2022-11-02&ss=t&srt=o&sp=rwlacu&se=2023-10-01T01:21:22Z&st=2023-07-20T17:21:22Z&spr=https&sig=LYcEp%2Bo%2BYximphpUBqlaA%2FsPgZAO8QiyeVQeH8oaHMM%3D";
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