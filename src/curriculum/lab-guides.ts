import type { Section } from './types';

export const labGuides: Record<number, Section[]> = {
  14: [
    {
      title: 'Optional Azure execution: create the network only',
      body: 'Use this Bash walkthrough only after reviewing your active subscription and choosing a dedicated disposable group. A VNet with subnets and an NSG is sufficient to inspect the control plane; no VM, NAT gateway or private endpoint is required for this first step. Review current prices because related services and future additions can incur charges. Replace the environment-specific values deliberately.\n\nThe example creates a network and an application subnet, then attaches an NSG with a narrow HTTPS rule. It does not create an internet-facing service, an administration path or a private endpoint. Default NSG rules still exist, so read the effective rule set rather than assuming this one rule is the entire policy.',
      code: 'lab_group="academy-w14-disposable"\nlab_location="YOUR_REVIEWED_REGION"\naz account show --query "{name:name,id:id}" -o table\n# Review subscription and targets before continuing.\naz group create -n "$lab_group" -l "$lab_location" --tags environment=academy owner=student\naz network vnet create -g "$lab_group" -n academy-vnet \\\n  --address-prefixes 10.20.0.0/16 \\\n  --subnet-name application --subnet-prefixes 10.20.1.0/24\naz network nsg create -g "$lab_group" -n academy-app-nsg\naz network nsg rule create -g "$lab_group" --nsg-name academy-app-nsg \\\n  -n allow-reviewed-https --priority 200 --direction Inbound \\\n  --access Allow --protocol Tcp --source-address-prefixes 10.20.2.0/24 \\\n  --source-port-ranges "*" --destination-address-prefixes 10.20.1.0/24 \\\n  --destination-port-ranges 443\naz network vnet subnet update -g "$lab_group" --vnet-name academy-vnet \\\n  -n application --network-security-group academy-app-nsg',
      language: 'bash',
    },
    {
      title: 'Validate configuration and state the test limit',
      body: 'Inspect the resulting address prefixes and NSG association. List the full NSG rules including defaults. Your evidence proves that configuration exists; without a workload and a client it does not prove an end-to-end packet path. Explain that distinction in your report. For cleanup, inventory the exact dedicated group before requesting deletion. Never reuse the cleanup target for a shared environment.',
      code: 'az network vnet subnet show -g "$lab_group" --vnet-name academy-vnet \\\n  -n application --query "{prefix:addressPrefix,nsg:networkSecurityGroup.id}" -o json\naz network nsg show -g "$lab_group" -n academy-app-nsg -o json\naz resource list -g "$lab_group" -o table\n# Only after reviewing the exact disposable inventory:\n# az group delete -n "$lab_group" --yes',
      language: 'bash',
    },
  ],
  15: [
    {
      title: 'Optional Azure execution: a short-lived VM',
      body: 'First inspect available Ubuntu images and small VM sizes for your selected region. Choose an image URN and size that currently exist and fit your cost limit; the placeholders below are intentionally not guessed SKUs. The example uses no public IP, so it does not create an internet SSH endpoint. It requires a reviewed existing VNet/subnet in the disposable group. Use the local guest path if you do not have a private administration route or cannot authorize charges.\n\nThe system-assigned identity is created without granting broad resource roles. Review the provisioning output and associated disk/network resources. Never assume deleting or stopping only the guest removes everything billable.',
      code: 'az vm image list --publisher Canonical --all -o table\naz vm list-sizes --location YOUR_REVIEWED_REGION -o table\n# Review and replace each value before executing:\naz vm create -g YOUR_DISPOSABLE_GROUP -n academy-vm \\\n  --image YOUR_REVIEWED_IMAGE_URN --size YOUR_REVIEWED_SIZE \\\n  --admin-username academy --generate-ssh-keys \\\n  --vnet-name YOUR_VNET --subnet YOUR_SUBNET \\\n  --public-ip-address "" --assign-identity\naz vm get-instance-view -g YOUR_DISPOSABLE_GROUP -n academy-vm -o json',
      language: 'bash',
    },
  ],
  16: [
    {
      title: 'Optional Azure execution: a private blob container',
      body: 'This small exercise uses a public network endpoint with authenticated data access and disabled anonymous blob access; it does not claim private networking. Choose a globally unique lowercase storage name that follows Azure’s current naming rules and a reviewed region. Creating the account and a few objects can incur storage and transaction charges. Start with dummy content and a dedicated group.\n\nThe signed-in identity needs management permission to create the account and a data role to manipulate blobs. Have an authorized access administrator assign Storage Blob Data Contributor at the account or narrower appropriate scope; do not paste account keys into the shell. RBAC propagation can take time. The commands use --auth-mode login to make that identity-based choice explicit.',
      code: 'lab_group="YOUR_DISPOSABLE_GROUP"\nlab_location="YOUR_REVIEWED_REGION"\nlab_storage="YOUR_UNIQUE_STORAGE_NAME"\naz account show --query "{name:name,id:id}" -o table\naz storage account create -g "$lab_group" -n "$lab_storage" -l "$lab_location" \\\n  --sku Standard_LRS --kind StorageV2 --https-only true \\\n  --min-tls-version TLS1_2 --allow-blob-public-access false\n# After an authorized administrator grants the reviewed data role:\naz storage container create --account-name "$lab_storage" \\\n  -n academy-documents --auth-mode login\nprintf "dummy recovery sample\\n" > sample.txt\naz storage blob upload --account-name "$lab_storage" \\\n  --container-name academy-documents --name sample.txt \\\n  --file sample.txt --auth-mode login --overwrite false\naz storage blob download --account-name "$lab_storage" \\\n  --container-name academy-documents --name sample.txt \\\n  --file recovered-sample.txt --auth-mode login\nsha256sum sample.txt recovered-sample.txt',
      language: 'bash',
    },
    {
      title: 'Extend the recovery test deliberately',
      body: 'The download above verifies retrieval and integrity; it is not yet proof of recovery from deletion. For that claim, configure a supported recovery feature using the official storage/backup guide, record retention, then remove only the disposable sample and restore its historical state. Compare checksums and measure time. Alternatively, use the local overwrite/restore rehearsal and state the Azure recovery feature was not exercised.\n\nCleanup must account for retained versions, soft-delete and backup features. Save your evidence, review the dedicated group inventory and delete only the disposable resources. Check billing inventory afterward rather than assuming a successful app shutdown removed storage.',
    },
  ],
  18: [
    {
      title: 'A complete small Terraform starting point',
      body: 'This declaration manages only a resource group. It is enough to practice provider initialization, validation, state mapping and a tag update without running a VM. Supply your reviewed subscription ID and region. Pin the selected provider version through the committed dependency lockfile and consult current provider documentation before changing constraints.\n\nSave as main.tf, run the lifecycle commands, and inspect terraform state list after an optional reviewed apply. Keep state and saved plans out of Git. For shared use, move state to a protected backend with appropriate locking and access controls.',
      code: 'terraform {\n  required_version = ">= 1.6, < 2.0"\n  required_providers {\n    azurerm = {\n      source  = "hashicorp/azurerm"\n      version = "~> 4.0"\n    }\n  }\n}\nvariable "subscription_id" { type = string }\nvariable "location" { type = string }\nprovider "azurerm" {\n  features {}\n  subscription_id = var.subscription_id\n}\nresource "azurerm_resource_group" "academy" {\n  name     = "academy-w18-disposable"\n  location = var.location\n  tags     = { environment = "academy", owner = "student" }\n}\noutput "resource_group_id" {\n  value = azurerm_resource_group.academy.id\n}',
      language: 'hcl',
    },
  ],
  19: [
    {
      title: 'Optional local Kubernetes: make selection visible',
      body: 'Use only a disposable local cluster. Verify kubectl config current-context before applying. This manifest uses an official public image to avoid a local image-distribution problem. For a more complete production pattern, pin an approved digest and implement appropriate security and resource policies. Save the text as academy.yaml, then run kubectl apply -f academy.yaml. Inspect Pods and Service endpoints, then run kubectl port-forward service/academy-web 8080:80 and open the loopback address.\n\nObserve how app: academy-web connects the Service selector to the Deployment’s Pod template labels. Delete one disposable Pod and watch the Deployment recreate it. If labels do not match, a Service can exist while selecting no useful backends.',
      code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: academy-web\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: academy-web\n  template:\n    metadata:\n      labels:\n        app: academy-web\n    spec:\n      containers:\n        - name: web\n          image: nginx:stable-alpine\n          ports:\n            - containerPort: 80\n          resources:\n            requests:\n              cpu: 50m\n              memory: 32Mi\n            limits:\n              cpu: 250m\n              memory: 64Mi\n          readinessProbe:\n            httpGet:\n              path: /\n              port: 80\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: academy-web\nspec:\n  selector:\n    app: academy-web\n  ports:\n    - port: 80\n      targetPort: 80',
      language: 'yaml',
    },
    {
      title: 'Validate the controller and clean up',
      body: 'Use kubectl get pods -l app=academy-web, kubectl describe deployment academy-web and kubectl get endpointslices -l kubernetes.io/service-name=academy-web. Stop the port-forward with Ctrl+C. After collecting evidence, verify the local context again and run kubectl delete -f academy.yaml. Delete only this lab’s objects. The replacement Pod proves reconciliation of desired replicas, not database backup or application-level correctness.',
    },
  ],
};
