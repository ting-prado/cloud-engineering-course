import type { Section } from './types';

// These examples are lesson material, never executed by the academy.
// Azure examples target only an operator-reviewed disposable environment.
export const walkthroughs: Record<number, Section> = {
  17: {
    title: 'Worked example: inspect the actual API result',
    body: 'An inventory table displays a location and a resource name. A script that splits each line on spaces can break when the formatting changes or a display value contains spaces. Instead, request JSON and select named properties. In PowerShell, inspect an object with Get-Member before choosing properties; in Azure CLI, use --query and select a JSON or TSV shape deliberately.\n\nExit status is also data. If az fails to obtain an account context, stop the workflow. An empty string should not be silently treated as the intended subscription. In the lab, the script compares the actual subscription ID with an explicit expected ID before querying the group. This small guard is worth more than a beautifully formatted report from the wrong environment.',
  },
  18: {
    title: 'Worked example: a plan proposes replacement',
    body: 'A configuration change may look small in Git but force a resource replacement. Imagine changing an immutable property on a storage or compute resource. The plan can contain a destroy/create sequence rather than an in-place edit. Before applying, ask what data lives there, whether the new name or address changes clients, and whether the recovery procedure has been tested.\n\nDo not approve a plan merely because it says only one resource will change. Review the actions and dependency impact. Save the reviewed plan securely, apply that specific plan where appropriate, and regenerate it if configuration or context changes. For a learning deployment, practice this reasoning on an empty disposable resource rather than risking valuable data.',
  },
  20: {
    title: 'Worked example: trust the claim that is actually issued',
    body: 'An OIDC trust rule must match the token claims from the intended workflow. Do not copy an old subject string from a blog and broaden the trust when it fails. GitHub’s official documentation describes different default subject behavior for some newer repositories, transfers and renames. Inspect the current documented claim format for your repository and keep the Azure federation condition specific.\n\nFor example, a workflow allowed to deploy only from a protected production environment should not gain equivalent rights from any forked pull request. Verify the event and environment path, the permission to request a token, the federated credential match and then Azure RBAC. These are distinct gates; a login success does not prove permission to deploy every resource.',
  },
  2: {
    title: 'Worked example: a memory-constrained host',
    body: 'Suppose your laptop has 8 GB of RAM and its normal applications use about 4 GB. Giving a guest 6 GB does not create more memory: the host and guest can now compete, leading to paging and a sluggish machine. Start a lightweight guest with an allocation the host can spare, observe both environments and adjust after shutting the guest down. The numbers are an illustration, not a universal Ubuntu minimum.\n\nInside the guest, free -h distinguishes used memory, cache and available memory. Linux uses otherwise idle memory for cache, so a low “free” value alone is not proof of exhaustion. Compare available memory, swap activity and response times. This measurement-based habit will later prevent expensive and ineffective Azure resizing.',
    code: 'uname -a\nfree -h\nlsblk\n# Compare host and guest observations in your lab report.',
    language: 'bash',
  },
  8: {
    title: 'Worked example: estimating one demonstration',
    body: 'Suppose a host costs H per hour, storage costs S for the amount and duration retained, and telemetry/operations cost O. A rough demo estimate is H × running hours + S + O, plus applicable network charges. A 3-hour demo and a full month differ greatly in compute, but retained storage can continue after the demo. Write currency, region, date and SKU alongside every estimate.\n\nIf an alert fires at 80% of your chosen budget, delivery and cost reporting can be delayed. The correct response is an inventory and planned teardown, not an assumption that the provider will stop the application. For this academy, keep deployment windows short and retain reproducible configuration so the next demonstration starts from code.',
  },
  13: {
    title: 'Worked example: the API can read but cannot administer',
    body: 'A document API needs to read blobs in one container. Give its managed identity a suitable data-reader role at the narrowest supported scope, then test the exact operation. It should not need permission to create VMs, assign roles or change the subscription. The deployment identity has a different job and should receive its own carefully bounded management permissions.\n\nNow imagine someone grants the runtime Contributor at resource-group scope to fix a failed read. This increases management access without necessarily granting the required data action. Diagnose the token identity, data role and assignment scope instead. Test both a valid read and an out-of-scope operation. Document propagation delay and renew the token if needed before deciding the configuration failed.',
  },
  14: {
    title: 'Worked example: a private name with a public answer',
    body: 'The API runs in a connected VNet, storage public access is disabled, and requests fail. From the application environment, nslookup for the storage hostname returns a public address. That is actionable DNS evidence: the client is not using the intended private endpoint address. Check the private DNS record, zone link and resolver forwarding. Opening every NSG port does not correct the hostname answer.\n\nAfter correcting resolution, test a new connection and then the authorized storage operation. A successful TCP connection still does not prove blob permission. Keep each observation in the report so the next operator can distinguish a DNS repair from an authorization repair.',
  },
  16: {
    title: 'Worked example: a replica of the wrong version',
    body: 'A user overwrites a document at 10:05. Redundant storage may faithfully preserve the new, incorrect contents. The system is available, yet the user needs the 10:00 version. Your recovery mechanism must retain that historical state, and the operator needs permission and instructions to find it. An additional live replica alone cannot infer which contents the user intended.\n\nRestore to a separate destination first, verify contents or checksum, and only then perform the documented replacement if needed. Record the recovery point and elapsed time. A backup procedure without this verification can produce a confident green report while restoring the wrong document.',
  },
  21: {
    title: 'Worked example: stolen runtime credentials',
    body: 'Assume an attacker can execute code in the web process. They may be able to request tokens through the same managed identity path as the application. Managed identity prevents a static credential from sitting in your repository; it does not prevent the compromised process from using its legitimate runtime permissions.\n\nA narrow blob-read role limits what the attacker can do compared with subscription Owner. Segmentation, patching, dependency review, safe input handling and audit signals address other parts of the chain. Your threat model should therefore start with a plausible compromised component and enumerate its reachable actions, rather than treating a credential technology as a complete security boundary.',
  },
  22: {
    title: 'Worked example: an average hides a bad tail',
    body: 'Suppose 95 uploads finish in 100 ms and five finish in 10 seconds. The mean is about 595 ms, which can look acceptable on a dashboard, while one in twenty users experiences a long wait. A latency distribution and a high percentile show a different experience. Decide whether failed requests are included in the latency population and report success rate separately.\n\nIn the incident review, correlate the slow requests with dependency spans and timestamps. If all five waited for the same storage operation, focus the next test there. A larger web VM is only a hypothesis until evidence shows the web tier is constrained.',
  },
};

export const labCommands: Record<number, { code: string; guidance: string }> = {
  1: {
    code: 'mkdir academy-week-01\ncd academy-week-01\n# Create index.html here with a text editor; no private files.\npython -m http.server 8080 --bind 127.0.0.1\n# Separate terminal (curl.exe on Windows):\ncurl -i http://127.0.0.1:8080/\ncurl -i http://127.0.0.1:8080/missing.html',
    guidance:
      'The two curl commands should differ by HTTP status while the listener is running. Stop the server with Ctrl+C and repeat the first command to capture the transport failure. Use python3 if your installation uses that executable name.',
  },
  2: {
    code: 'uname -a\nfree -h\nlsblk\nprintf "persistent sample\\n" > "$HOME/academy-vm-sample.txt"\n# Reboot the disposable guest through its normal shutdown menu.\n# After signing back in:\ncat "$HOME/academy-vm-sample.txt"',
    guidance:
      'These commands run inside the Linux guest. Record the virtual resource view, reboot normally and verify the file survived. A process’s temporary memory will not survive the same reboot.',
  },
  3: {
    code: 'curl -i http://127.0.0.1:8080/\ncurl -i http://127.0.0.1:8081/\ncurl -I https://example.com\n# Linux listener inventory:\nss -lnt\n# Windows alternative:\n# Test-NetConnection example.com -Port 443',
    guidance:
      'Run the first command while the Week 1 listener is active. Ensure 8081 has no listener before treating it as the intended failure. Record facts rather than labeling every connection error a firewall problem.',
  },
  4: {
    code: 'nslookup example.com\n# If dig is installed in Linux/macOS:\ndig example.com A\ndig example.com AAAA\ndig example.com CNAME\n# In the report: annotate answer, resolver and TTL where shown.',
    guidance:
      'A query can legitimately return no record of one type while another type exists. Do not change your machine’s DNS settings for the lab. Explain the four /26 boundaries using arithmetic in your submission.',
  },
  5: {
    code: 'mkdir -p "$HOME/academy/week05/notes" "$HOME/academy/week05/evidence"\ncd "$HOME/academy/week05"\nprintf "INFO start\\nWARN retry\\nERROR timeout\\n" > app.log\ncp app.log evidence/original.log\ndiff app.log evidence/original.log\ngrep "ERROR" app.log > evidence/errors.log\nprintf "Investigate the dependency timeout.\\n" >> notes/observations.txt',
    guidance:
      'Run in Bash inside Linux, not PowerShell. The diff should be empty before edits. Inspect the files with cat or less and explain why redirection to a new report did not modify the source log.',
  },
  6: {
    code: 'cd "$HOME/academy/week05"\nprintf "mode=demo\\n" > config.example\nchmod 640 config.example\nls -l config.example\nchmod 600 config.example\nls -l config.example\nsleep 120 &\nlab_pid=$!\nps -p "$lab_pid" -o pid,comm\nkill -TERM "$lab_pid"\nps -p "$lab_pid" -o pid,comm',
    guidance:
      'The final ps should not find the terminated sleep process. The task-specific lab_pid comes from the background process you just started; do not copy a PID from another machine or stop unrelated services.',
  },
  7: {
    code: 'bash scripts/health.sh evidence\necho $?\nbash scripts/health.sh "missing directory"\necho $?\nbash scripts/health.sh\necho $?\n# Proposed cron format only; replace /absolute with your real path:\n# 0 9 * * 3 /bin/bash /absolute/health.sh /absolute/evidence >> /absolute/report.log 2>&1',
    guidance:
      'Create health.sh from the lecture first. Run from the workspace containing scripts and evidence. For each failed input, capture the message and nonzero exit status. The cron line is a commented proposal, not an installed job.',
  },
  9: {
    code: 'az account show --query "{name:name,id:id,tenant:tenantId}" -o json\naz group list --query "[].{name:name,location:location,tags:tags}" -o json\naz resource list --query "[].{id:id,type:type}" -o json',
    guidance:
      'These commands are read-only but can reveal organization inventory. Use only authorized access and sanitize published output. A documentation-only diagram remains a valid no-account exercise.',
  },
  13: {
    code: 'az account show --query "{name:name,id:id}" -o table\n# Replace with an authorized scope, never an unrelated subscription.\nlab_scope="/subscriptions/YOUR_SUBSCRIPTION/resourceGroups/YOUR_LAB_GROUP"\naz role assignment list --scope "$lab_scope" --include-inherited -o json\n# Do not add assignments until the principal, role and scope are reviewed.',
    guidance:
      'This is Bash syntax. Inspect roleDefinitionName, principalId and scope. Group-based effective access can require additional authorized directory inspection; this list alone is not proof that every inherited group permission has been found.',
  },
  14: {
    code: 'az account show --query "{name:name,id:id}" -o table\n# Replace only with the disposable group you reviewed.\nlab_group="YOUR_LAB_GROUP"\naz network vnet list -g "$lab_group" -o table\naz network nsg list -g "$lab_group" -o table\n# For an existing reviewed VNet:\naz network vnet subnet list -g "$lab_group" --vnet-name YOUR_VNET -o json\n# Run in the actual application environment:\nnslookup YOUR_ACCOUNT.blob.core.windows.net',
    guidance:
      'These inspection commands do not create resources. To perform the optional deployment, use the following reviewed configuration exercise or the official VNet guide. Compare the DNS answer with the actual private endpoint IP, not with a guessed address.',
  },
  15: {
    code: 'az vm list -g YOUR_LAB_GROUP --show-details -o table\naz vm get-instance-view -g YOUR_LAB_GROUP -n YOUR_VM -o json\n# Inside the Linux guest:\nfree -h\ndf -h\nss -lnt\nsystemctl --failed\njournalctl -n 50 --no-pager',
    guidance:
      'The first two commands require an existing VM you own. Use the Linux commands in the local guest for the free path. Provisioning status, power state, guest service state and HTTP health answer different questions.',
  },
  16: {
    code: 'mkdir -p "$HOME/academy/week16/primary" "$HOME/academy/week16/backup"\ncd "$HOME/academy/week16"\nprintf "recovery sample v1\\n" > primary/sample.txt\nsha256sum primary/sample.txt\ncp primary/sample.txt backup/sample.txt\n# Simulate corruption only in this disposable file:\nprintf "incorrect v2\\n" > primary/sample.txt\ndate -u\ncp backup/sample.txt primary/sample.txt\nsha256sum primary/sample.txt\ndate -u',
    guidance:
      'Compare the restored checksum to the original and time the procedure. This same-host copy is only a rehearsal; document its failure-domain limitation. On macOS use shasum -a 256 instead of sha256sum.',
  },
  17: {
    code: '#!/usr/bin/env bash\nset -euo pipefail\nexpected_id="${1:?Usage: inventory.sh SUBSCRIPTION_ID GROUP}"\nlab_group="${2:?Supply the reviewed lab group}"\nactual_id=$(az account show --query id -o tsv)\n[[ "$actual_id" == "$expected_id" ]] || { echo "Wrong subscription" >&2; exit 1; }\naz resource list -g "$lab_group" --query "[].{name:name,type:type,owner:tags.owner}" -o json',
    guidance:
      'Save as inventory.sh and provide your authorized subscription ID and group. Test a deliberately mismatched ID; the script must stop before listing resources. It is intentionally read-only.',
  },
  18: {
    code: 'terraform fmt -check\nterraform init\nterraform validate\nterraform plan -out=reviewed.tfplan\n# STOP: review the plan and target before applying.\n# terraform apply reviewed.tfplan\n# Review cleanup separately:\n# terraform plan -destroy',
    guidance:
      'Create the complete configuration from the linked official resource-group tutorial first, including provider requirements. Plan files and state can contain sensitive values; ignore them in Git. Never apply a saved plan that has not been reviewed.',
  },
  19: {
    code: '# Dockerfile contents (save as Dockerfile):\nFROM nginx:stable-alpine\nCOPY index.html /usr/share/nginx/html/index.html\n\n# Run these separately in your terminal, not in the Dockerfile:\n# docker build -t academy-web:v1 .\n# docker run --rm --name academy-web -p 127.0.0.1:8080:80 academy-web:v1\n# curl -i http://127.0.0.1:8080/\n# docker logs academy-web',
    guidance:
      'Create index.html before the build. Keep the foreground container running while testing from another terminal. Ctrl+C stops it; --rm removes that container. Production artifacts should use reviewed pinned versions/digests and an update process.',
  },
  20: {
    code: 'git status --short\ngit rev-parse HEAD\n# Run your project checks before creating a release artifact:\nnpm ci\nnpm test\nnpm run build\n# Record commit and artifact identity; do not log credentials.',
    guidance:
      'These commands assume a Node project with a committed lockfile and meaningful test/build scripts. Use the validation workflow in the lecture. Configure cloud deployment only after reviewing the official OIDC guide and the actual claims issued for your repository.',
  },
  21: {
    code: 'az account show --query "{name:name,id:id}" -o table\n# Authorized vault inspection only; never print secret values.\naz keyvault show --name YOUR_LAB_VAULT --query "{id:id,rbac:properties.enableRbacAuthorization}" -o json\naz keyvault secret list --vault-name YOUR_LAB_VAULT --query "[].{name:name,enabled:attributes.enabled}" -o table',
    guidance:
      'Even secret names can reveal context; sanitize evidence. A metadata listing is not a valid secret-read test. For the optional dummy-secret experiment, record only success/denial and identity, never the secret value.',
  },
  22: {
    code: '{"time":"2027-03-20T01:00:00Z","requestId":"demo-001","operation":"upload","success":false,"elapsedMs":1200,"dependency":"blob","errorClass":"authorization"}\n{"time":"2027-03-20T01:00:03Z","requestId":"demo-002","operation":"upload","success":true,"elapsedMs":120,"dependency":"blob"}',
    guidance:
      'These are sample structured log events, not commands. Generate your own sanitized equivalents and correlate one failing user operation. Do not interpret two events as a statistically meaningful reliability estimate.',
  },
};
