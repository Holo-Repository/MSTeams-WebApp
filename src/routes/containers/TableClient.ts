import { 
    TableClient, 
    AzureSASCredential 
} from "@azure/data-tables";

const account = "genericfluidstorage";
const sas = "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2023-07-17T21:40:59Z&st=2023-07-17T13:40:59Z&spr=https&sig=fwhus%2B8YlNVfdCPzjrb6acJa2rXGk8bwVdFFJNgv%2FN8%3D";
const tableName = "LocationIDtoFluidKey";

export default function getTableClient() {
    return new TableClient(
        `https://${account}.table.core.windows.net`,
        tableName,
        new AzureSASCredential(sas)
    );
}