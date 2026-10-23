import { defineWeek as w, single as q, multiple as m, bool as b, short as s } from './helpers';
import { resources as r } from './resources';
export const engineering = [
  w({
    number: 17,
    title: 'Cloud automation',
    topics: ['Azure CLI', 'PowerShell', 'Scripting', 'Resource management', 'Safe automation'],
    objectives: [
      'Inspect Azure context before mutation.',
      'Use structured output instead of parsing tables.',
      'Write repeatable, bounded automation.',
    ],
    sections: [
      {
        title: 'A command is an API client with context',
        body: 'Azure CLI and Azure PowerShell both call Azure management interfaces using an authenticated identity. The active tenant and subscription affect where a command operates. A perfectly valid command in the wrong subscription is still an incident. Start every script with context verification and explicit target variables. Interactive sign-in is appropriate for a human lab; unattended automation needs a workload identity and narrowly scoped permissions.\n\nCLI output defaults are convenient for people, not stable parsing contracts. Use JSON and queries to select fields. Azure CLI uses JMESPath queries; PowerShell works with objects and properties. Avoid splitting a formatted table on spaces, since names and presentation can change.',
      },
      {
        title: 'PowerShell passes objects; Bash passes streams',
        body: 'In Bash, commands generally exchange text streams and report numeric exit statuses. PowerShell pipelines generally exchange objects, allowing filtering on named properties. Set explicit failure behavior appropriate to the tool. In PowerShell, an external program can return a nonzero exit code without behaving like a terminating PowerShell exception; inspect $LASTEXITCODE for native tools when necessary.\n\nParameterize environment, location and resource group rather than duplicating scripts. Validate inputs before creating resources, use a dry-run or preview where supported and print a concise operation summary. Never output tokens, secrets or full environment dumps for debugging. Log resource IDs and timestamps so later cleanup targets the right resources.',
      },
      {
        title: 'Make the second run safe',
        body: 'Idempotency means converging to an intended state instead of appending duplicate changes on each run. A script should distinguish “already exists and matches” from “exists with incompatible settings.” Retries need bounded attempts and backoff; blindly retrying a destructive command can repeat damage. Authentication failures and invalid parameters usually need correction rather than retries.\n\nDeletion deserves stricter targeting. Confirm the exact subscription, group and inventory, then require the operator to review the target. The academy never runs Azure commands automatically; copyable examples are for your own authorized environment.',
        code: 'az account show --query "{subscription:name,id:id}" -o json\naz group list --query "[?tags.environment==\'academy\'].{name:name,location:location}" -o json\n# PowerShell with the Az module:\nGet-AzContext\nGet-AzResourceGroup | Where-Object { $_.Tags.environment -eq "academy" }',
        language: 'shell',
      },
    ],
    terms: {
      Context: 'The active identity, tenant and subscription used by a tool.',
      JMESPath: 'A query language for JSON documents.',
      Backoff: 'Increasing wait time between bounded retries.',
      'Dry run': 'A preview of intended changes without applying them.',
    },
    misconception:
      'A successful exit status does not prove that a command targeted the intended subscription or resource.',
    summary:
      'Verify context, consume structured data, validate inputs and make repeated execution intentional.',
    resources: [r.cli, r.powershell, r.rbac],
    lab: {
      title: 'Automate a read-only inventory',
      tools:
        'Azure CLI or Azure PowerShell; authorized subscription for live inventory, sample JSON for offline work.',
      cost: 'Free & local',
      setup:
        'Install tools from official documentation. Sign in only to an account you may inspect. Offline path: create sample resource JSON with name, type, group and tags.',
      tasks: [
        'Capture context without exposing access tokens. Require an expected subscription ID in your script.',
        'List only resources in a selected lab group or filter the sample JSON. Output structured name/type/owner records.',
        'Add input validation for an empty group and mismatched subscription. These cases must fail before any mutation.',
        'Run twice and compare output. Document which time-dependent fields may change.',
        'Write a separate proposed cleanup plan that shows targets but performs no deletion.',
      ],
      expected: 'A read-only inventory script, sanitized output and validation evidence.',
      validate:
        'Wrong context produces a visible failure. The script parses structured fields rather than table spacing.',
      troubleshooting:
        'A missing subscription can indicate wrong tenant access. Renew authentication deliberately; do not embed a personal access token in a script.',
      cleanup:
        'No resources are created. Sign out of shared machines and remove any temporary files containing sensitive inventory.',
    },
    questions: [
      q(
        'What should an automation script verify before mutation?',
        ['Active subscription and target', 'Only terminal color', 'Only current month', 'Only CPU count'],
        0,
        'Identity context and exact target prevent valid commands from changing the wrong environment.',
      ),
      m(
        'Which improve repeatability?',
        ['Input validation', 'Structured output', 'Bounded retries', 'Unbounded retries for every error'],
        [0, 1, 2],
        'Retries should be limited and appropriate to transient failures.',
      ),
      b(
        'Parsing a CLI table by spacing is more robust than consuming JSON.',
        false,
        'Tables are presentation output. JSON fields are a better machine interface.',
      ),
      s(
        'How would you make a cleanup command reviewable?',
        'Show the exact subscription, resource-group ID and contained resources, verify they are disposable, and require review of those targets before deletion. Keep deletion separate from discovery.',
      ),
    ],
    assignment:
      'Submit the inventory script, usage documentation, error cases and a safe proposed cleanup workflow.',
    review:
      'Run the script’s failure cases, compare Bash and PowerShell data handling, then complete the quiz.',
    reviewQuestions: [
      'What makes a retry safe?',
      'Which fields can you log without exposing secrets?',
      'How does the script fail on wrong context?',
    ],
  }),
  w({
    number: 18,
    title: 'Infrastructure as code',
    topics: ['Declarative infrastructure', 'Terraform', 'Bicep', 'State', 'Modules', 'Safe changes'],
    objectives: [
      'Explain desired-state infrastructure.',
      'Read a plan for destructive changes.',
      'Protect state and use small reusable modules.',
    ],
    sections: [
      {
        title: 'Declare a desired state and review the difference',
        body: 'Infrastructure as code describes resources in versioned files so changes can be reviewed and repeated. Terraform uses providers to interact with platforms and compares configuration, state and refreshed remote information. Bicep compiles Azure-focused declarations into Resource Manager deployments. Declarative does not mean risk-free: changing a property can require replacing a live resource.\n\nA Terraform plan shows intended creates, updates and destroys. Review resource addresses and replacement markers, not just the count of changes. A safe workflow formats and validates, initializes trusted providers, plans, reviews and applies the approved plan. Re-plan when the environment or configuration changes.',
      },
      {
        title: 'State connects configuration to real objects',
        body: 'Terraform state records mappings and attributes. It can contain sensitive values even when output is marked sensitive; that flag hides display, not necessarily storage. Do not commit state or secrets. Shared automation needs a protected remote backend and locking appropriate to that backend so concurrent writers do not corrupt the workflow. Back up state and tightly control access.\n\nBicep relies on Azure Resource Manager rather than a Terraform-style local state file. Deployment mode, scopes and newer deployment-stack behaviors must be understood before assuming that removing a declaration deletes the remote resource. Read a what-if result and verify deletion behavior explicitly.',
      },
      {
        title: 'Reuse the boundary that has a clear contract',
        body: 'A module should expose inputs such as environment and location, own a coherent group of resources and return useful IDs. Avoid one giant module with dozens of unrelated switches. Pin provider/module versions and commit dependency lockfiles where appropriate. Keep environment-specific values separate, while preventing production and lab state from sharing accidental targets.\n\nFor the first Azure exercise, a resource group is enough to learn the lifecycle. A plan with no VM is educational and avoids needless compute cost. Add resources only after you can explain their replacement and cleanup behavior.',
        code: "// main.bicep — preview before deployment\nparam location string = resourceGroup().location\nparam environment string = 'academy'\n\nresource network 'Microsoft.Network/virtualNetworks@2024-05-01' = {\n  name: 'academy-vnet'\n  location: location\n  tags: { environment: environment }\n  properties: { addressSpace: { addressPrefixes: ['10.40.0.0/16'] } }\n}",
        language: 'bicep',
      },
    ],
    terms: {
      State: 'Terraform’s mapping of configuration addresses to remote resources.',
      Plan: 'A proposed set of infrastructure changes.',
      Drift: 'A difference between expected and actual configuration.',
      Module: 'A reusable unit of infrastructure configuration.',
    },
    misconception: 'Sensitive output masking does not remove secrets from Terraform state.',
    summary:
      'Version infrastructure, review the proposed diff, protect state and test the entire create/change/destroy lifecycle.',
    resources: [r.terraform, r.bicep, r.cli],
    lab: {
      title: 'Review an infrastructure lifecycle',
      tools: 'Terraform CLI or Bicep CLI, Git, optional Azure CLI and authorized subscription.',
      cost: 'Potentially billable',
      setup:
        'The offline path authors and validates configuration without deployment. Optional Azure work uses a dedicated group and reviewed plan. Add *.tfstate*, .terraform/ and secret variable files to .gitignore.',
      tasks: [
        'Follow the official resource-group Terraform tutorial or author a small Bicep VNet module using the lecture example. Explain each input and output.',
        'Run formatter and validation. For Terraform, initialize the provider according to the official tutorial; never paste unreviewed provider binaries.',
        'With authorized Azure access, produce a plan/what-if without applying. Offline, annotate a proposed change list and identify one replacement risk.',
        'Optional: apply a reviewed resource-group-only configuration, change a tag and inspect the next plan. Record actual IDs.',
        'Review a destroy plan, preserve evidence and remove only the lab resources. Explain how state access would be secured in CI.',
      ],
      expected: 'Versioned configuration, validation output, annotated plan and lifecycle notes.',
      validate:
        'No credentials or state appear in Git. The operator can explain every intended create, update and delete.',
      troubleshooting:
        'Provider authentication, subscription selection and API-version support can fail independently. Read the exact validation or plan error before changing versions.',
      cleanup:
        'For applied Terraform work, review terraform plan -destroy and destroy only the dedicated lab state’s resources. For Bicep, inspect the exact dedicated group before deleting it. Verify the Azure inventory afterward.',
    },
    questions: [
      q(
        'What can a Terraform state file contain?',
        ['Sensitive resource attributes', 'Only CSS', 'Only public names guaranteed', 'No identifiers'],
        0,
        'State can contain sensitive data and needs protected storage and access.',
      ),
      m(
        'Which should trigger careful review?',
        [
          'Resource replacement',
          'Unexpected deletion',
          'Wrong subscription',
          'A formatter changing indentation alone',
        ],
        [0, 1, 2],
        'Replacement, deletion and wrong targets can affect live infrastructure.',
      ),
      b(
        'Removing a Bicep declaration always immediately deletes the remote resource.',
        false,
        'Behavior depends on deployment mode and management approach; inspect what-if and lifecycle semantics.',
      ),
      s(
        'Why separate lab and production state?',
        'It reduces accidental cross-environment targeting and limits blast radius, access and concurrent change conflicts. Separate identities and review workflows reinforce the boundary.',
      ),
    ],
    assignment:
      'Submit an IaC module README with inputs, outputs, state handling, validation and a reviewed lifecycle plan.',
    review: 'Read a plan aloud line by line, explain state security and complete the assessment.',
    reviewQuestions: [
      'Which changes replace resources?',
      'Who can read the backend?',
      'How do you detect drift?',
    ],
  }),
  w({
    number: 19,
    title: 'Containers & Kubernetes',
    topics: [
      'Docker images',
      'Registries',
      'Networking',
      'Kubernetes architecture',
      'Deployments',
      'Services',
      'AKS',
    ],
    objectives: [
      'Build and run a reproducible image.',
      'Explain Deployment, Pod and Service roles.',
      'Distinguish managed control-plane and workload duties.',
    ],
    sections: [
      {
        title: 'An image is a versioned application artifact',
        body: 'A Dockerfile describes image layers and a default startup command. An image is immutable content; a container is a running instance with writable runtime state. Tag names can move, while digests identify content. Pin dependencies and use a .dockerignore so build context does not accidentally include secrets, local state or unnecessary files. A smaller image can reduce transfer and attack surface, but it still needs updates.\n\nPublishing a port maps traffic into a container’s listener. The process must bind to an interface reachable inside its container, usually 0.0.0.0 for the application, while the host publish can be restricted to loopback. Container-local storage is not a durable upload strategy. Run as a non-root user when the application permits and keep credentials outside the image.',
      },
      {
        title: 'Kubernetes reconciles desired state',
        body: 'The control plane accepts desired state through the API server, stores cluster state and schedules Pods to nodes. A Pod is the smallest deployable workload unit and may contain closely coupled containers. A Deployment manages replicas and rolling updates through ReplicaSets. Individual Pods are replaceable; their IPs should not be hardcoded into application clients.\n\nA Service offers a stable discovery/access abstraction over selected Pods. Selectors and labels must match; a Service with no healthy endpoints cannot route to the expected workload. Readiness indicates whether a Pod should receive traffic, while liveness can trigger restarts. A bad liveness check can create a restart loop during a temporary dependency outage.',
      },
      {
        title: 'Operate the workload, not only the YAML',
        body: 'Resource requests inform scheduling; limits constrain selected resource use. Requests too high waste capacity, while requests too low can create contention. Inspect events, Pod status and logs before changing probes. AKS manages Kubernetes control-plane operation but still requires decisions about node pools, upgrades, access, networking, workload security and monitoring.\n\nUse a local cluster such as kind for this week; AKS is optional and not needed for the capstone. Understanding Kubernetes should improve service selection, including deciding when a simpler container host is enough.',
        code: 'docker build -t academy-web:local .\ndocker run --rm -p 127.0.0.1:8080:80 academy-web:local\n# On an authorized local Kubernetes context:\nkubectl config current-context\nkubectl get pods,services\nkubectl describe pod POD_NAME\nkubectl logs POD_NAME',
        language: 'shell',
      },
    ],
    terms: {
      Image: 'An immutable application filesystem and runtime configuration.',
      Pod: 'Kubernetes’s smallest deployable workload unit.',
      Deployment: 'A controller managing replica rollout and desired state.',
      Service: 'Stable access/discovery over a selected set of Pods.',
    },
    misconception:
      'A container restart does not restore files that were never stored durably, and Kubernetes does not automatically make an application reliable.',
    summary:
      'Build trusted artifacts, externalize durable state and observe reconciliation with readiness, events and logs.',
    resources: [r.docker, r.kubernetes, r.compute],
    lab: {
      title: 'Package and recover a local workload',
      tools: 'Docker; optional kind or another local Kubernetes cluster; a harmless static page.',
      cost: 'Free & local',
      setup:
        'Create a new directory with index.html, a Dockerfile based on an official nginx image and a .dockerignore. Inspect licensing and requirements for your container runtime.',
      tasks: [
        'Use FROM nginx:stable-alpine and COPY index.html /usr/share/nginx/html/index.html as a minimal Dockerfile. Build the lecture image and record its ID.',
        'Run it using the loopback publish command. Request the page and inspect container logs. Stop and recreate it to prove image-based reproducibility.',
        'Change the page, rebuild under a new tag and compare the behavior. Explain why a tag is not an immutable content guarantee.',
        'Optional local Kubernetes: create a two-replica Deployment using a known reachable image, expose it with a ClusterIP Service and access via kubectl port-forward.',
        'Delete one disposable Pod, observe replacement, and explain what the controller restored and what application data it did not.',
      ],
      expected: 'An image build, request evidence, version comparison and a reconciliation explanation.',
      validate:
        'The server is reachable only at the intended local publish. No secrets or node_modules enter the build context. Recreated containers serve the intended image version.',
      troubleshooting:
        'If Kubernetes cannot pull a locally built image, load it into the local cluster using that tool’s documented method or use a reviewed registry image. Check context before every mutation.',
      cleanup:
        'Stop the created container and remove only the lab Deployment/Service and local cluster if disposable. Do not deploy AKS for this exercise.',
    },
    questions: [
      q(
        'What manages replica rollout in Kubernetes?',
        ['Deployment', 'DNS TTL', 'A disk checksum', 'A browser tab'],
        0,
        'A Deployment uses controllers and ReplicaSets to maintain the declared workload state.',
      ),
      m(
        'Which are useful when a Service has no working backend?',
        [
          'Pod readiness',
          'Selector/label match',
          'Endpoints and events',
          'Only changing the public hostname',
        ],
        [0, 1, 2],
        'Verify selection and health before assuming external DNS is the cause.',
      ),
      b(
        'A mutable image tag always identifies exactly the same content forever.',
        false,
        'Tags can be repointed. A digest identifies specific image content.',
      ),
      s(
        'Explain readiness versus liveness.',
        'Readiness controls whether a Pod should receive traffic. Liveness detects a condition that warrants restart. A dependency outage may justify not-ready without repeatedly restarting a healthy process.',
      ),
    ],
    assignment:
      'Document the image build, versioning policy, runtime configuration, health behavior and why you would or would not choose AKS.',
    review:
      'Recreate the workload, inspect a failed pull or selector mismatch in a disposable local context, and complete the quiz.',
    reviewQuestions: [
      'What state does a Deployment reconcile?',
      'Where does durable data live?',
      'How does the Service find Pods?',
    ],
  }),
  w({
    number: 20,
    title: 'CI/CD & cloud deployment',
    topics: ['GitHub Actions', 'Pipelines', 'Configuration', 'Secrets', 'Deployment strategies', 'Rollbacks'],
    objectives: [
      'Separate build, test and deployment.',
      'Use short-lived federated identity.',
      'Define a tested rollback unit.',
    ],
    sections: [
      {
        title: 'Promote the artifact you actually tested',
        body: 'Continuous integration validates changes through repeatable builds and tests. Continuous delivery prepares a releasable artifact; automatic production deployment adds another policy choice. A workflow has event triggers, jobs, runners and steps. Jobs can depend on previous jobs so deployment waits for successful checks. A green build proves only the checks you ran.\n\nBuild once and promote an immutable artifact rather than rebuilding independently for each environment. Record its commit and digest. Environment-specific configuration should be injected through a controlled interface rather than changing source files manually on the host. Keep secrets out of build logs and artifacts.',
      },
      {
        title: 'Deployment identity has a trust boundary',
        body: 'GitHub Actions can use OpenID Connect to request a short-lived token that Azure trusts through a federated identity configuration. The trust should restrict repository, branch or environment as appropriate. Grant the deployment principal only the Azure scope it needs. id-token: write permits obtaining an OIDC token; it does not itself grant Azure resource access.\n\nUse minimal workflow permissions, protected environments where appropriate and reviewed/pinned third-party actions. A pull request from an untrusted source must not receive production secrets or a privileged deployment path. Treat workflow edits as infrastructure access changes.',
      },
      {
        title: 'Rollback includes compatibility',
        body: 'Rolling deployment gradually replaces instances. Blue-green uses separate old and new environments with a traffic switch. Canary releases expose a small share of traffic before expansion. All need health criteria and an abort plan. A deployment that passes a shallow endpoint check can still fail real user operations.\n\nRollback means returning to a known-good artifact and compatible configuration. A destructive database migration can prevent an old application from running; use expand/contract migration patterns and backups where appropriate. Practice rollback in a disposable environment before calling the pipeline production-ready.',
        code: 'name: Validate\non: [push, pull_request]\npermissions:\n  contents: read\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm test\n      - run: npm run build',
        language: 'yaml',
      },
    ],
    terms: {
      Artifact: 'A built output identified and promoted through deployment.',
      OIDC: 'A protocol used here to federate workload identity.',
      Canary: 'A limited-exposure deployment used to evaluate a release.',
      Rollback: 'Restoring a known-good compatible release.',
    },
    misconception:
      'A secret masked in logs can still leak through transformed output, artifacts or an untrusted action.',
    summary:
      'Validate and promote known artifacts, restrict deployment trust and prove rollback with realistic health checks.',
    resources: [r.actions, r.oidc, r.well],
    lab: {
      title: 'Build a pipeline with a rollback rehearsal',
      tools:
        'A GitHub repository you control; local Git and Node. GitHub Actions usage may have account quotas.',
      cost: 'Free & local',
      setup:
        'Use a small sample application or fork of your own code. Keep the first workflow build-only. Review your account’s Actions usage limits before running repeatedly.',
      tasks: [
        'Create a validation workflow with checkout, dependency install, meaningful test and build steps.',
        'Introduce a failing test and verify deployment would be blocked by a failed validation job. Restore the test.',
        'Record the successful artifact’s commit and describe how it would be promoted without rebuilding.',
        'Draft an Azure OIDC trust configuration and least-privilege role assignment without storing a client secret. Deployment is optional.',
        'Release a local v1, replace it with v2, then restore v1 and run the same smoke test. Include a database compatibility discussion.',
      ],
      expected:
        'A workflow, intentional failure evidence, an identity design and a timed rollback rehearsal.',
      validate:
        'Checks fail on the intentional defect. Rollback restores the expected old behavior. Workflow logs contain no credentials.',
      troubleshooting:
        'A missing lockfile breaks npm ci; commit a correct lockfile rather than silently switching installs. Distinguish GitHub workflow permissions from Azure RBAC.',
      cleanup:
        'Disable unnecessary repeated workflow triggers and remove disposable artifacts according to retention. Optional Azure deployments require their own dedicated-group cleanup.',
    },
    questions: [
      q(
        'Why promote an immutable artifact?',
        [
          'To release the output that passed checks',
          'To skip all testing',
          'To embed secrets',
          'To avoid recording a commit',
        ],
        0,
        'Rebuilding separately can produce a different artifact than the one tested.',
      ),
      m(
        'Which constrain OIDC deployment trust?',
        [
          'Repository identity',
          'Branch/environment conditions',
          'Azure role scope',
          'A permanent broad client secret',
        ],
        [0, 1, 2],
        'Federation plus narrowly scoped authorization constrains what the workflow can do.',
      ),
      b(
        'Application rollback is always safe after a destructive schema migration.',
        false,
        'Old application versions may be incompatible with the changed data schema.',
      ),
      s(
        'Define a rollout abort condition.',
        'For example: abort if request failure rate exceeds the agreed threshold or a critical synthetic user operation fails during the observation window. Specify measurement, window and recovery action.',
      ),
    ],
    assignment:
      'Submit a pipeline design and rollback runbook including artifact identity, trust conditions and smoke-test criteria.',
    review:
      'Inspect the failed and successful workflow runs, rehearse rollback decisions and complete the assessment.',
    reviewQuestions: [
      'What exactly did your pipeline test?',
      'Which principal deploys?',
      'Can the previous version read the current data?',
    ],
  }),
  w({
    number: 21,
    title: 'Cloud security',
    topics: [
      'Identity security',
      'Least privilege',
      'Network controls',
      'Secrets',
      'Key Vault',
      'Posture',
      'Hardening',
    ],
    objectives: [
      'Model realistic threats.',
      'Replace embedded credentials with managed identity.',
      'Prioritize preventive and detective controls.',
    ],
    sections: [
      {
        title: 'Start with assets and abuse paths',
        body: 'Security design begins with what you are protecting: documents, credentials, service availability and control of the subscription. Identify entry points such as public HTTP endpoints, deployment workflows and administrator sessions. Trace how an attacker might move from a vulnerable app to its workload identity and data permissions. Network privacy alone does not stop an attacker already inside the permitted application.\n\nLeast privilege reduces blast radius by limiting both operations and scope. Separate deployment and runtime identities. Use MFA for human administration and avoid daily use of highly privileged accounts. Review stale access and service principals. Security posture tools can surface issues, but an enabled product is not proof that risk is resolved.',
      },
      {
        title: 'Secret management is a retrieval and rotation design',
        body: 'Key Vault stores secrets, keys and certificates with access controls and audit capabilities. A managed identity can request a token and read an authorized secret without keeping a bootstrap password in code. The application still needs network access, the correct data-plane role and sensible failure behavior if the vault is unavailable. Avoid retrieving every secret on every request without considering caching and throttling.\n\nRotation needs a compatibility window and a verification procedure. If you replace a credential but the application caches the old value forever, rotation can cause an outage. Remove real secrets from logs, repositories and build outputs. If a credential leaks, revoke or rotate it; deleting a Git commit does not invalidate an already copied credential.',
      },
      {
        title: 'Harden in layers and verify negative cases',
        body: 'Apply trusted images, timely patches, minimal exposed ports, HTTPS, narrow identities and dependency review. Use explicit ingress and egress assumptions. Test that an unauthorized principal cannot perform the protected action, not just that the happy path works. Log security-relevant events without collecting secret values or excessive personal data.\n\nPrioritize by impact and likelihood. Public write access to sensitive storage deserves immediate attention; a minor cosmetic benchmark warning may not. Record accepted risks with a rationale and review date. Do not run intrusive security scans against systems you do not own or have permission to test.',
      },
    ],
    terms: {
      'Threat model': 'An analysis of assets, entry points and plausible abuse paths.',
      'Blast radius': 'The scope of damage one compromised component can cause.',
      Rotation: 'Replacing credentials and validating continued operation.',
      'Defense in depth': 'Several complementary controls across boundaries.',
    },
    misconception:
      'Moving a secret into Key Vault is only part of the solution; access, retrieval, rotation and logging behavior still matter.',
    summary:
      'Map abuse paths, separate identities, protect secret lifecycles and test denied actions as well as successful ones.',
    resources: [r.vault, r.rbac, r.well, r.oidc],
    lab: {
      title: 'Threat-model and harden the capstone',
      tools: 'Your capstone design/code, text editor; optional authorized Key Vault.',
      cost: 'Potentially billable',
      setup:
        'Begin with a local design review. Optional vault operations may incur charges; use dummy secret values and a dedicated lab group.',
      tasks: [
        'Identify five assets and three realistic abuse paths, including a compromised deployment workflow.',
        'Audit repository and build configuration for embedded credentials without printing any found secret. Rotate real exposed credentials through their provider.',
        'Design separate runtime/deployment roles and a managed-identity vault retrieval path.',
        'Write one authorized and one unauthorized secret-read test. Optional: execute with dummy data in your own lab.',
        'Create a prioritized hardening backlog with rationale, evidence and accepted-risk review dates.',
      ],
      expected: 'A threat model, secret-lifecycle design and evidence-based security checklist.',
      validate:
        'Each important risk maps to a preventive or detective control. Unauthorized access is explicitly tested or specified.',
      troubleshooting:
        'A vault 403 can involve data authorization or network restrictions. Read diagnostic evidence rather than granting broad Owner access.',
      cleanup:
        'Remove dummy secrets and temporary access. Vault soft-delete and retention can affect name reuse and cleanup; inspect current behavior and retained resources.',
    },
    questions: [
      q(
        'What should happen after a real credential leaks?',
        [
          'Revoke or rotate it',
          'Only hide the commit',
          'Only rename the file',
          'Wait for the next course week',
        ],
        0,
        'Removing visible text does not invalidate a copied credential.',
      ),
      m(
        'Which reduce the impact of a compromised runtime?',
        [
          'Narrow data permissions',
          'Separate deployment identity',
          'Minimal network exposure',
          'Subscription-wide Owner for convenience',
        ],
        [0, 1, 2],
        'Separation and least privilege reduce the reachable operations and resources.',
      ),
      b(
        'A private endpoint removes the need to authorize secret reads.',
        false,
        'Private reachability and authorization remain independent controls.',
      ),
      s(
        'Explain a safe secret rotation sequence.',
        'Create/activate a replacement through the service’s supported process, update or refresh consumers, verify successful operation during a compatibility window, then revoke the old credential and audit for errors.',
      ),
    ],
    assignment:
      'Submit a threat model and security review with five prioritized findings and concrete verification steps.',
    review:
      'Trace one abuse path through your controls, assess unauthorized tests and complete the security quiz.',
    reviewQuestions: [
      'What can the runtime identity change?',
      'What happens when the vault is unavailable?',
      'How do you know rotation succeeded?',
    ],
  }),
  w({
    number: 22,
    title: 'Monitoring & reliability',
    topics: [
      'Azure Monitor',
      'Log Analytics',
      'Application Insights',
      'Alerts',
      'Observability',
      'Incidents',
      'Recovery',
    ],
    objectives: [
      'Choose user-centered reliability indicators.',
      'Correlate metrics, logs and traces.',
      'Write an actionable incident and recovery runbook.',
    ],
    sections: [
      {
        title: 'Measure what the user needs',
        body: 'Monitoring asks whether known conditions are occurring; observability helps explain internal behavior from outputs. Metrics summarize quantities over time, logs record events and traces connect spans in one distributed request. A correlation identifier lets you follow an API call into a dependency. Collecting all possible data is expensive and can expose sensitive information, so choose signals deliberately.\n\nAn SLI is a measurement such as successful upload requests divided by valid upload attempts. An SLO sets a target over a time window. Define exclusions and denominators carefully; a health endpoint returning 200 while uploads fail is a poor proxy for the user’s experience. Latency distributions such as the 95th percentile reveal slow tails hidden by averages.',
      },
      {
        title: 'Azure’s signals need context and retention',
        body: 'Azure Monitor includes platform metrics and log capabilities. Log Analytics workspaces store queryable logs, while Application Insights supports application performance telemetry. Instrumentation must be configured and verified; installing an SDK alone does not guarantee every dependency is visible. Workspace region, access, retention and ingestion volumes affect governance and cost.\n\nA KQL query filters and summarizes records. Table names depend on the data source and collection configuration. Begin by inspecting the actual workspace schema, then select a bounded time range. Do not blindly copy a query using an unavailable table and conclude the system has no errors.',
        code: '// Example for a workspace-based Application Insights table\nAppRequests\n| where TimeGenerated > ago(1h)\n| summarize Requests=count(), Failures=countif(Success == false)\n    by bin(TimeGenerated, 5m)\n// Confirm the table/schema in your own workspace first.',
        language: 'kql',
      },
      {
        title: 'Alerts should initiate a useful response',
        body: 'An alert needs a signal, threshold/window, destination and action. Too many low-value alerts train operators to ignore them. Alert on user impact and urgent failure conditions; use dashboards and tickets for lower urgency trends. Every page should link to a runbook with verification, safe mitigations, escalation and rollback criteria. Test the notification path, not only the query.\n\nDuring an incident, establish a timeline, scope the impact, stabilize service and preserve evidence. After recovery, document contributing factors and improvements without blaming the last person to touch the system. A recovery drill should measure actual restoration time and data loss against RTO/RPO.',
      },
    ],
    terms: {
      SLI: 'A quantitative indicator of service behavior.',
      SLO: 'A target for an SLI over a stated window.',
      Trace: 'A connected set of spans describing one request’s work.',
      KQL: 'Kusto Query Language for querying supported telemetry.',
    },
    misconception:
      'Averages and host CPU alone can hide a failing user operation. Monitor the operation and its dependencies.',
    summary:
      'Instrument user journeys, bound telemetry cost, make alerts actionable and rehearse incident recovery.',
    resources: [r.monitor, r.well, r.backup],
    lab: {
      title: 'Run an incident tabletop and telemetry drill',
      tools:
        'Local application logs; optional Azure Monitor/Application Insights in a dedicated environment.',
      cost: 'Potentially billable',
      setup:
        'Use local structured logs for a free rehearsal. Optional Azure telemetry needs a reviewed ingestion/retention budget and dummy data only.',
      tasks: [
        'Define an upload success SLI and latency objective with a time window and denominator.',
        'Emit structured local logs with timestamp, request ID, result and elapsed time. Avoid document contents and credentials.',
        'Introduce a controlled local dependency failure and correlate the user error with its request ID.',
        'Write an alert specification and runbook. Optional: test an Azure alert/action group and confirm receipt.',
        'Run a 20-minute incident tabletop: detect, scope, mitigate, recover and write a timeline plus two improvement actions.',
      ],
      expected: 'SLI definitions, correlated failure evidence, alert/runbook and an incident report.',
      validate:
        'The runbook can be followed without guessing a target or credential. The alert is linked to a meaningful user symptom.',
      troubleshooting:
        'Empty telemetry can mean wrong time range, collection configuration, workspace or schema. Confirm ingestion before diagnosing the application from missing data.',
      cleanup:
        'Stop deliberate failures, disable temporary alerts and remove optional dedicated resources after saving sanitized evidence. Check workspace retention and ongoing ingestion.',
    },
    questions: [
      q(
        'Which is a user-centered SLI?',
        [
          'Successful uploads / valid upload attempts',
          'Number of dashboard colors',
          'Number of VM names',
          'Only installed RAM',
        ],
        0,
        'The ratio directly represents whether the user operation succeeds.',
      ),
      m(
        'Which make an alert actionable?',
        ['Clear symptom', 'Runbook link', 'Response destination', 'No owner or instructions'],
        [0, 1, 2],
        'An alert needs a response path and useful context.',
      ),
      b(
        'A 200 response from /health guarantees every application function works.',
        false,
        'A shallow health check may not exercise uploads, identity or dependencies.',
      ),
      s(
        'Why use correlation IDs?',
        'They connect application and dependency events belonging to the same operation, helping distinguish one failed request from unrelated activity in the same time window.',
      ),
    ],
    assignment:
      'Submit an observability and incident-response package with measured failure evidence and recovery objectives.',
    review:
      'Evaluate whether your alert would catch the lab failure, refine the runbook and complete the assessment.',
    reviewQuestions: [
      'What does your denominator exclude?',
      'How do you detect missing telemetry?',
      'What action follows a page?',
    ],
  }),
  w({
    number: 23,
    title: 'Capstone implementation',
    topics: ['Architecture', 'IaC', 'Deployment', 'Identity', 'Monitoring', 'Cost', 'Documentation'],
    objectives: [
      'Integrate the full engineering workflow.',
      'Demonstrate a deployed or reproducible Azure solution.',
      'Validate recovery, security and cost controls.',
    ],
    sections: [
      {
        title: 'Build a small system with complete operations',
        body: 'Implement a production-style document or task application on Azure. The application itself may be small; the engineering work is the reproducible infrastructure, controlled access, deployment and operations. A recommended low-complexity design uses a managed web/container host, external Blob Storage, managed identity, Key Vault only where an actual secret is required, and application telemetry. Choose private connectivity only when you can justify and fund its additional components.\n\nNo permanent paid environment is required. Develop locally, validate IaC, deploy for a short documented demonstration window if you can authorize costs, then destroy it. A local-only submission is a valuable rehearsal but must be labeled honestly as not an Azure deployment. Full cloud-demonstration credit requires evidence from an actual authorized Azure deployment or an available sponsored sandbox.',
      },
      {
        title: 'Milestones produce reviewable evidence',
        body: 'Milestone 1: freeze requirements, architecture and cost assumptions. Milestone 2: version infrastructure and validate the plan. Milestone 3: build and test an immutable application artifact. Milestone 4: deploy using a narrowly scoped workflow identity. Milestone 5: verify runtime data access, denied access, logs and recovery. Milestone 6: document and remove resources.\n\nKeep an evidence index linking each requirement to a command output, screenshot, test or decision. Sanitization matters: resource IDs can be useful, but secrets and personal data do not belong in a public portfolio. Record tool versions and region because another operator will need them to reproduce the result.',
      },
      {
        title: 'Test a failure before declaring completion',
        body: 'Demonstrate a restart without losing persistent data, one unauthorized data request denied, one failed dependency diagnosed, one release rollback and one restore test. State what remains untested, such as region failure. A professional handoff describes limitations and tradeoffs, not just success screenshots.\n\nThe minimum deliverables are an architecture diagram, code and IaC repository, pipeline, role matrix, cost report, deployment/rollback/recovery runbooks and a short presentation. Optional challenges include private endpoints with proven DNS, a canary release, reusable modules, policy checks and load testing limited to your own authorized environment. They earn depth only after core behavior works.',
      },
    ],
    terms: {
      'Evidence index': 'A map from requirements to verifiable artifacts.',
      'Acceptance test': 'A test establishing a stated requirement.',
      Runbook: 'A repeatable operational procedure.',
      'Demonstration window': 'A short, planned interval for live deployment and validation.',
    },
    misconception:
      'A running URL alone is not a complete cloud engineering capstone; operations and reproducibility are core deliverables.',
    summary:
      'Prefer a small, well-operated system. Link every requirement to evidence and keep the live environment temporary.',
    resources: [r.well, r.terraform, r.oidc, r.monitor, r.cost],
    lab: {
      title: 'Implement the Azure capstone',
      tools:
        'Git, your application toolchain, Azure CLI, Terraform or Bicep, GitHub Actions and an authorized Azure subscription for full deployment credit.',
      cost: 'Potentially billable',
      setup:
        'Read the full capstone specification in the Capstone page. Review current prices, set alerts, choose a dedicated group and define a short deployment window. Never assume the entire design is free.',
      tasks: [
        'Implement the architecture and requirements from the Capstone page. Keep state, credentials and local environment files out of version control.',
        'Validate the IaC and review the plan/what-if for exact subscription, region and deletions.',
        'Run the pipeline and record commit/artifact identity. Deploy only after checks pass.',
        'Execute persistence, access-denial, dependency-failure, rollback and recovery tests with sanitized evidence.',
        'Complete all operational documents, cost reconciliation and teardown verification.',
      ],
      expected: 'A complete evidence package and a reproducible application infrastructure solution.',
      validate:
        'Each capstone requirement has a linked test or artifact. Actual Azure work is clearly distinguished from local rehearsal.',
      troubleshooting:
        'Triage by layer and record blockers. A quota or billing constraint is a reason to revise scope, not to hide an incomplete deployment claim.',
      cleanup:
        'Destroy only reviewed capstone resources. Check for retained disks, telemetry, vaults, backups and registries. Export evidence before deleting the live environment.',
    },
    questions: [
      q(
        'What best demonstrates reproducibility?',
        [
          'A reviewed repository and successful recreation procedure',
          'Only a screenshot',
          'An undocumented portal change',
          'A secret in a README',
        ],
        0,
        'Another operator needs configuration, versions, instructions and verified behavior.',
      ),
      m(
        'Which are required capstone evidence?',
        ['Access-denial test', 'Rollback test', 'Cost/cleanup report', 'A permanently running paid cluster'],
        [0, 1, 2],
        'The project values operational evidence and does not require a permanent cluster.',
      ),
      b(
        'A local-only rehearsal should be presented as an actual Azure deployment.',
        false,
        'Label execution evidence accurately. Local rehearsal and cloud deployment prove different things.',
      ),
      s(
        'How would you reduce capstone cost without hiding requirements?',
        'Use a small managed hosting design, develop locally, deploy only during a short evidence window, collect tests and then tear down. Explain any omitted requirement or substitute explicitly.',
      ),
    ],
    assignment:
      'Submit the capstone evidence index and documentation draft, including open issues ranked by impact.',
    review:
      'Perform a requirement-by-requirement readiness review, close the most important gaps and complete the quiz before the final defense.',
    reviewQuestions: [
      'Can you recreate the environment?',
      'Which test proves denied access?',
      'What remains billable after teardown?',
    ],
  }),
  w({
    number: 24,
    title: 'Final examination & capstone defense',
    topics: [
      'Practical examination',
      'Architecture review',
      'Troubleshooting',
      'Presentation',
      'Final rubric',
      'Completion',
    ],
    objectives: [
      'Defend design decisions and limitations.',
      'Diagnose realistic cross-layer failures.',
      'Present an auditable completion portfolio.',
    ],
    sections: [
      {
        title: 'Present the system as an operator',
        body: 'Prepare a 15-minute presentation: two minutes on requirements, three on architecture and tradeoffs, four on deployment and identity, four on failure/recovery evidence and two on costs and limitations. Do not spend the whole defense touring application features. The audience needs to know how the system is deployed, secured, observed, recovered and removed.\n\nYour diagram must match what you actually built. If the design changed, update the document and explain the new decision. Mark design-only components clearly. Include the exact commit or artifact used in your demonstration, not just a link to the current default branch.',
      },
      {
        title: 'Practical technical assessment',
        body: 'Use three scenarios. Scenario A: the application starts but storage reads return 403. Identify the actual workload identity, data role and scope, then inspect network restrictions without assuming the status proves one unique cause. Scenario B: a private storage hostname resolves publicly from the application environment. Inspect resolver path, zone records, links and forwarding before changing firewall rules. Scenario C: a new release increases error rates. Establish the affected version and dependencies, evaluate rollback compatibility and restore the previous artifact using the runbook.\n\nFor each scenario, state the initial hypothesis, evidence sought, safe test, correction and verification. You may conduct a tabletop if deliberately breaking cloud infrastructure is too costly; identify which statements are observed and which are reasoned.',
      },
      {
        title: 'Close the academic record honestly',
        body: 'Take the cumulative final written assessment, then grade the capstone/practical using the published criteria. Objective results enter the weekly-quiz category; the final practical score contributes 20%. Laboratory and documentation marks are separate categories. Missing work is ungraded, while a submitted score of zero is a real grade.\n\nThe academy considers the program complete when all 72 sessions are marked complete, every required grade is recorded and the overall earned grade reaches 75%. A short-answer score is self-assessment, not automated language evaluation. Export a final backup and archive the portfolio. Your next development plan should name specific weak areas and practice tasks rather than assuming a passing mark ends learning.',
      },
    ],
    terms: {
      Defense: 'A technical explanation of decisions supported by evidence.',
      Remediation: 'Focused work addressing a demonstrated gap.',
      Portfolio: 'A curated set of reproducible technical evidence.',
      Completion: 'Meeting the academy’s stated work and grade requirements.',
    },
    misconception:
      'Passing an objective quiz does not prove operational competence; the practical evidence and defense carry distinct weight.',
    summary:
      'Show the implemented system, investigate failures with evidence, record honest grades and preserve the final portfolio.',
    resources: [r.well, r.monitor, r.rbac, r.private],
    lab: {
      title: 'Final practical assessment and presentation',
      tools:
        'Your capstone repository, evidence index, runbooks and diagram; optional short-lived Azure demonstration.',
      cost: 'Potentially billable',
      setup:
        'Freeze a release and verify your evidence links. If demonstrating live, confirm costs and teardown targets before starting. Read the final rubric on the Capstone page.',
      tasks: [
        'Present the architecture, live or recorded deployment evidence and one complete request path.',
        'Demonstrate or tabletop the three troubleshooting scenarios in the lecture, labeling observations versus assumptions.',
        'Show the rollback and restore reports, including actual timing and content validation.',
        'Walk through least-privilege access, secret handling and the denied-operation test.',
        'Record the final practical rubric scores, export the academic backup and verify cloud teardown.',
      ],
      expected: 'A final presentation, scenario responses, scored rubric and archived program evidence.',
      validate:
        'The presentation references an exact release. Every claimed behavior is backed by evidence or explicitly marked as an unexecuted design claim.',
      troubleshooting:
        'If a live demonstration fails, use the incident process and explain the evidence rather than hiding the issue. Recorded reproducible evidence can still support the defense.',
      cleanup:
        'Remove the dedicated demonstration resources after preserving evidence. Review remaining services, soft-delete retention and billing inventory.',
    },
    questions: [
      q(
        'A 403 on a blob read should first lead you to:',
        [
          'Collect identity, role, scope and network evidence',
          'Grant subscription Owner immediately',
          'Delete the VNet blindly',
          'Disable all logging',
        ],
        0,
        'Collect context across authorization and network controls before changing permissions.',
      ),
      m(
        'Which make a final defense credible?',
        [
          'Exact release identity',
          'Measured recovery results',
          'Explicit limitations',
          'Unsupported guarantees',
        ],
        [0, 1, 2],
        'Evidence and clear limits make claims assessable.',
      ),
      b(
        'Missing work and a recorded zero should be displayed identically.',
        false,
        'Missing means not assessed; zero is a real assessed result. Their academic implications differ.',
      ),
      s(
        'A deployment rollback fails after a schema change. What should the runbook have addressed?',
        'Compatibility between old application and current schema/data, an expand/contract migration strategy, recovery options and a tested abort/restore procedure. Rolling back code alone may be unsafe.',
      ),
    ],
    assignment:
      'Submit the final portfolio, presentation, self-assessment and a 30-day improvement plan based on your weakest criteria.',
    review:
      'Complete the cumulative final exam, record rubric scores, review missing assessments and export the final academic record.',
    reviewQuestions: [
      'Which claim is least supported by your evidence?',
      'What would you improve before a real production launch?',
      'Can someone else use your recovery runbook?',
    ],
  }),
];
