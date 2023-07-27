param storageSku string

param storageBaseName string
param storageName string = storageBaseName

param vaultBaseName string
param vaultName string = vaultBaseName

param ASPBaseName string
param ASPName string = ASPBaseName

var functionName = 'Fluid-Relay-JWT-Provider'

param location string = resourceGroup().location

// Azure Storage that hosts your static web site
resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  kind: 'StorageV2'
  location: location
  name: storageName
  properties: { supportsHttpsTrafficOnly: true }
  sku: { name: storageSku }
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2022-09-01' = {
  name: 'default'
  parent: storage
}

resource table 'Microsoft.Storage/storageAccounts/tableServices/tables@2022-09-01' = {
  name: 'LocationIDtoFluidKey'
  parent: tableService
}

resource FluidRelay 'Microsoft.FluidRelay/fluidRelayServers@2022-06-01' = {
  name: 'Fluid-Relay'
  location: location
  identity: { type: 'None' }
  properties: { storagesku: 'standard' }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: vaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: false
    enabledForTemplateDeployment: true
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: functionIdentity.properties.principalId
        permissions: { secrets: [ 'all' ] }
      }
    ]
  }
}

resource secret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  name: 'Fluid-Relay-Key1'
  parent: keyVault
  properties: { value: FluidRelay.listKeys().key1 }
}

resource servicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: ASPName
  location: location
  kind: 'linux'
  sku: { name: 'Y1' }
  properties: { reserved: true }
}

resource functionIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'Function-Identity'
  location: location
}

resource shareService 'Microsoft.Storage/storageAccounts/fileServices@2022-09-01' = {
  name: 'default'
  parent: storage
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2022-09-01' = {
  name: toLower(functionName)
  parent: shareService
}

resource function 'Microsoft.Web/sites@2022-09-01' = {
  name: functionName
  kind: 'functionapp'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${functionIdentity.id}': {}
    }
  }
  properties: {
    httpsOnly: true
    serverFarmId: servicePlan.id
    siteConfig: {
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
            value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=${secret.name})'
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
            name: 'keyVaultReferenceIdentity'
            value: functionIdentity.id
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

var siteDomain = replace(replace(storage.properties.primaryEndpoints.web, 'https://', ''), '/', '')

// The output will be persisted in .env.{envName}. Visit https://aka.ms/teamsfx-actions/arm-deploy for more details.
output TAB_AZURE_STORAGE_RESOURCE_ID string = storage.id // used in deploy stage
output TAB_DOMAIN string = siteDomain
output TAB_ENDPOINT string = 'https://${siteDomain}'
