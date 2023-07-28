param storageName string
param vaultName string
param storageSku string

param location string = resourceGroup().location

// Azure Storage that hosts your static web site
resource storage 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  kind: 'StorageV2'
  location: location
  name: storageName
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
  name: 'LocationIDtoFluidKey'
  parent: tableservice
}

resource FluidRelay 'Microsoft.FluidRelay/fluidRelayServers@2022-06-01' = {
  name: 'Fluid-Relay'
  location: location
  identity: {
    type: 'None'
  }
  properties: {
    storagesku: 'standard'
  }
}

resource HoloCollabKeyValut 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: vaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: 'b928a2e0-faf5-4f59-8fa6-307314844ed9'
    accessPolicies: [
      {
        tenantId: 'b928a2e0-faf5-4f59-8fa6-307314844ed9'
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
      {
        tenantId: '1faf88fe-a998-4c5b-93c9-210a11d9a5c2'
        objectId: 'a1924ec9-f8ee-4550-ba69-2b8d6579d7e4'
        permissions: {
          keys: [
            'Get'
            'WrapKey'
            'UnwrapKey'
          ]
          secrets: [
            'Get'
          ]
          certificates: []
        }
      }
      {
        tenantId: '1faf88fe-a998-4c5b-93c9-210a11d9a5c2'
        objectId: '3b93c84d-fb16-4121-8aa0-fd1923bc6407'
        permissions: {
          secrets: [
            'Get'
            'List'
            'Set'
            'Delete'
            'Recover'
            'Backup'
            'Restore'
          ]
          keys: []
          certificates: []
        }
      }
      {
        tenantId: '1faf88fe-a998-4c5b-93c9-210a11d9a5c2'
        objectId: 'f70824dc-3be6-4031-9040-1e2796ad379e'
        permissions: {
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
        }
      }
    ]
    enabledForDeployment: true
    enabledForDiskEncryption: true
    enabledForTemplateDeployment: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enableRbacAuthorization: false
    enablePurgeProtection: true
    vaultUri: 'https://holocollab-key-valut.vault.azure.net/'
    provisioningState: 'Succeeded'
    publicNetworkAccess: 'Enabled'
  }
}
