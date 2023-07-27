param storageSku string

param storageBaseName string
param storageName string = storageBaseName

param ASPBaseName string
param ASPName string = ASPBaseName

var functionName = 'Fluid-Relay-JWT-Provider'

param location string = resourceGroup().location

// Generic Azure Storage
resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  kind: 'StorageV2'
  location: location
  name: storageName
  properties: { supportsHttpsTrafficOnly: true }
  sku: { name: storageSku }
}

// Outputs
var siteDomain = replace(replace(storage.properties.primaryEndpoints.web, 'https://', ''), '/', '')
// The output will be persisted in .env.{envName}. Visit https://aka.ms/teamsfx-actions/arm-deploy for more details.
output TAB_AZURE_STORAGE_RESOURCE_ID string = storage.id // used in deploy stage
output TAB_DOMAIN string = siteDomain
var endpoint = 'https://${siteDomain}'
output TAB_ENDPOINT string = endpoint

// Azure Storage Table to store LocationIDtoFluidKey
resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2022-09-01' = {
  name: 'default'
  parent: storage
}

resource table 'Microsoft.Storage/storageAccounts/tableServices/tables@2022-09-01' = {
  name: 'LocationIDtoFluidKey'
  parent: tableService
}

// Azure Fluid Relay Server
resource FluidRelay 'Microsoft.FluidRelay/fluidRelayServers@2022-06-01' = {
  name: 'Fluid-Relay'
  location: location
  identity: { type: 'None' }
  properties: { storagesku: 'standard' }
}

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

