param storageSku string

param storageBaseName string
param storageName string = storageBaseName

param ASPBaseName string
param ASPName string = ASPBaseName

param tableBaseName string
param tableName string = tableBaseName

param now string = utcNow()

param functionBaseName string
param functionName string = functionBaseName

param location string = resourceGroup().location

// Generic Azure Storage
resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  kind: 'StorageV2'
  location: location
  name: storageName
  properties: { supportsHttpsTrafficOnly: true }
  sku: { name: storageSku }
}
output REACT_APP_STORAGE_NAME string = storage.name

// Outputs
var siteDomain = replace(replace(storage.properties.primaryEndpoints.web, 'https://', ''), '/', '')
// The output will be persisted in .env.{envName}. Visit https://aka.ms/teamsfx-actions/arm-deploy for more details.
output TAB_AZURE_STORAGE_RESOURCE_ID string = storage.id // used in deploy stage
output TAB_DOMAIN string = siteDomain
var endpoint = 'https://${siteDomain}'
output TAB_ENDPOINT string = endpoint

// Azure Storage Table to store tableName
resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2022-09-01' = {
  name: 'default'
  parent: storage
  properties: {
    cors: {
      corsRules: [
        {
          allowedHeaders: [ '*' ]
          allowedMethods: [ 'DELETE', 'GET', 'HEAD', 'MERGE', 'OPTIONS', 'PATCH', 'POST', 'PUT' ]
          allowedOrigins: [ '*' ]
          exposedHeaders: [ '*' ]
          maxAgeInSeconds: 86400
        }
      ]
    }
  }
}

resource table 'Microsoft.Storage/storageAccounts/tableServices/tables@2022-09-01' = {
  name: tableName
  parent: tableService
}

// ! This does not produce the right SAS token
var sasConfig = {
  canonicalizedResource: '/table/${storage.name}/${tableService.name}/${table.name}'
  keyToSign: 'key1'
  signedExpiry: dateTimeAdd(now, 'P1Y')
  signedPermission: 'raud'
  signedProtocol: 'https'
  signedResource: 'bcfs'
  signedStart: dateTimeAdd(now, '-P1D')
  signedResourceTypes: 'sco'
}
// sp=raud&st=2023-09-14T01:37:37Z&se=2023-09-15T01:37:37Z&spr=https&sv=2022-11-02&sig=ILnHPmO7t1OJCNhOWn3VugagzotM2iXCwuNtPP9jJzs%3D&tn=locationIDtoFluidRelayf10d29
// https://storagef10d29.table.core.windows.net/locationIDtoFluidRelayf10d29?sp=raud&st=2023-09-14T01:37:37Z&se=2023-09-15T01:37:37Z&spr=https&sv=2022-11-02&sig=ILnHPmO7t1OJCNhOWn3VugagzotM2iXCwuNtPP9jJzs%3D&tn=locationIDtoFluidRelayf10d29
output REACT_APP_TABLE_NAME string = table.name
output REACT_APP_TABLE_SAS_TOKEN string = storage.listServiceSas(storage.apiVersion, sasConfig).serviceSasToken


// Azure Fluid Relay Server
resource FluidRelay 'Microsoft.FluidRelay/fluidRelayServers@2022-06-01' = {
  name: 'Fluid-Relay'
  location: location
  identity: { type: 'None' }
  properties: { storagesku: 'standard' }
}
output REACT_APP_FLUID_TENANT_ID string = FluidRelay.properties.frsTenantId
output REACT_APP_FLUID_ENDPOINT string = FluidRelay.properties.fluidRelayEndpoints.serviceEndpoints[0]

// Azure Function App Service Plan
resource servicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: ASPName
  location: location
  kind: 'linux'
  sku: { name: 'Y1' }
  properties: { reserved: true }
}

// Azure Storage File Share to store Azure Function App code
resource shareService 'Microsoft.Storage/storageAccounts/fileServices@2022-09-01' = {
  name: 'default'
  parent: storage
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2022-09-01' = {
  name: toLower(functionName)
  parent: shareService
}

// Azure Function App
resource function 'Microsoft.Web/sites@2022-09-01' = {
  name: functionName
  kind: 'functionapp'
  location: location
  properties: {
    httpsOnly: true
    serverFarmId: servicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|18'
      cors: {
        allowedOrigins: [
          'https://portal.azure.com'
          'https://localhost:53000'
          endpoint
        ]
      }
      appSettings: [
          {
            name: 'AzureWebJobsFeatureFlags'
            value: 'EnableWorkerIndexing'
          }
          {
            name: 'AzureWebJobsStorage'
            value: 'DefaultEndpointsProtocol=https;AccountName=${storage.name};AccountKey=${storage.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
          }
          {
            name: 'FluidRelayKey'
            value: FluidRelay.listKeys().key1
          }
          {
            name: 'FUNCTIONS_EXTENSION_VERSION'
            value: '~4'
          }
          {
            name: 'FUNCTIONS_WORKER_RUNTIME'
            value: 'node'
          }
          {
            name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
            value: 'DefaultEndpointsProtocol=https;AccountName=${storage.name};AccountKey=${storage.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
          }
          {
            name: 'WEBSITE_CONTENTSHARE'
            value: share.name
          }
      ]
    }
  }
}
output REACT_APP_REMOTE_TOKEN_PROVIDER_URL string = function.properties.hostNames[0]
