# Learning-resource review

## R2 Stage 1 resources

Week 1 clarity revision: required MDN/Node HTTP/React extracts were reopened and inspected, together with optional Node process and Azure physical-infrastructure material. Reviewer-only Docker, curl and Fetch references and access limitations are listed in [the acceptance record](acceptance/week-01.md#inspected-sources). Required reading time remains 25 minutes. The Fetch review also identified the blocked old incident web port; the current workload uses 4192.

Current R2 Week 1 references are authored separately in `src/curriculum/week-01.ts`, with inspected-content dates, named extracts and explicit student time budgets. Inspected October 23, 2026: MDN “What is a web server?” (hardware/software and static/dynamic content), Node HTTP `http.createServer`, React `createRoot` browser rendering, Node 22 process PID/RSS/uptime, and the Azure core architecture module. Required reading is MDN 8 + Node HTTP 10 + React 7 = 25 minutes of academy-assigned study time, not invented provider runtimes. The process and Azure references are optional deeper material; no full external course is required. Required mechanisms are taught on the lesson pages.

The version-specific Node 22 HTTP URL could not be fetched by the browsing tool, so the lesson instead links the inspected current official HTTP page. The basic HTTP methods used by the supplied workload are compatible with the supported Node baseline and are tested locally. The Node 22 process page was inspected successfully. No video is required or embedded in Stage 1.

The sections below are the historical review for the original curriculum. They do not establish readiness or content verification of R2 Weeks 2–24.

Resource review date: **October 23, 2026**. Reference titles are concise display labels, not claims of exact page heading text. Lesson prose is original instruction; references provide deeper explanation and operational documentation. Durations are omitted when not verified.

The following sources were opened or found in official search results while building this application. They are marked reviewed in the interface:

| Reference                                                                                                                            | Provider        | Review                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------- | -------------------------------------------------------------------------- |
| [Core architectural components](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/) | Microsoft Learn | Found official training module                                             |
| [Azure architecture video](https://www.youtube.com/watch?v=9dZK_d-nZp8)                                                              | Microsoft Learn | Search verified title/provider/ID; duration not asserted                   |
| [Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)                                 | Microsoft Learn | Opened overview                                                            |
| [Private endpoint](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview)                                   | Microsoft Learn | Found official overview                                                    |
| [Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)                                             | Microsoft Learn | Opened role/principal/scope explanation                                    |
| [Storage introduction](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction)                                  | Microsoft Learn | Opened interface/security overview                                         |
| [Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview)                                                   | Microsoft Learn | Opened policy overview                                                     |
| [Key Vault concepts](https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts)                                       | Microsoft Learn | Opened concepts page                                                       |
| [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview)                                         | Microsoft Learn | Opened overview; followed redirect to fundamentals path                    |
| [Terraform Azure resource-group tutorial](https://developer.hashicorp.com/terraform/tutorials/azure-get-started/azure-build)         | HashiCorp       | Found official tutorial and prerequisites                                  |
| [Docker getting started](https://docs.docker.com/get-started/)                                                                       | Docker          | Found official documentation                                               |
| [Kubernetes basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)                                                         | Kubernetes      | Opened official tutorial                                                   |
| [Azure OIDC](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-azure)                  | GitHub          | Opened official guide; newer-repository claim differences noted in Week 20 |
| [DNS explanation](https://www.cloudflare.com/learning/dns/what-is-dns/)                                                              | Cloudflare      | Opened networking education article                                        |

Other supplied links use known official documentation/training locations and are explicitly labeled **availability not individually verified** in the UI. In particular, an attempted fetch of the NSG overview timed out, so it remains unverified rather than being represented as checked. A provider can move or remove a page after this review.

Before executing Azure labs, recheck service capabilities, prices, regional SKUs, CLI syntax and APIs in the linked documentation. Website tests validate application behavior and content structure; they do not provision cloud resources or establish that every example works against every future subscription configuration.
