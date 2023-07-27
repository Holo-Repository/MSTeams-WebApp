param storageBaseName string
param vaultBaseName string
param fluidBaseName string
param ASPBaseName string
param storageSku string
param teamsAppTenantId string

param storageName string = storageBaseName
param vaultName string = vaultBaseName
param fluidName string = fluidBaseName
param ASPName string = ASPBaseName
param location string = resourceGroup().location

// Azure Storage that hosts your static web site
resource storage 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: storageName
  location: location
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
  sku: {
    name: storageSku
  }
}

resource tableservice 'Microsoft.Storage/storageAccounts/tableServices@2022-09-01' = {
  name: 'default'
  parent: storage
}

resource table 'Microsoft.Storage/storageAccounts/tableServices/tables@2022-09-01' = {
  name: 'TestLocationIDtoFluidKey'
  parent: tableservice
}

resource fluidRelay 'Microsoft.FluidRelay/fluidRelayServers@2022-06-01' = {
  name: fluidName
  location: location
  identity: {
    type: 'None'
  }
  properties: {
    storagesku: 'standard'
  }
}

resource plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: ASPName
  location: location
  kind: 'linux'
  sku: {
    name: 'Y1'
  }
  properties: {
    reserved: true
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: vaultName
  location: location
  properties: {
    accessPolicies: [
      {
        tenantId: teamsAppTenantId
        objectId: '68441a01-70cb-4f0b-bfe2-87fa645be89c'
        permissions: {
          keys: [
            'Get'
            'List'
            'Update'
            'Create'
            'Import'
            'Delete'
            'Recover'
            'Backup'
            'Restore'
            'GetRotationPolicy'
            'SetRotationPolicy'
            'Rotate'
            'Encrypt'
            'Decrypt'
            'UnwrapKey'
            'WrapKey'
            'Verify'
            'Sign'
            'Purge'
            'Release'
          ]
          secrets: [
            'Get'
            'List'
            'Set'
            'Delete'
            'Recover'
            'Backup'
            'Restore'
            'Purge'
          ]
          certificates: [
            'Get'
            'List'
            'Update'
            'Create'
            'Import'
            'Delete'
            'Recover'
            'Backup'
            'Restore'
            'ManageContacts'
            'ManageIssuers'
            'GetIssuers'
            'ListIssuers'
            'SetIssuers'
            'DeleteIssuers'
            'Purge'
          ]
        }       
      }
    ]
    createMode: 'default'
    enableSoftDelete: false
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: teamsAppTenantId
  }
}

resource secretfluid 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  name: 'Fluid-Relay-Key1'
  parent: keyVault
  properties: {
    attributes: {
      enabled: true
    }
    value: listKeys(fluidRelay.id, '2022-06-01')['key1']
  }
}

resource functionApp 'Microsoft.Web/sites@2020-12-01' = {
  name: 'Fluid-Provider'
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      appSettings: [
          {
            name: 'AzureWebJobsFeatureFlags'
            value: 'EnableWorkerIndexing'
          }
          {
            name: 'AzureWebJobsStorage'
            value: 'DefaultEndpointsProtocol=https;AccountName=genericfluidstorage;AccountKey=vKSZOCsXHjXaE36fIm63kQ/+a5aa1kTFmWDCLpoHCMewtXWvmh/DZKWFQn15/trr3hRgNCM5TUgT+ASt0ND6Ig==;EndpointSuffix=core.windows.net'
          }
          {
            name: 'FluidRelayKey'
            value: '@Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret)'
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
            value: '/subscriptions/a2f6cb3c-7458-4872-8099-fcd096f29d7f/resourcegroups/Teams-App/provid ers/Microsoft.ManagedIdentity/userAssignedIdentities/Fluid-Relay-MA'
          }
          {
            name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
            value: 'DefaultEndpointsProtocol=https;AccountName=genericfluidstorage;AccountKey=vKSZOCsXHjXaE36fIm63kQ/+a5aa1kTFmWDCLpoHCMewtXWvmh/DZKWFQn15/trr3hRgNCM5TUgT+ASt0ND6Ig==;EndpointSuffix=core.windows.net'
          }
          {
            name: 'WEBSITE_CONTENTSHARE'
            value: 'fluid-jwt-providerb804'
          }
      ]
    }
    httpsOnly: true
  }
}


var siteDomain = replace(replace(storage.properties.primaryEndpoints.web, 'https://', ''), '/', '')

// The output will be persisted in .env.{envName}. Visit https://aka.ms/teamsfx-actions/arm-deploy for more details.
output TAB_AZURE_STORAGE_RESOURCE_ID string = storage.id // used in deploy stage
output TAB_DOMAIN string = siteDomain
output TAB_ENDPOINT string = 'https://${siteDomain}'
