import { 
    TableClient, 
    AzureSASCredential 
} from "@azure/data-tables";

const account = "genericfluidstorage";
const sas = "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2023-07-20T04:11:49Z&st=2023-07-19T20:11:49Z&spr=https&sig=NPxsDy81gU7VyP7nkZ0hNwoq6PmrWGqsczVpFV7gP4g%3D";
const tableName = "LocationIDtoFluidKey";

export default function getTableClient() {
    return new TableClient(
        `https://${account}.table.core.windows.net`,
        tableName,
        new AzureSASCredential(sas)
    );
}