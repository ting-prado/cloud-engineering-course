import { defineWeek as w, single as q, multiple as m, bool as b, short as s } from './helpers';
import { resources as r } from './resources';
export const azure = [
  w({
    number: 9,
    title: 'Azure architecture',
    topics: ['Regions & zones', 'Subscriptions', 'Management groups', 'Resource groups', 'Resource Manager'],
    objectives: [
      'Map Azure management scopes.',
      'Distinguish regions from availability zones.',
      'Organize resources by lifecycle and responsibility.',
    ],
    sections: [
      {
        title: 'Two maps: physical placement and management scope',
        body: 'Azure has a physical geography and a logical management hierarchy. A region is a geographic area with one or more data centers connected by a regional network. Availability zones, where supported, separate facilities with independent power, cooling and networking. Deploying two instances in one zone does not protect against a zone-wide failure. Region and zone support vary by service and SKU, so verify the exact offering before using a diagram as a deployment promise.\n\nA Microsoft Entra tenant is an identity directory. A subscription is a billing and management boundary associated with a tenant. Management groups organize subscriptions for inherited governance. Resource groups contain resources managed together. A resource group’s metadata location does not force every contained resource into that region.',
      },
      {
        title: 'Lifecycle is a useful resource-group boundary',
        body: 'A resource group is often best organized around resources that are deployed, operated and removed together. Put disposable learning resources in a dedicated group with clear owner and expiration tags. Shared services that must outlive the lab should have a different lifecycle boundary. Deleting a group can delete its contained resources, so sharing a group across unrelated projects makes cleanup risky.\n\nAzure Resource Manager is the management plane accepting deployment and management requests. Resource providers handle service-specific resource types such as Microsoft.Compute/virtualMachines. A resource ID describes its subscription, group, provider, type and name. Learning to read IDs helps detect wrong-subscription mistakes and understand access scopes.',
      },
      {
        title: 'Governance inherits through scopes',
        body: 'RBAC assignments and policies can apply at management group, subscription, resource group or resource scopes. Broad assignments can flow down to many resources. A Reader role at subscription scope is far broader than the same role on a single lab group. Tags add searchable metadata such as owner, environment and expires; they do not themselves enforce access or automatically propagate to all child resources.\n\nBefore any operation, confirm your tenant, subscription and target group. The following read-only CLI commands inspect context and inventory. Sign-in and CLI installation are covered in Week 17; portal equivalents are acceptable now.',
        code: 'az account show --query "{name:name,id:id,tenant:tenantId}" -o table\naz group list --query "[].{name:name,location:location}" -o table\naz resource list --query "[].{name:name,type:type,group:resourceGroup}" -o table',
        language: 'shell',
      },
    ],
    terms: {
      Region: 'A geographic deployment area with service-specific capabilities.',
      Zone: 'A physically separated failure boundary within a supported region.',
      Tenant: 'An Entra identity directory.',
      'Resource group': 'A logical container for related Azure resources.',
    },
    misconception:
      'A resource group is a management container, not a virtual network or a guarantee of physical co-location.',
    summary:
      'Keep physical failure domains separate from logical scopes. Design resource groups around lifecycle, then apply appropriate access and policy.',
    resources: [r.architecture, r.video, r.rbac],
    lab: {
      title: 'Map an Azure environment',
      tools: 'Azure portal; an existing subscription is optional for inventory. A diagram editor.',
      cost: 'Free & local',
      setup:
        'Use documentation for a no-account design exercise, or inspect only an authorized subscription. Do not deploy resources.',
      tasks: [
        'Draw management group → subscription → resource group → resource. Add the Entra tenant as the identity directory, not as a physical region.',
        'Design separate capstone and shared-resource groups with owner, environment and expiration metadata.',
        'Compare two regions for a desired compute service and zone support in current documentation. Record actual capabilities.',
        'If you have access, inspect one resource ID and annotate its segments. Otherwise annotate the ID format from Microsoft documentation.',
        'Write a deletion impact statement for each proposed group.',
      ],
      expected: 'A scope diagram, region comparison and lifecycle plan.',
      validate:
        'The diagram distinguishes billing, identity, geography and resource lifecycle. No shared permanent service sits in a disposable group without explanation.',
      troubleshooting:
        'An empty subscription list may indicate the wrong tenant or missing access. Do not create a paid subscription just to populate the inventory.',
      cleanup: 'Read-only exercise; confirm no deployment was submitted.',
    },
    questions: [
      q(
        'What is an availability zone?',
        [
          'A resource group',
          'A physically separate failure boundary within a supported region',
          'An identity group',
          'An invoice',
        ],
        1,
        'Zones separate facilities within supported regions. Support remains service-specific.',
      ),
      m(
        'Which are Azure RBAC assignment scopes?',
        ['Subscription', 'Resource group', 'Resource', 'A CSS class'],
        [0, 1, 2],
        'Azure RBAC attaches to management scopes, not application presentation structures.',
      ),
      b(
        'Every resource in a resource group must use the group’s metadata region.',
        false,
        'Resources can have different locations, subject to the service’s own constraints.',
      ),
      s(
        'Why keep a shared DNS zone outside a disposable lab group?',
        'It has a different lifecycle. Deleting the lab group should not remove shared dependencies used by other workloads.',
      ),
    ],
    assignment:
      'Submit the management hierarchy, region choices and resource-group lifecycle plan for the capstone.',
    review:
      'Review the physical and logical maps independently, annotate a resource ID and test the scope concepts in the quiz.',
    reviewQuestions: [
      'What does a resource ID tell you?',
      'Which boundary handles identity? Billing?',
      'Why might two instances fail together?',
    ],
  }),
  w({
    number: 10,
    title: 'Choosing Azure compute',
    topics: ['VMs', 'App Service', 'Functions', 'Container Apps', 'AKS', 'Compute tradeoffs'],
    objectives: [
      'Choose compute based on requirements.',
      'Explain platform operational responsibilities.',
      'Match scaling and execution models to a workload.',
    ],
    sections: [
      {
        title: 'Start with the workload, not the service name',
        body: 'A VM gives control over the guest operating system, installed software and long-lived processes. That flexibility comes with patching, hardening, backup and capacity work. App Service provides managed web hosting with platform-supported runtimes and deployment mechanisms. You configure the application and plan; the provider operates more of the host environment. An App Service plan’s capacity and billing lifecycle are distinct from a single app’s content.\n\nAsk concrete questions: Is the workload HTTP or event-driven? Does it need a custom kernel? Can it be stateless? Does it need private connectivity? What are the latency, runtime and compliance constraints? Those requirements eliminate choices more effectively than a popularity ranking.',
      },
      {
        title: 'Events and containers introduce different units of operation',
        body: 'Azure Functions runs event-driven functions using a hosting plan with specific scaling, timeout and networking behavior. “Serverless” describes the operating interface; servers still exist and consumption still has costs. A short queue-triggered image resize may fit better than a continuously running stateful process. Do not assume every plan scales to zero or has the same cold-start characteristics.\n\nContainer Apps offers managed container application hosting with revisions and scaling options. AKS offers a managed Kubernetes control plane while leaving substantial responsibility for workload configuration, node pools, policy, upgrades and observability. Kubernetes can solve orchestration needs, but running one simple API does not automatically justify its complexity.',
      },
      {
        title: 'State determines whether replication is safe',
        body: 'An application that stores sessions only in one process cannot assume the next request reaches the same replica. Move durable state to a suitable external store and design requests to tolerate instance replacement. Local container files may disappear when a replica is recreated. Health checks should represent readiness to serve traffic rather than merely process existence.\n\nFor a capstone, prefer the smallest service that demonstrates requirements. A managed web host plus external storage can show identity, deployment, logging and operations without operating a cluster. Record why you rejected alternatives; this is an engineering decision, not a missing feature.',
        diagram: [
          'Client · HTTPS',
          'Managed web host · interchangeable replicas',
          'External data store · durable state',
          'Monitor + identity · cross-cutting controls',
        ],
      },
    ],
    terms: {
      Stateless: 'Not relying on one process’s local state between requests.',
      'Cold start': 'Initialization delay when a new execution environment starts.',
      Replica: 'An instance of a workload.',
      'Control plane': 'The management system coordinating service behavior.',
    },
    misconception:
      'Managed Kubernetes does not mean all cluster and workload operations are handled for you.',
    summary:
      'Choose an execution model by workload needs, isolate persistent state and account for the operations each service leaves to you.',
    resources: [r.compute, r.vm, r.docker],
    lab: {
      title: 'Make a compute decision record',
      tools: 'Official service documentation, text editor, optional existing local web application.',
      cost: 'Free & local',
      setup:
        'Choose a small API, a scheduled report and a legacy application needing OS-level customization. No deployment is required.',
      tasks: [
        'For each workload, list execution trigger, expected runtime, state, networking and operational needs.',
        'Compare VM, App Service, Functions, Container Apps and AKS against those needs.',
        'Move an example in-memory session into a conceptual external store and describe how replica replacement changes behavior.',
        'Select a capstone compute option with a dated cost estimate and a clear rollback unit.',
        'Write a rejected-alternatives section including one reason not to use AKS for a small demo.',
      ],
      expected: 'Three workload comparisons and one justified capstone decision.',
      validate:
        'The selected service satisfies stated requirements and the document includes remaining customer responsibilities.',
      troubleshooting:
        'Avoid comparing a service name with an entire architecture. Networking, identity and storage requirements must be evaluated alongside hosting.',
      cleanup: 'No cloud resources created.',
    },
    questions: [
      q(
        'Which requirement most strongly points toward a VM?',
        ['Custom guest kernel module', 'A static logo', 'A DNS alias', 'A short Markdown file'],
        0,
        'Guest OS and kernel control is a VM use case.',
      ),
      m(
        'Which can make horizontal scaling safer?',
        ['External durable state', 'Readiness checks', 'Local-only sessions', 'Repeatable deployment'],
        [0, 1, 3],
        'Local-only sessions couple users to one process and complicate replica replacement.',
      ),
      b(
        'Serverless always means zero cost when no requests arrive.',
        false,
        'Hosting plans, minimum replicas, storage and ancillary services can still cost money.',
      ),
      s(
        'Why might App Service be preferable to AKS for your capstone?',
        'A small web app can use managed hosting with fewer operational components while still demonstrating deployment, identity and monitoring. AKS adds cluster concepts and node responsibilities that need a requirement to justify them.',
      ),
    ],
    assignment:
      'Submit an architecture decision record selecting compute, including state handling, scaling assumptions, costs and alternatives.',
    review:
      'Challenge your chosen service with a restart and traffic spike scenario, then assess service-model distinctions.',
    reviewQuestions: [
      'What does an App Service plan represent?',
      'What state can an instance safely lose?',
      'Which operational tasks remain in AKS?',
    ],
  }),
  w({
    number: 11,
    title: 'Azure core services',
    topics: ['Storage', 'Virtual networks', 'Entra ID', 'RBAC', 'Governance', 'Monitoring'],
    objectives: [
      'Connect storage, networking and identity.',
      'Separate management-plane and data-plane access.',
      'Select meaningful monitoring signals.',
    ],
    sections: [
      {
        title: 'Storage is a family of interfaces',
        body: 'Azure Blob Storage stores objects addressed by container and blob name, well suited for uploads, exports and static assets. Azure Files provides managed file shares for applications expecting filesystem protocols. VM managed disks provide block storage to a guest. These interfaces are not interchangeable: a program expecting POSIX filesystem behavior cannot automatically treat an object store as a local disk.\n\nA storage account defines an administrative boundary with location, redundancy and security configuration. A blob container groups objects; it is unrelated to a Docker container. Choose based on access pattern, consistency needs, latency and recovery requirements rather than simply the word “storage.”',
      },
      {
        title: 'Authentication, authorization and reachability are separate',
        body: 'Entra ID authenticates identities and issues tokens. Azure RBAC authorizes actions for a principal at a scope. An identity can authenticate correctly yet lack permission to read a blob. Management-plane access to configure an account does not necessarily grant data-plane access to read its contents. Use a data-specific role such as Storage Blob Data Reader for blob reads when appropriate.\n\nA VNet provides private address space for supported Azure resources. Network controls decide whether a request can reach an endpoint; identity controls decide whether the request may perform an operation. A private endpoint improves private reachability but does not replace application authorization. Diagnose DNS, route, filtering and identity in that order rather than repeatedly granting Owner.',
      },
      {
        title: 'Governance and observability close the loop',
        body: 'Tags describe ownership and purpose. Policy evaluates whether resource configuration follows rules, while locks reduce accidental management changes. None replaces a backup. Azure Monitor collects signals including metrics and logs. Metrics are numeric time series such as CPU utilization; logs are event records queried by time and fields; traces connect work across components.\n\nStart with a user symptom such as failed uploads. Observe request failure rate, latency and storage authorization failures. A green VM CPU chart cannot prove that uploads work. Decide what evidence would detect each important failure before building a dashboard.',
      },
    ],
    terms: {
      Blob: 'An object in object storage.',
      Principal: 'An identity requesting access.',
      'Data plane': 'Operations on service data rather than resource configuration.',
      Metric: 'A numeric signal measured over time.',
    },
    misconception:
      'Being able to view a storage account in the portal does not necessarily mean you can read every blob inside it.',
    summary:
      'A usable service requires the right storage interface, network path and authorization. Monitor the user operation across those boundaries.',
    resources: [r.storage, r.vnet, r.identity, r.monitor],
    lab: {
      title: 'Design a secure upload path',
      tools: 'Diagram editor and official documentation; optional read-only portal access.',
      cost: 'Free & local',
      setup: 'Use a hypothetical photo-upload API. Work on a design before creating billable resources.',
      tasks: [
        'Draw client → web API → blob container. Identify where user authentication ends and workload identity begins.',
        'List management actions separately from blob read/write actions and assign the narrowest plausible roles.',
        'Compare a public authenticated storage endpoint with a private endpoint design. Include required DNS and network connectivity.',
        'Choose three signals to investigate failed uploads and define a sample alert condition.',
        'Write a governance checklist for ownership tags, region and access review.',
      ],
      expected: 'An annotated architecture, role matrix and monitoring plan.',
      validate:
        'The API uses its own workload identity; a private network is not presented as a substitute for authorization.',
      troubleshooting:
        'If a role appears correct, verify the scope, data actions and identity actually used. A token for one audience cannot simply be reused for every service.',
      cleanup: 'No resources created. Keep the design for the foundation examination.',
    },
    questions: [
      q(
        'Which interface best fits objects such as uploaded photos?',
        ['Blob Storage', 'A CPU register', 'A resource lock', 'A DNS zone'],
        0,
        'Blob storage is object storage, appropriate for file-like objects accessed by key.',
      ),
      m(
        'Which must be investigated for a failed private blob read?',
        ['DNS resolution', 'Network path', 'Data-plane permission', 'Only the CSS'],
        [0, 1, 2],
        'Reachability and authorization are independent requirements.',
      ),
      b(
        'Resource group Reader always grants blob content access.',
        false,
        'Management read access and blob data actions are separate.',
      ),
      s(
        'Choose two signals for an upload failure investigation.',
        'Application request failures and storage authorization/error logs can correlate the user symptom with the storage dependency. Include time range and correlation identifiers.',
      ),
    ],
    assignment:
      'Submit the secure upload architecture and a responsibility/access matrix for its components.',
    review:
      'Use your upload design to rehearse network versus authorization failures, then complete the quiz.',
    reviewQuestions: [
      'How is a blob different from a disk?',
      'What does a token prove?',
      'Which signal represents successful uploads?',
    ],
  }),
  w({
    number: 12,
    title: 'Foundation examination & project',
    topics: ['Written examination', 'Infrastructure design', 'Architecture diagram', 'Technical defense'],
    objectives: [
      'Integrate the first semester’s concepts.',
      'Defend an infrastructure design with evidence.',
      'Identify failure boundaries and recovery requirements.',
    ],
    sections: [
      {
        title: 'Turn requirements into a defensible design',
        body: 'Your client needs a small internal document service. Twenty users upload documents, browse metadata and retrieve files. Data must survive an application restart. The service should use authenticated access, avoid public write access and have a documented recovery procedure. Begin with requirements and assumptions, not a list of Azure products. Define data sensitivity, likely traffic, acceptable downtime and the amount of data loss the client can tolerate.\n\nSeparate the request path from management access. Users need the application; operators need controlled configuration access. Your application may need storage data access but should not create arbitrary subscription resources. The architecture must show both paths without confusing network connectivity and authorization.',
      },
      {
        title: 'Written examination instructions',
        body: 'Use the examination page for a cumulative written assessment. Allow 60 minutes. Objective items are graded automatically after submission; short answers require a self-score against the revealed model and rubric. Keep notes closed for the first attempt, then review every explanation and write a correction for each missed concept. The written result is recorded with weekly quizzes; the separately graded foundation practical contributes 10% of the program grade.\n\nA good explanation states the mechanism and a limitation. “Use redundancy” is incomplete; “place two stateless web replicas across supported zones, while separately protecting the shared data dependency” identifies what the replicas do and do not protect.',
      },
      {
        title: 'Practical design defense',
        body: 'Produce a diagram showing DNS, client, hosting, storage, network boundaries and identity. Trace one successful request, one unauthorized request and one storage outage. Include a resource-group lifecycle plan, a least-privilege role matrix and a dated cost estimate. You may use a design-only submission; this examination does not require paid deployment.\n\nTest the design through a tabletop exercise: the app restarts, a user leaves the team, DNS returns an old address and a document is accidentally deleted. For each, describe symptoms, evidence, recovery and prevention. Mark unknowns honestly and explain what you would verify before production. Your score rewards justified tradeoffs and testable claims, not the number of services in the diagram.',
      },
    ],
    terms: {
      RTO: 'Target maximum time to restore a service after disruption.',
      RPO: 'Target maximum tolerable data loss measured in time.',
      Tradeoff: 'A choice balancing competing requirements.',
      Evidence: 'An observation supporting or challenging a technical claim.',
    },
    misconception:
      'A complex architecture is not automatically a better architecture. Every component needs an explained requirement and operating cost.',
    summary:
      'Demonstrate a coherent system with explicit responsibilities, data persistence, access boundaries, failure behavior and cost assumptions.',
    resources: [r.well, r.architecture, r.rbac, r.storage],
    lab: {
      title: 'Semester 1 practical: document-service architecture',
      tools: 'Diagram editor, text editor and spreadsheet. Azure deployment optional and not needed.',
      cost: 'Free & local',
      setup:
        'Create a foundation-project directory with architecture, decisions, operations and evidence sections. Read the lecture scenario.',
      tasks: [
        'State functional requirements plus availability, recovery and cost assumptions. Distinguish requirements from guesses.',
        'Create an architecture diagram with request flow, identity boundary, storage persistence and resource organization.',
        'Write a service-selection record comparing at least two compute choices and two relevant storage interfaces.',
        'Run four tabletop failure scenarios from the lecture and record detection, diagnosis and recovery.',
        'Submit a five-minute written or recorded defense, a cost estimate and a cleanup plan for any future deployment.',
      ],
      expected:
        'A complete design package that another engineer can review without asking what each arrow means.',
      validate:
        'Trace one request end to end. Every persistent data item has a storage and recovery location. Every permission has a principal, role and scope.',
      troubleshooting:
        'When a requirement is missing, state an assumption and its consequence instead of silently inventing a guarantee. Use documentation to resolve uncertain service capabilities.',
      cleanup:
        'Design-only by default. If you chose to deploy, delete only the dedicated examination resources and inspect the remaining inventory.',
    },
    questions: [
      q(
        'Which change most directly preserves uploaded files after app replacement?',
        ['Store files only in RAM', 'Use external durable storage', 'Add a CSS cache', 'Rename the process'],
        1,
        'External durable storage separates data lifetime from the application instance.',
      ),
      m(
        'Which belong in a justified architecture?',
        [
          'Identity boundaries',
          'Failure dependencies',
          'Dated cost assumptions',
          'Unlabeled service icons alone',
        ],
        [0, 1, 2],
        'A design must explain operation, access, failure and cost, not just show products.',
      ),
      b(
        'A replica and a backup solve exactly the same problem.',
        false,
        'Replicas support availability; backups preserve recoverable historical state against selected failure modes.',
      ),
      s(
        'Define RTO and RPO for a document service and explain how you would test them.',
        'RTO is target restoration time; RPO is acceptable data loss in time. For example, 4-hour restoration and 1-hour data loss require a timed restore test using backups whose recovery point meets that objective.',
      ),
    ],
    assignment:
      'Submit the foundation project technical defense and identify three concepts to revisit before Semester 2.',
    review:
      'Take the cumulative examination, grade your practical using the published rubric, then create a focused remediation plan for the lowest-scoring criteria.',
    reviewQuestions: [
      'What does your design protect against?',
      'Which failure remains possible?',
      'Can another operator recover the data from your instructions?',
    ],
  }),
  w({
    number: 13,
    title: 'Identity & governance',
    topics: ['Entra users & groups', 'RBAC', 'Policy', 'Locks', 'Tags', 'Access review'],
    objectives: [
      'Separate authentication and authorization.',
      'Assign least privilege at the right scope.',
      'Distinguish Policy, locks and RBAC.',
    ],
    sections: [
      {
        title: 'Identity is a lifecycle, not just a login',
        body: 'Microsoft Entra ID maintains users, groups and application identities. Authentication establishes identity using credentials and controls such as MFA. Authorization decides what that identity may do. Joiner, mover and leaver processes matter: access that was appropriate last month may be excessive after a role change. Prefer group-based human access where practical so membership has a reviewable lifecycle.\n\nWorkloads should use workload identities rather than a developer’s personal account. A managed identity can obtain tokens without your application storing a client secret. It still needs narrowly scoped authorization and can be abused if the application is compromised.',
      },
      {
        title: 'RBAC is principal plus role plus scope',
        body: 'An assignment combines who, what and where. The principal can be a user, group, service principal or managed identity. A role definition lists allowed actions and possibly data actions. Scope restricts where the assignment applies. Assigning Contributor at subscription scope can enable broad resource changes; assigning a data-reader role to one storage container is a different permission shape.\n\nEffective access may come from several inherited assignments. Removing one assignment does not guarantee all access is gone. Directory roles controlling Entra administration differ from Azure resource roles. Investigate the actual token identity, relevant scope and inherited assignments before changing permissions.',
      },
      {
        title: 'Policy and locks constrain different behavior',
        body: 'Azure Policy evaluates resource configuration against rules. An audit policy reports noncompliance; a deny policy can block noncompliant requests. Assignments have scopes and can require exceptions or remediation. Policy does not replace RBAC: one answers whether a configuration is permitted, the other whether the caller may perform an action.\n\nA delete lock protects against selected accidental management deletion, not all changes to underlying data. Read-only locks can also interfere with legitimate operations. Tags provide metadata; policy can help enforce tag requirements. Define an exception process so governance does not become a mysterious obstacle during incident recovery.',
      },
    ],
    terms: {
      'Managed identity': 'An Azure-managed workload identity for token-based access.',
      'Role assignment': 'A principal, role definition and scope combination.',
      Policy: 'A rule evaluating or enforcing resource configuration.',
      Lock: 'A management protection against selected changes.',
    },
    misconception: 'A resource lock is not a backup and does not universally prevent data deletion.',
    summary:
      'Review identity lifecycle, minimize role scope, enforce configuration intentionally and document exceptions.',
    resources: [r.identity, r.rbac, r.policy],
    lab: {
      title: 'Design and audit least-privilege access',
      tools: 'Azure portal or CLI with authorized access, or documentation-based role review.',
      cost: 'Free & local',
      setup:
        'Use a dedicated lab group if available. This lab can be completed as a role-design exercise without creating accounts.',
      tasks: [
        'Create a matrix for student operator, deployment identity, runtime identity and read-only reviewer. Specify principal, role and scope.',
        'Inspect effective/inherited access in your own authorized scope, or analyze a written example with two inherited roles.',
        'Draft an audit-only policy requirement for allowed regions and owner tags. Explain when denial would be introduced.',
        'Model an offboarding procedure and verify all access paths, including groups and application credentials.',
        'Describe a delete-lock scenario and a backup scenario, identifying which problem each solves.',
      ],
      expected: 'A role matrix, an access review, policy rollout plan and offboarding checklist.',
      validate:
        'No runtime identity receives Owner. Directory and resource roles are distinguished. Every policy has a stated effect.',
      troubleshooting:
        'Access changes may take time to propagate and existing tokens may need renewal. Do not resolve every issue by adding broad permissions.',
      cleanup:
        'Remove only temporary role assignments or locks you created, after verifying their exact scope. Never remove another workload’s access.',
    },
    questions: [
      q(
        'Which three elements form an Azure role assignment?',
        ['Principal, role, scope', 'IP, port, TTL', 'CPU, RAM, disk', 'User, password, theme'],
        0,
        'A role assignment connects a security principal to a role definition at a scope.',
      ),
      m(
        'Which can explain effective access?',
        [
          'Group membership',
          'Inherited assignments',
          'Direct assignments',
          'Only the most recent assignment',
        ],
        [0, 1, 2],
        'Several assignments can contribute to effective permissions.',
      ),
      b(
        'An audit policy always blocks noncompliant deployment.',
        false,
        'Audit reports; deny blocks selected noncompliant requests.',
      ),
      s(
        'Why use a managed identity for a web application?',
        'It avoids storing and rotating an application credential manually. The identity still needs least-privilege RBAC and protection against application compromise.',
      ),
    ],
    assignment:
      'Deliver a capstone identity and governance plan, including permission scopes and an access review procedure.',
    review:
      'Test the permission matrix with three hypothetical requests and explain each allow/deny outcome before the quiz.',
    reviewQuestions: [
      'Which identity actually performs a data request?',
      'How does inherited access affect removal?',
      'When should audit precede deny?',
    ],
  }),
  w({
    number: 14,
    title: 'Azure networking',
    topics: ['VNets & subnets', 'NSGs', 'Routing', 'DNS', 'Private endpoints', 'Connectivity'],
    objectives: [
      'Trace a private service connection.',
      'Evaluate NSG and routing behavior.',
      'Include DNS in private endpoint design.',
    ],
    sections: [
      {
        title: 'A VNet makes private addressing explicit',
        body: 'A VNet defines an address space, such as 10.20.0.0/16, divided into non-overlapping subnets. Plan room for service delegation, growth and future connected networks. Overlapping ranges complicate peering and hybrid connectivity. Azure reserves five IPv4 addresses per subnet: the first four and the last. A /26 therefore has 59 ordinarily assignable addresses, unlike the 62 traditional host addresses from basic subnetting.\n\nAzure supplies system routes; user-defined routes can change next hops. Route selection prefers the longest matching prefix, with further rules for equal prefixes. An appliance can inspect traffic only if the relevant path actually traverses it. Forward and return paths must both work.',
      },
      {
        title: 'Security groups filter flows, not application identities',
        body: 'An NSG contains prioritized allow/deny rules using source, destination, protocol and ports. Lower priority numbers are evaluated first. NSGs are stateful, so allowed established traffic receives corresponding return-flow treatment; a rule change may not immediately terminate existing flows. Test with new connections. If a subnet and NIC both have NSGs, effective filtering needs to allow the traffic through both relevant boundaries.\n\nA rule allowing TCP 443 says nothing about which user can read a document. Likewise, authentication cannot fix a route to the wrong address. Keep network and identity investigations separate, then combine the evidence. Plan explicit outbound connectivity according to current platform behavior rather than assuming an implicit internet path.',
      },
      {
        title: 'Private endpoint traffic depends on name resolution',
        body: 'A private endpoint creates a network interface with a private address in your VNet for a supported service. Clients should generally continue using the service’s normal hostname so TLS and SDK behavior remain correct, while DNS resolves it to the private endpoint from the intended network. A public resolver returning the public address can bypass the intended private path or fail when public access is disabled.\n\nTroubleshoot in sequence: resolve the service name from the client environment, verify the private IP, inspect effective routes, evaluate NSGs and service network settings, then test authorization. Private DNS zone linking and on-premises forwarding are design tasks. The endpoint alone does not automatically make every client’s DNS correct.',
        diagram: [
          'Application client',
          'DNS · service name → private IP',
          'VNet subnet · route + NSG',
          'Private endpoint · service interface',
          'Storage service · identity authorization',
        ],
      },
    ],
    terms: {
      NSG: 'Stateful network security rules applied to supported subnet/NIC scopes.',
      UDR: 'A user-defined route.',
      'Private endpoint': 'A private network interface connecting to a supported service.',
      Peering: 'Private connectivity between virtual networks.',
    },
    misconception:
      'Creating a private endpoint does not automatically fix DNS, disable all public access or grant data permissions.',
    summary:
      'Combine address planning, route inspection, effective security rules and DNS evidence before changing access.',
    resources: [r.vnet, r.nsg, r.private],
    lab: {
      title: 'Build and test a network traffic plan',
      tools: 'Diagram editor; optional Azure CLI and a dedicated authorized resource group.',
      cost: 'Potentially billable',
      setup:
        'Default to a design-only exercise. For deployment, price the chosen region and all endpoints first, set alerts, and use only a dedicated disposable group.',
      tasks: [
        'Adapt Week 4’s plan to Azure reservations. Calculate usable capacity for each /26 and label subnet purpose.',
        'Create an NSG rule matrix for HTTPS ingress, restricted administration and application-to-storage access. Explain rule priorities.',
        'If deploying, create only the VNet/subnets/NSGs first; validate the address ranges and rules before adding workloads. Otherwise produce the equivalent configuration plan.',
        'For a storage private endpoint design, document the normal hostname, private resolution path and DNS zone links. Deployment is optional because endpoints can incur charges.',
        'Walk through wrong DNS, blocked port and missing data permission scenarios. State distinct evidence and corrections.',
      ],
      expected: 'An Azure-specific address plan, effective-flow matrix and private DNS runbook.',
      validate:
        'A /26 accounts for five Azure-reserved addresses. A private endpoint flow shows name resolution and separate authorization.',
      troubleshooting:
        'Inspect from the actual client network. A lookup from your laptop does not prove a VM’s DNS behavior. Test new connections after NSG changes.',
      cleanup:
        'Delete only the dedicated lab group after saving evidence. Check private endpoints, public IPs, DNS zones and ancillary resources in the inventory.',
    },
    questions: [
      q(
        'How many ordinarily assignable IPv4 addresses are in an Azure /26 subnet?',
        ['64', '62', '59', '26'],
        2,
        'There are 64 total minus five Azure-reserved addresses.',
      ),
      m(
        'Which can prevent a private endpoint connection?',
        [
          'Wrong DNS answer',
          'Blocked network flow',
          'Missing data authorization',
          'An unrelated theme setting',
        ],
        [0, 1, 2],
        'All three are separate requirements for a working authorized connection.',
      ),
      b(
        'An NSG rule allowing port 443 grants blob read permission.',
        false,
        'NSGs filter network traffic; data access requires service authorization.',
      ),
      s(
        'Why test DNS from the actual application environment?',
        'Its resolver, private zone links and forwarding path may differ from your laptop. Only client-context evidence proves which endpoint the application will use.',
      ),
    ],
    assignment:
      'Submit a connectivity runbook and network diagram for the capstone, including explicit outbound assumptions.',
    review:
      'Use the three failure cases to practice layer-by-layer diagnosis and complete the networking quiz.',
    reviewQuestions: [
      'What changes when a route is more specific?',
      'Why can existing flows confuse an NSG test?',
      'Where is private DNS configured?',
    ],
  }),
  w({
    number: 15,
    title: 'Azure compute administration',
    topics: ['VM provisioning', 'Sizing', 'Disks', 'Availability', 'Scaling', 'Hosting', 'Troubleshooting'],
    objectives: [
      'Provision compute with a lifecycle plan.',
      'Choose sizing from measurements.',
      'Diagnose startup and application failures separately.',
    ],
    sections: [
      {
        title: 'Provision configuration, not a pet machine',
        body: 'A reproducible VM definition includes image, size, disk layout, network interface, identity and bootstrap configuration. The image establishes the guest OS baseline; cloud-init can perform initial Linux configuration. Keep bootstrap scripts idempotent and avoid embedding secrets. Manual fixes made only inside one guest are difficult to recreate after replacement.\n\nChoose a VM size for CPU, memory and I/O needs, not just nominal core count. Some sizes have burst behavior, local temporary storage or different disk/network limits. Measure a representative workload and record assumptions. A CPU-light application can still need more RAM, while a database can be constrained by disk latency.',
      },
      {
        title: 'Storage and availability affect operations',
        body: 'An OS disk holds the guest system; data disks hold attached block storage. Temporary disks are not durable application storage. Detaching or deleting a VM does not automatically remove every associated resource in every configuration. Inspect delete options and resource dependencies. Snapshots can assist selected recovery operations, but backups and restore procedures need their own design.\n\nAvailability zones separate physical failure domains where supported. A scale set manages a group of VM instances. App-level scaling also requires stateless requests or deliberate shared-state handling. Zone distribution does not automatically synchronize local files or make a stateful process safe to replace.',
      },
      {
        title: 'Troubleshoot in dependency order',
        body: 'Check control-plane provisioning state before guest behavior. A failed deployment can reflect quota, unsupported SKU or invalid settings. A successfully provisioned VM can still fail to boot, lack an application listener or reject authentication. Use boot diagnostics and supported serial access where appropriate, then inspect service logs and sockets inside the guest.\n\nIf an application returns errors, compare a local request inside the guest with an external request. Local success plus external failure narrows the investigation toward binding, routing or filtering. Local failure points toward process configuration or dependencies. Scale only after understanding the bottleneck; adding broken replicas multiplies the problem.',
      },
    ],
    terms: {
      Image: 'A template of an OS and preinstalled software.',
      Bootstrap: 'Initial configuration performed when a machine starts.',
      'Scale set': 'A managed collection of VM instances.',
      Deallocation: 'Releasing allocated compute capacity; associated resources can remain.',
    },
    misconception:
      'Stopping a guest from inside its OS is not always equivalent to deallocating compute through Azure.',
    summary:
      'Make compute replaceable, keep data durable and separate provisioning, boot, listener and application evidence.',
    resources: [r.vm, r.compute, r.cost],
    lab: {
      title: 'Provision or rehearse a replaceable web host',
      tools: 'Local Ubuntu VM for the free path; Azure CLI/portal for optional cloud deployment.',
      cost: 'Potentially billable',
      setup:
        'Start with the local VM. Optional Azure work needs a cost estimate, short time limit, authorized subscription and dedicated group. Never open SSH to all sources for convenience.',
      tasks: [
        'Write a provisioning specification including image, size, disks, subnet, restricted administration and cleanup target.',
        'Bootstrap a harmless static server in the local guest, or an optional short-lived Azure VM using the same intent.',
        'Record CPU, memory and disk use at idle and during a small manual request test. Avoid stress-testing shared systems.',
        'Break the application startup command deliberately in the disposable environment, inspect logs and restore the known-good configuration.',
        'Demonstrate that content can be recreated from versioned configuration and document which data requires backup.',
      ],
      expected: 'A reproducible host specification, measurements and a failure/recovery log.',
      validate:
        'Another run can reconstruct the intended web content. The diagnosis distinguishes boot state, process state and response status.',
      troubleshooting:
        'Quota and regional SKU availability can block provisioning. Do not choose a larger paid SKU blindly. A listener on 127.0.0.1 is not externally reachable by design.',
      cleanup:
        'Stop the local guest. For Azure, delete only the lab group and check disks, NICs and public IPs; deallocation alone is not complete cleanup.',
    },
    questions: [
      q(
        'Which evidence most directly points to a guest application issue?',
        [
          'Local request inside the VM also fails',
          'Only a remote ping fails',
          'The resource has a tag',
          'The subscription has a budget',
        ],
        0,
        'A failed local application request narrows focus toward the listener, process or application dependencies.',
      ),
      m(
        'Which belong in a reproducible VM specification?',
        ['Image', 'Disk layout', 'Network/identity configuration', 'Undocumented manual patches only'],
        [0, 1, 2],
        'Versioned configuration is reproducible; hidden manual changes are not.',
      ),
      b(
        'Adding replicas repairs invalid application configuration automatically.',
        false,
        'Replicas created from the same invalid configuration can all fail.',
      ),
      s(
        'Why measure memory and I/O before resizing CPU?',
        'The bottleneck may not be CPU. More vCPUs can add cost without fixing paging or slow storage; use representative metrics to justify a resize.',
      ),
    ],
    assignment:
      'Write a compute operations runbook covering deployment, health checks, replacement and cost-safe shutdown.',
    review:
      'Compare local and remote diagnosis, interpret your sizing measurements and complete the assessment.',
    reviewQuestions: [
      'Which state must survive VM replacement?',
      'What can bootstrap safely do twice?',
      'How do you verify full cleanup?',
    ],
  }),
  w({
    number: 16,
    title: 'Storage & data protection',
    topics: [
      'Storage accounts',
      'Blob & Files',
      'Security',
      'Access tiers',
      'Redundancy',
      'Backup',
      'Recovery',
    ],
    objectives: [
      'Choose storage by access pattern.',
      'Separate redundancy from backup.',
      'Define and test a recovery procedure.',
    ],
    sections: [
      {
        title: 'Performance, interface and tier are separate choices',
        body: 'Blob storage exposes objects; Azure Files exposes shares; managed disks expose block devices. Select the interface your application understands, then consider throughput, latency and transaction costs. Access tiers trade storage price against retrieval price and latency. An archive tier is not appropriate for content that must be retrieved immediately for a user request. Minimum retention or early-deletion charges may apply to selected tiers.\n\nRedundancy options place copies within a facility, across zones or across regions depending on the chosen service and configuration. Replication behavior and regional failover are not identical to application consistency guarantees. Verify current availability for the exact account type.',
      },
      {
        title: 'Protect access and protect history',
        body: 'Use Entra-based data access and narrowly scoped roles where supported. Shared access signatures delegate selected operations for a limited time; they are bearer credentials and must be protected. Do not put a long-lived broad SAS in a public repository. Storage keys can provide very broad access, so avoid using them as convenient permanent application credentials. Network restrictions complement authorization.\n\nRedundancy can reproduce an accidental delete or corrupted write. Soft delete, versioning and backups protect selected historical states according to their configuration and retention. Immutability can add protection for specific requirements but introduces operational constraints. Security configuration should be tested with both an authorized and an unauthorized operation.',
      },
      {
        title: 'Recovery is a timed experiment',
        body: 'RPO describes tolerated loss of recent data; RTO describes restoration time. A daily backup cannot guarantee a 15-minute RPO. A stored backup that nobody can restore does not meet an RTO. Plan identity permissions, recovery destination, dependency order and integrity checks. Restore into an isolated location first when possible so testing does not overwrite current production data.\n\nFor a document service, create a sample object, record its contents or checksum, simulate deletion in a disposable environment, recover it and compare. Record the actual recovery point and elapsed time. The report should explain which failures the test covers and which it does not, such as a region-wide outage or compromised backup credentials.',
      },
    ],
    terms: {
      Redundancy: 'Multiple copies supporting resilience to selected infrastructure failures.',
      Backup: 'A recoverable copy or historical state retained for restoration.',
      SAS: 'A token delegating constrained storage access.',
      Retention: 'How long selected historical data is kept.',
    },
    misconception:
      'Replication is not a complete backup strategy because unwanted changes can be replicated too.',
    summary:
      'Select the interface and tier deliberately, protect credentials and prove recovery with a timed restoration.',
    resources: [r.storage, r.backup, r.vault],
    lab: {
      title: 'Prove a restore procedure',
      tools: 'Local files for rehearsal; optional Azure Storage with authorized access.',
      cost: 'Potentially billable',
      setup:
        'Use dummy documents only. The local rehearsal is free; Azure storage, transactions and recovery features can incur costs. Price and time-box optional cloud work.',
      tasks: [
        'Define RTO and RPO for three sample documents. Choose a backup frequency consistent with them.',
        'Create local primary and backup directories on the disposable lab system, write sample data and record checksums. Explain why this same-host copy is only a rehearsal, not disaster protection.',
        'Delete only a disposable primary sample, restore it and measure elapsed time. Compare checksums.',
        'For optional Azure work, configure supported recovery features, repeat a small test and record the exact feature and retention used.',
        'Write an access and cleanup plan covering restore permissions, retained versions and soft-deleted data.',
      ],
      expected: 'A timed recovery report, verified content and explicit protection limitations.',
      validate:
        'Recovered content matches the recorded original. The measured restore time and recovery point are compared with objectives.',
      troubleshooting:
        'An unavailable version may predate feature enablement or exceed retention. Restoring an object can require permissions beyond ordinary read access.',
      cleanup:
        'Delete temporary data and optional dedicated Azure resources. Check retained backups, versions and soft-deleted resources for ongoing cost or retention behavior.',
    },
    questions: [
      q(
        'Which protects against a recent accidental overwrite when configured appropriately?',
        [
          'Historical version/recovery mechanism',
          'Only adding CPUs',
          'Only renaming the VNet',
          'Disabling logs',
        ],
        0,
        'Recoverable historical state can restore pre-overwrite content.',
      ),
      m(
        'Which matter in a restore test?',
        ['Content integrity', 'Elapsed restore time', 'Recovery point age', 'Only a successful backup icon'],
        [0, 1, 2],
        'A complete test validates recovered data and compares time/data-loss results with objectives.',
      ),
      b(
        'A daily backup guarantees a 15-minute RPO.',
        false,
        'The latest backup may be nearly a day old; frequency and mechanism must match the target.',
      ),
      s(
        'Why treat a SAS URL as sensitive?',
        'It is a bearer credential: anyone possessing it can exercise its granted operations until expiry or revocation conditions. Restrict scope, lifetime and exposure.',
      ),
    ],
    assignment:
      'Submit a storage decision and recovery runbook with actual test results and stated limitations.',
    review:
      'Review the restore evidence, identify uncovered failure modes and complete the storage assessment.',
    reviewQuestions: [
      'Why is archive unsuitable for immediate reads?',
      'How could replication preserve the wrong data?',
      'Who is authorized to restore?',
    ],
  }),
];
