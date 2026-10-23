import { defineWeek as w, single as q, multiple as m, bool as b, short as s } from './helpers';
import { resources as r } from './resources';
export const foundations = [
  w({
    number: 1,
    title: 'Inside the infrastructure',
    topics: [
      'CPU, RAM & storage',
      'Operating systems',
      'Servers & clients',
      'Data centers',
      'Virtualization',
    ],
    objectives: [
      'Trace a browser request through physical infrastructure.',
      'Distinguish CPU work, volatile memory and persistent storage.',
      'Explain why virtualization exists.',
    ],
    sections: [
      {
        title: 'From your code to a running service',
        body: 'A repository stores instructions; it does not execute them. When you start a web application, the operating system creates a process: a running instance of a program with its own memory and identity. Your runtime loads code from persistent storage into RAM, and the CPU executes instructions. A server process then listens on a network port. A browser connects, sends an HTTP request, and waits for a response. Every cloud service still depends on these physical actions.\n\nConsider a Node API that reads a customer record. The network interface receives packets, the operating system delivers bytes to the listening process, the CPU parses the request, and the application asks a database for data. The response returns over the connection. A slow request could reflect computation, waiting for a disk, waiting for a database, or network delay. “The server is slow” names the symptom; identifying the constrained resource starts the investigation.',
        diagram: [
          'Browser · client',
          'Network · request / response',
          'Operating system · listening port',
          'Application process · CPU + RAM',
          'Database / files · persistent storage',
        ],
      },
      {
        title: 'CPU, memory and storage solve different problems',
        body: 'A CPU performs arithmetic, comparisons and control flow. Multiple cores allow work to run concurrently, but a single-threaded program does not automatically use every core. CPU utilization describes how busy the available processing time is; it does not measure whether the application is doing useful work.\n\nRAM holds data that active processes need quickly: objects, loaded libraries and caches. RAM is volatile. Restarting a process loses its in-memory state unless that state was written elsewhere. A memory leak keeps references to objects that are no longer useful; eventually the operating system may terminate the process under pressure.\n\nStorage retains data across power cycles. SSDs usually provide lower access latency than mechanical disks, but persistence is not a backup. Deleting a file can be immediately replicated to another disk. Capacity, latency, throughput and IOPS describe different properties: a large disk can still perform poorly for many small random reads. For a photo service, keep uploaded photos in durable storage rather than only inside an application process.',
      },
      {
        title: 'Servers, operating systems and data centers',
        body: 'A server is a role: a system providing a service to clients. Your laptop can serve a local website. Production hardware differs in its design priorities, including remote administration, redundant components, predictable cooling and long operating periods. The operating system mediates access to CPU time, memory, devices and files. It also enforces user permissions and manages processes.\n\nA data center provides racks, power, cooling and connectivity. A rack containing redundant servers can still fail if all machines share one failed power source. Infrastructure reliability depends on independent failure boundaries, not just the number of copies. Hosting moves your application onto someone else’s infrastructure; it does not remove that infrastructure.\n\nA hypervisor divides a physical host into virtual machines. Each VM has a guest operating system and allocated virtual CPU, memory and disks. Consolidating workloads improves utilization and makes provisioning repeatable. It does not create unlimited resources: guest machines still compete for underlying capacity. In Azure, you choose a VM size while Microsoft manages the physical host.',
      },
      {
        title: 'Observe a real local service',
        body: 'Run the following commands in a terminal with Python 3 installed. Create a new directory first and put only a harmless index.html file in it. Binding to 127.0.0.1 restricts the exercise to your own machine. Start the server in one terminal and run the client in another. A successful HTTP status proves that a listener accepted an application request; it does not prove that every database or business function is healthy. Stop the server and repeat the request to see the difference between application success and connection failure.',
        code: 'python -m http.server 8080 --bind 127.0.0.1\n# In another terminal (curl.exe on Windows):\ncurl -i http://127.0.0.1:8080\n# Stop the server with Ctrl+C',
        language: 'shell',
      },
    ],
    terms: {
      Process: 'A running program with execution state and memory.',
      RAM: 'Volatile working memory used by active programs.',
      Persistence: 'Keeping data beyond the lifetime of a process or machine.',
      Hypervisor: 'Software that creates and manages virtual machines.',
    },
    misconception:
      'A cloud server is not an abstract place where code runs without hardware. Managed services change who operates each layer, not whether the layer exists.',
    summary:
      'A working application depends on compute, memory, storage, an operating system and a network. Trace the request and inspect evidence before choosing a larger machine.',
    resources: [r.architecture, r.linux],
    lab: {
      title: 'Meet the machine behind your application',
      tools: 'A computer, terminal, browser and Python 3. No Azure account.',
      cost: 'Free & local',
      setup:
        'Create an empty academy-week-01 directory. Add an index.html containing a short welcome message. Check python --version (or python3 --version). Use Task Manager on Windows, Activity Monitor on macOS, or top on Linux.',
      tasks: [
        'Record your OS, processor, number of logical CPUs, installed RAM and available disk capacity. Explain what each measurement means.',
        'Start the loopback-only HTTP server in the lecture. Find its process ID in your OS process viewer. Record its memory usage at idle.',
        'Request the page in a browser and with curl. Annotate the HTTP status and Content-Type header. Draw the request path from browser to process to disk.',
        'Request /missing.html and record the 404. Stop the server and repeat. Explain why a 404 and a refused connection identify different failure layers.',
        'Write a 200-word operational note: what would be lost if this process stopped, and what would survive a machine restart?',
      ],
      expected:
        'An inventory, a working local response, two distinct failure observations and a labeled architecture sketch.',
      validate:
        'The HTML response is 200; a missing file is 404 while the server runs; a stopped listener causes a connection error. The inventory distinguishes GB of memory from GB of disk.',
      troubleshooting:
        'If port 8080 is occupied, choose 8081 in both server and client. Use curl.exe in Windows PowerShell to avoid its older curl alias. If python is missing, install Python from python.org and reopen the terminal.',
      cleanup: 'Stop the server with Ctrl+C. Keep your evidence directory; no cloud resources were created.',
    },
    questions: [
      q(
        'Which resource holds a process’s active objects?',
        ['Persistent disk', 'RAM', 'DNS', 'A resource group'],
        1,
        'RAM is the volatile working area. A process must write data to persistent storage if it needs to survive termination.',
      ),
      m(
        'Which statements correctly describe this request path?',
        [
          'The operating system routes incoming bytes to the listening process.',
          'A 404 proves the server could not be contacted.',
          'The CPU executes the application instructions.',
          'Uploaded files in RAM survive a restart.',
        ],
        [0, 2],
        'A 404 is an application response, so a server was contacted. RAM does not survive a restart.',
      ),
      b(
        'Two servers sharing one power source have fully independent failure boundaries.',
        false,
        'Both can fail together when that power source fails. Redundancy needs independent dependencies.',
      ),
      s(
        'A restart loses the shopping cart but not the product catalog. Explain a plausible cause.',
        'The cart lived only in process memory. The catalog was persisted in a database or file. Verify the storage configuration and logs; do not assume every restart is a disk failure.',
      ),
    ],
    assignment:
      'Write a one-page infrastructure inventory and request-path diagram. Identify a CPU-bound operation, a memory consumer, and a persistent data requirement in an application you know.',
    review:
      'Spend 25 minutes redrawing the request path from memory, 30 minutes comparing your two failure observations, 25 minutes answering the quiz, and 40 minutes reviewing explanations and refining your inventory.',
    reviewQuestions: [
      'Why can an application fail while its server is powered on?',
      'What survives a process restart? A machine replacement?',
      'What evidence distinguishes slow computation from waiting on storage?',
    ],
  }),
  w({
    number: 2,
    title: 'Operating systems & virtual machines',
    topics: [
      'OS responsibilities',
      'Hypervisors',
      'Virtual machines',
      'Resource allocation',
      'Containers vs VMs',
    ],
    objectives: [
      'Describe kernel responsibilities.',
      'Compare isolation in a VM and a container.',
      'Size a small virtual machine from workload evidence.',
    ],
    sections: [
      {
        title: 'The operating system as resource manager',
        body: 'Applications should not write directly to arbitrary physical memory or compete without scheduling. The kernel provides controlled interfaces, called system calls, for opening files, creating processes and sending network data. A scheduler shares CPU time among runnable threads. Virtual memory gives processes separate address spaces; it is different from a virtual machine.\n\nWhen a machine runs out of RAM, paging may move memory contents to storage. Because storage is much slower than RAM, heavy paging can make an apparently idle CPU coexist with a very slow application. Inspect memory pressure and I/O before deciding that a larger CPU solves the problem. A user account and filesystem permissions establish another boundary: a web process should not run with permission to rewrite the whole operating system.',
      },
      {
        title: 'Virtualizing an entire machine',
        body: 'A type 1 hypervisor runs directly on the host hardware; a type 2 runs within a host operating system. Both present virtual hardware to guest operating systems. A VM boot includes its own kernel, drivers and services, which consume memory before your application starts. A virtual disk is backed by host storage or network storage; its apparent capacity does not tell you its latency.\n\nA vCPU is a virtual processing unit, not a promise of an exclusive physical core in every offering. Overcommitted hosts can introduce contention. Start with measured workload needs and headroom, then observe. Give a local learning VM enough RAM to boot comfortably while leaving enough for the host. A snapshot captures a point in time but is not a complete disaster recovery strategy: it may share the same underlying failure domain.',
      },
      {
        title: 'Why containers start differently',
        body: 'A container usually isolates a process using operating-system features such as namespaces and resource controls, while sharing the host kernel. An image packages user-space files and startup configuration; it does not normally include a bootable guest kernel. This makes containers quicker to start and more compact than full VMs, but kernel compatibility and host security matter. Docker Desktop may itself use a Linux VM to provide a Linux kernel on a non-Linux desktop.\n\nChoose a VM when you need a particular guest OS, kernel-level control or stronger machine-level separation. Choose a container when you need repeatable application packaging and can accept its host-kernel model. They are complementary: Azure Kubernetes Service runs containers on VM-backed nodes. Neither automatically supplies durable application storage or backups.',
      },
    ],
    terms: {
      Kernel: 'Privileged OS core managing resources and hardware access.',
      vCPU: 'A virtual CPU exposed to a guest.',
      Guest: 'The operating system inside a virtual machine.',
      Namespace: 'An OS mechanism that isolates a process’s view of selected resources.',
    },
    misconception: 'A container is not simply a smaller VM. Its isolation and kernel model differ.',
    summary:
      'An OS arbitrates resources; a hypervisor virtualizes hardware; containers isolate application processes. Select the boundary your workload needs.',
    resources: [r.linux, r.docker, r.vm],
    lab: {
      title: 'Compare a host, guest and container',
      tools:
        'A local virtualization tool such as Hyper-V, UTM or VirtualBox; Ubuntu installation media. Docker is optional.',
      cost: 'Free & local',
      setup:
        'Verify hardware virtualization support and download Ubuntu from ubuntu.com. Keep at least 2 GB RAM for the host and avoid modifying host disks.',
      tasks: [
        'Create a disposable Ubuntu VM with a small virtual disk; write down allocated CPU and RAM and why the host can spare them.',
        'Boot the VM and inspect uname -a, free -h and lsblk. Compare these with your Week 1 host inventory.',
        'Create a guest file, reboot and verify persistence. Power off the VM and record which processes stop.',
        'Draw host → hypervisor → guest kernel → application. Draw a container path beside it and identify the shared kernel.',
        'Optional: run docker run --rm ubuntu uname -a and explain why this is not a full Ubuntu boot.',
      ],
      expected: 'A running guest, a before/after file check and two isolation diagrams.',
      validate:
        'Guest tools report the allocated virtual resources rather than all host resources. The guest file survives a normal reboot.',
      troubleshooting:
        'If virtualization is unavailable, use Docker’s local Linux environment and explicitly document the missing hypervisor experiment. Never enable hardware settings on a managed work machine without authorization.',
      cleanup:
        'Shut down the guest. Delete only the disposable VM and its own virtual disks when finished; preserve screenshots and notes.',
    },
    questions: [
      q(
        'Which component normally supplies a Linux container’s kernel?',
        ['Its image', 'The host kernel', 'DNS', 'Its Dockerfile'],
        1,
        'Linux containers share the kernel of the Linux environment in which they run.',
      ),
      m(
        'Which consume finite physical capacity?',
        ['vCPUs', 'Guest RAM', 'Virtual disks', 'A VM name alone'],
        [0, 1, 2],
        'Virtual resources map to finite host processing, memory and storage.',
      ),
      b(
        'Adding vCPUs always fixes slow disk access.',
        false,
        'A disk bottleneck requires examining I/O latency, throughput and access patterns.',
      ),
      s(
        'Explain why a snapshot is not sufficient protection against host storage loss.',
        'The snapshot may depend on the same host or disks. A recovery strategy needs independent copies, defined retention and tested restoration.',
      ),
    ],
    assignment:
      'Create a decision record comparing a VM and a container for a legacy application that needs a specific kernel module.',
    review:
      'Reconstruct the two isolation diagrams without notes, inspect your guest inventory, complete the quiz and explain one sizing decision using measurements.',
    reviewQuestions: [
      'What does a kernel do for an application?',
      'Why can paging increase response times?',
      'What does a container image leave to the host?',
    ],
  }),
  w({
    number: 3,
    title: 'Networking fundamentals I',
    topics: ['TCP/IP & OSI', 'IPv4 & IPv6', 'Ports', 'TCP & UDP', 'HTTP & HTTPS'],
    objectives: [
      'Separate addressing, transport and application responsibilities.',
      'Trace an HTTPS request.',
      'Diagnose a failed listener before changing a firewall.',
    ],
    sections: [
      {
        title: 'Layers make failures easier to locate',
        body: 'A network sends data between endpoints through links and routers. The OSI model separates physical, data-link, network, transport, session, presentation and application concerns. TCP/IP groups these differently, but both models help avoid confusing an HTTP error with a routing failure. An Ethernet frame travels over a local link, an IP packet carries addresses across networks, and a transport protocol delivers data to an application endpoint. Encapsulation means one layer carries another’s data.\n\nAn IPv4 address contains 32 bits, often written as four decimal octets. IPv6 uses 128 bits, written in hexadecimal groups. Addresses identify interfaces in a network context; they are not permanent identities for people or applications. A private IPv4 address is not globally routable on the public internet. Loopback, such as 127.0.0.1, refers to the local machine, so another device cannot use your loopback address to reach you.',
      },
      {
        title: 'Ports, TCP and UDP',
        body: 'An IP address gets traffic to a host interface; a port helps select the application endpoint. A server binds a listener, for example TCP port 443. Clients usually use ephemeral source ports. A connection is described by protocol and source/destination address and port. TCP establishes a connection and provides ordered delivery, retransmission and flow control. Reliable transport does not mean that your database transaction succeeded.\n\nUDP sends datagrams without TCP’s built-in ordered stream or retransmission. Applications can implement their own reliability on top. DNS commonly uses UDP for small queries and also supports TCP; QUIC uses UDP and supplies its own secure transport behavior. “UDP is bad because it is unreliable” misses the design tradeoff: timeliness and application-level recovery may matter more than waiting for a missing packet.',
      },
      {
        title: 'HTTP, TLS and an evidence-first diagnosis',
        body: 'HTTP defines request methods, headers, status codes and response bodies. HTTPS protects HTTP using TLS, providing encryption in transit and server authentication when certificates are validated correctly. Encryption does not fix an insecure application or authorize a caller. HTTP/1.1 and HTTP/2 usually run over TCP; HTTP/3 uses QUIC.\n\nTroubleshoot in layers: can the name resolve, can a route reach the destination, can the port connect, does TLS validate, and what response does HTTP return? Ping uses ICMP and may be blocked while HTTPS works. A 403 points toward authorization or application policy; a timeout has several possible causes and needs more evidence.',
        code: 'curl -I https://example.com\n# Linux: inspect listening TCP sockets\nss -lnt\n# Windows PowerShell alternative\nTest-NetConnection example.com -Port 443',
        language: 'shell',
      },
    ],
    terms: {
      Packet: 'A unit of network-layer delivery.',
      Port: 'A transport-layer endpoint number.',
      TLS: 'A protocol providing authenticated encryption for transport.',
      Latency: 'Time taken for an operation or network exchange.',
    },
    misconception:
      'A successful ping does not prove the web server works, and a failed ping does not prove HTTPS is broken.',
    summary:
      'Use addresses to locate interfaces, ports to reach applications and protocol-specific evidence to locate failures.',
    resources: [r.ip, r.network],
    lab: {
      title: 'Follow a request through the stack',
      tools: 'Terminal, curl, browser developer tools; Python from Week 1.',
      cost: 'Free & local',
      setup:
        'Reuse the loopback HTTP server on port 8080. Open the browser Network tab before making a request.',
      tasks: [
        'Record your local IPv4/IPv6 addresses using ip addr on Linux, ipconfig on Windows or ifconfig on macOS. Identify loopback separately.',
        'Inspect the request URL, method, status and headers in browser developer tools. Match these to curl -i output.',
        'Connect to the wrong port, stop the listener, and request a missing path. Record each error without claiming a root cause beyond your evidence.',
        'Use Test-NetConnection or nc -vz where available to test TCP 443 on example.com. Compare with curl -I https://example.com.',
        'Draw the source/destination address and port relationship for a local HTTP connection.',
      ],
      expected: 'A layered diagnosis table and annotated request/response.',
      validate:
        'The table distinguishes connection failure from an HTTP response. The diagram contains both client and server ports.',
      troubleshooting:
        'Corporate networks may block diagnostic traffic. Record the restriction; do not disable security tools. On macOS ss is unavailable; use lsof -iTCP -sTCP:LISTEN.',
      cleanup: 'Stop the local server and close diagnostic tools.',
    },
    questions: [
      q(
        'Which evidence proves an HTTP application responded?',
        ['A successful ping', 'An HTTP 404 response', 'A DNS cache entry', 'A Wi-Fi icon'],
        1,
        '404 is an HTTP response. It proves an application endpoint responded, though not that the requested resource exists.',
      ),
      m(
        'Select transport protocols.',
        ['TCP', 'UDP', 'HTML', 'IPv4'],
        [0, 1],
        'TCP and UDP operate at transport. IPv4 is the network layer and HTML is document markup.',
      ),
      b(
        'HTTPS automatically authorizes a caller to read every record.',
        false,
        'TLS secures transport; authorization is still an application and identity concern.',
      ),
      s(
        'DNS resolves but HTTPS times out. What would you check next?',
        'Test the destination TCP port and inspect routes, firewall rules and the listener. A timeout alone cannot distinguish a dropped packet from an unavailable service.',
      ),
    ],
    assignment:
      'Write a troubleshooting runbook with separate checks for name resolution, port connectivity, TLS and HTTP status.',
    review:
      'Compare failure evidence from the lab, explain TCP and UDP aloud, then take the quiz and refine your troubleshooting runbook.',
    reviewQuestions: [
      'Why does an IP address alone not identify the web process?',
      'What does TLS protect?',
      'What can a timeout actually prove?',
    ],
  }),
  w({
    number: 4,
    title: 'Networking fundamentals II',
    topics: ['Subnetting', 'DNS & DHCP', 'Routing', 'NAT', 'Firewalls', 'Load balancing'],
    objectives: [
      'Calculate a simple IPv4 subnet.',
      'Explain recursive DNS resolution.',
      'Trace routed and translated traffic.',
    ],
    sections: [
      {
        title: 'Addresses need network boundaries',
        body: 'CIDR notation expresses an address prefix. In 192.168.10.0/24, the first 24 bits identify the network and eight remain for addresses, giving 256 addresses. A traditional IPv4 subnet reserves its network and broadcast addresses; cloud platforms can reserve additional addresses. A /26 contains 64 addresses. Splitting a /24 into four /26 ranges produces boundaries at .0, .64, .128 and .192. Use binary boundaries rather than guessing from decimal appearance.\n\nA host compares a destination with its local prefix. For another network, it sends traffic to a router, often its default gateway. Routers select the most specific matching route. DHCP can lease an address, gateway and DNS settings; it is not the system that translates hostnames. A subnet is an addressing and routing boundary, not automatically a complete security boundary.',
      },
      {
        title: 'DNS turns names into discoverable destinations',
        body: 'People use stable names while addresses change. A DNS stub resolver asks a recursive resolver for a record. If it has no valid cached answer, the recursive resolver follows referrals from root servers to the top-level domain and then to an authoritative server. The authoritative zone supplies the record. A records map to IPv4 addresses, AAAA to IPv6, CNAME creates an alias, MX identifies mail routing and TXT carries text used by systems such as domain verification.\n\nTTL tells caches how long a record may be reused. Changing an authoritative record does not instantly replace every cached answer. A CNAME is an alias to another name, not an HTTP redirect; the browser still uses the original hostname for its request and certificate expectations. In Azure, a private endpoint can require private DNS so a familiar service name resolves to a private address from the right network.',
      },
      {
        title: 'NAT, filtering and distributing requests',
        body: 'NAT rewrites addresses; port address translation can let many private clients share a public IPv4 address. It changes addressing, but it is not a complete security policy. A firewall permits or denies traffic based on rules and may track connection state. Check source, destination, direction, protocol and ports before adding a broad allow rule. Return traffic also needs a valid path.\n\nA layer 4 load balancer distributes transport connections. A layer 7 proxy can route by HTTP host or path and may terminate TLS. Health probes decide which backends are eligible; a probe checking only a TCP socket may miss a failed application dependency. Load balancing increases distribution options, but all backends can still share one failed database.',
        code: 'nslookup example.com\n# Linux/macOS, if dig is installed:\ndig example.com A\ndig example.com AAAA',
        language: 'shell',
      },
    ],
    terms: {
      CIDR: 'Prefix notation describing the network bits of an IP range.',
      TTL: 'How long a DNS record may remain in a cache.',
      NAT: 'Translation of network addresses between domains.',
      Gateway: 'A next-hop router for traffic outside a local network.',
    },
    misconception:
      'DNS is not a proxy carrying your web request. It provides records that help a client choose where to connect.',
    summary:
      'Subnetting defines ranges, routing chooses paths, DNS discovers destinations and firewall rules constrain allowed flows.',
    resources: [r.network, r.ip, r.vnet],
    lab: {
      title: 'Build a network plan and resolve names',
      tools: 'Terminal, paper or diagram editor, nslookup.',
      cost: 'Free & local',
      setup:
        'Choose the documentation exercise space 10.20.0.0/24 for a hypothetical private network. Do not change your host network configuration.',
      tasks: [
        'Split the /24 into four /26 subnets. List each network boundary, full range and traditional host range.',
        'Reserve separate ranges for web, application, data and future growth. Explain which flows are necessary.',
        'Query example.com using nslookup. Identify the resolver and returned records. Explain why another student might receive different addresses.',
        'Draw a client → DNS lookup → public load balancer → private web subnet path. Label where NAT and firewall filtering could occur.',
        'Write three narrowly scoped rules for the hypothetical web and data tiers and one test for each.',
      ],
      expected: 'A non-overlapping subnet plan, DNS evidence and a traffic matrix.',
      validate:
        'The /26 boundaries are .0, .64, .128 and .192. Each rule states source, destination, port, protocol and purpose.',
      troubleshooting:
        'Different resolvers and caches can return different valid records. A missing AAAA record does not imply a failed A lookup. Recheck CIDR calculations with binary arithmetic.',
      cleanup: 'No resources created. Retain the network plan for Week 14.',
    },
    questions: [
      q(
        'How many total addresses are in an IPv4 /26?',
        ['26', '32', '64', '256'],
        2,
        '32−26 = 6 host bits, so 2^6 = 64 total addresses, before platform reservations.',
      ),
      m(
        'Which are DNS record types?',
        ['AAAA', 'CNAME', 'DHCP', 'MX'],
        [0, 1, 3],
        'AAAA, CNAME and MX are DNS records. DHCP distributes host configuration.',
      ),
      b(
        'A subnet automatically prevents all traffic from other subnets.',
        false,
        'Routing and security rules determine whether that traffic is permitted.',
      ),
      s(
        'A DNS change works on one laptop but not another. Explain two checks.',
        'Compare configured resolvers and cached records/TTLs. Confirm the authoritative answer. Different cache ages or split-horizon DNS can explain the discrepancy.',
      ),
    ],
    assignment:
      'Deliver a subnet and traffic-flow design for a web application with a private database, including a DNS change procedure.',
    review:
      'Recalculate the /26 ranges from memory, walk through a DNS cache miss, review traffic rules and complete the assessment.',
    reviewQuestions: [
      'How does a resolver find an authoritative answer?',
      'Why can a correct firewall rule still leave a broken connection?',
      'What does a health probe actually test?',
    ],
  }),
  w({
    number: 5,
    title: 'Linux fundamentals I',
    topics: ['Distributions', 'Filesystem hierarchy', 'Terminal & shell', 'Navigation', 'Files & commands'],
    objectives: [
      'Navigate Linux safely.',
      'Explain paths and streams.',
      'Create an evidence directory without elevated access.',
    ],
    sections: [
      {
        title: 'A distribution is more than the kernel',
        body: 'Linux is the kernel. A distribution combines it with user-space tools, a package system and release policies. Ubuntu and Debian use apt for packages; Red Hat-family systems commonly use dnf. A terminal presents an interface, while a shell such as Bash parses commands, expands arguments and starts programs. A command copied from Bash documentation may not work in PowerShell because these are different languages.\n\nMost Linux filesystems begin at /. /home contains user homes, /etc holds host configuration, /var holds changing data such as logs, /tmp is temporary and /usr contains many installed programs and libraries. These are conventions, not instructions to edit everything there. Work in your own home directory until the task specifically calls for administration.',
      },
      {
        title: 'Paths, files and safe inspection',
        body: 'An absolute path begins at /. A relative path begins from your current working directory. The dot means the current directory and two dots mean its parent. Linux filenames are generally case-sensitive, so Notes.txt and notes.txt can be different files. Quote paths with spaces so the shell passes them as one argument.\n\nUse pwd to verify where you are, ls -la to inspect names and metadata, and less to read a long file without loading it into an editor. cp copies, mv moves or renames, and mkdir creates directories. Deletion through rm does not normally go to a desktop recycle bin. Before deleting anything, inspect the exact path and keep exercises inside a disposable directory. Never paste a destructive recursive command just because a tutorial includes it.',
      },
      {
        title: 'Compose small tools with streams',
        body: 'Programs receive standard input and write standard output and standard error. A pipe connects one program’s standard output to another’s input. Redirection with > replaces a file; >> appends. A successful pipeline can still hide an earlier failure unless the shell is configured to report it. Learn what each part produces before composing it.\n\nFor example, filtering a small application log answers a specific operational question without opening every line manually. grep finds matching lines, wc counts and sort orders results. Do not treat a line count as proof of the number of incidents: one incident may emit many lines.',
        code: 'mkdir -p "$HOME/academy/week05"\ncd "$HOME/academy/week05"\nprintf "INFO ready\\nERROR connection failed\\n" > app.log\npwd\nls -la\ngrep "ERROR" app.log\nwc -l app.log',
        language: 'bash',
      },
    ],
    terms: {
      Shell: 'A command interpreter such as Bash.',
      Path: 'A location in the filesystem.',
      stdout: 'The normal output stream of a process.',
      Pipe: 'A connection from one program’s output to another’s input.',
    },
    misconception: 'The terminal is not Linux itself, and sudo is not a routine prefix for every command.',
    summary:
      'Locate yourself before changing files. Understand paths, quoting and streams before composing administrative commands.',
    resources: [r.linux, r.ubuntu],
    lab: {
      title: 'Create a Linux investigation workspace',
      tools: 'Ubuntu VM from Week 2 or WSL Ubuntu; Bash.',
      cost: 'Free & local',
      setup:
        'Open Bash as your regular user. Run pwd and verify your home directory. Use a new academy/week05 directory.',
      tasks: [
        'Create notes, evidence and scripts subdirectories. List them with metadata and explain each path.',
        'Create a small application log containing INFO, WARN and ERROR lines using printf.',
        'Copy the log into evidence, rename the copy, and compare it with the original using diff.',
        'Filter error lines into a new report. Append one observation without overwriting earlier content.',
        'Write a command transcript with an explanation for each operation and a warning about > versus >>.',
      ],
      expected: 'A reproducible workspace with original log, copy, filtered report and annotated transcript.',
      validate:
        'diff reports no difference before you deliberately edit the copy. The error report contains only intended lines. Earlier notes survive appending.',
      troubleshooting:
        'If a path is missing, inspect pwd and ls before creating more directories. Quote paths. If you are in PowerShell, enter your Linux environment first.',
      cleanup: 'Keep the small workspace as evidence. No elevated permissions or cloud resources are needed.',
    },
    questions: [
      q(
        'What does an absolute Linux path begin with?',
        ['~', '/', '..', ':'],
        1,
        'An absolute path begins at the root directory /. Tilde is shell expansion for a home path.',
      ),
      m(
        'Which commands primarily inspect information?',
        ['pwd', 'ls', 'rm', 'less'],
        [0, 1, 3],
        'pwd, ls and less inspect. rm removes files.',
      ),
      b(
        'The > operator always appends to an existing file.',
        false,
        'It normally replaces the file’s contents. >> appends.',
      ),
      s(
        'A script cannot find notes.txt although the file exists. What do you inspect?',
        'Check the working directory, path spelling, case and quoting. Relative paths are interpreted from the process working directory, which may differ from the script location.',
      ),
    ],
    assignment:
      'Write an annotated Linux quick reference with one safe example each for navigation, reading, copying, filtering and appending.',
    review:
      'Repeat the workspace exercise without copying commands, explain redirection, then assess your understanding with the quiz.',
    reviewQuestions: [
      'How is a shell different from a terminal?',
      'Where are relative paths resolved?',
      'Why should operational scripts quote paths?',
    ],
  }),
  w({
    number: 6,
    title: 'Linux fundamentals II',
    topics: ['Users & groups', 'Permissions', 'Processes', 'Services', 'Packages'],
    objectives: [
      'Read Unix permission bits.',
      'Separate a process from a managed service.',
      'Use package tools without changing arbitrary system files.',
    ],
    sections: [
      {
        title: 'Identity and permissions apply to processes too',
        body: 'Every process runs with a user and group identity. File ownership and mode bits determine which identities can read, write or execute. In -rw-r-----, the owner may read/write, the group may read and others have no access. Numeric modes add read=4, write=2 and execute=1. Mode 640 therefore expresses the same basic permission set. Directory execute means traversing the directory; read means listing its entries.\n\nLeast privilege means giving a service enough access to function and no broader access. A web process might read its configuration while being unable to modify it. Making everything 777 hides the real ownership problem and grants every local user write access. sudo runs a command under an authorized elevated identity; it should have a specific reason and limited scope.',
      },
      {
        title: 'Processes versus services',
        body: 'A process has a PID, parent, memory and open resources. ps shows a snapshot, while top gives an updating view. A service manager such as systemd supervises long-running workloads, controls startup dependencies and can restart failed processes. A service definition is not the same as a running process: a unit may be enabled at boot but currently stopped.\n\nsystemctl status gives state and recent messages; journalctl reads journal logs. When stopping a process, request graceful termination before forceful killing. SIGTERM allows cleanup, while SIGKILL cannot be handled. A repeatedly restarting service often has an invalid configuration, missing permission or failed dependency. Examine logs before increasing restart frequency.',
      },
      {
        title: 'Packages are managed dependencies',
        body: 'Package managers download software from configured repositories, verify metadata and track installed files and dependencies. On Ubuntu, apt update refreshes package metadata; it does not upgrade packages. apt install installs selected packages. Repositories and package signing form part of your software supply chain, so avoid piping unknown downloaded scripts into a privileged shell.\n\nOperational change needs verification: record the current version, review the proposed packages, install within the disposable VM and test the intended command. A successful package install says little about whether the service is listening or reachable.',
        code: 'id\nls -l app.log\nchmod 640 app.log\nps -ef\n# On a systemd-based VM:\nsystemctl --failed\njournalctl -n 20 --no-pager',
        language: 'bash',
      },
    ],
    terms: {
      UID: 'Numeric user identity for ownership and process access.',
      Mode: 'Permission bits on a filesystem object.',
      PID: 'Process identifier.',
      'Service manager': 'A supervisor for startup, lifecycle and dependencies.',
    },
    misconception:
      'A service being enabled does not mean it is running, and a running process does not prove the application is healthy.',
    summary:
      'Relate identity to permissions, inspect process state and use managed packages with deliberate changes.',
    resources: [r.linux, r.ubuntu],
    lab: {
      title: 'Permissions and process supervision',
      tools: 'Disposable Ubuntu VM; regular user; sudo only for approved VM package changes.',
      cost: 'Free & local',
      setup: 'Reuse the Week 5 workspace. Do not experiment on a production host. Record id output.',
      tasks: [
        'Create a configuration file containing dummy values only. Set mode 640 and interpret the symbolic permissions.',
        'Set mode 600 and explain which access was removed. Check the parent directory’s permissions as well.',
        'Start sleep 120 in the background, find its PID, send SIGTERM and confirm it exits.',
        'Inspect systemctl --failed and one existing non-sensitive service status. Record active and enabled state separately.',
        'Review apt metadata and a package’s candidate version without installing arbitrary software. Document the command you would use to install curl in the disposable guest.',
      ],
      expected:
        'Permission before/after evidence, controlled process termination and a service-state explanation.',
      validate:
        'Your dummy file is not world-readable or world-writable. The sleep process disappears after termination.',
      troubleshooting:
        'WSL installations without systemd cannot use systemctl; perform the process portion and record the limitation or use your VM. Permission denied can result from parent-directory traversal restrictions.',
      cleanup:
        'Terminate only the sleep process you created. Keep the dummy configuration; never include real secrets.',
    },
    questions: [
      q(
        'What does chmod 640 give the group?',
        ['Read only', 'Read/write', 'Execute only', 'All permissions'],
        0,
        'The group digit 4 grants read; write and execute are absent.',
      ),
      m(
        'Which are meaningful health checks?',
        ['Service state', 'Listening port', 'Application response', 'Enabled-at-boot alone'],
        [0, 1, 2],
        'Use several layers of evidence. Enabled is a startup policy, not current application health.',
      ),
      b(
        'apt update upgrades all installed packages.',
        false,
        'It refreshes repository metadata. Upgrading packages is a separate operation.',
      ),
      s(
        'A service cannot read its configuration. Describe a safe fix process.',
        'Find the service identity, inspect ownership/mode and parent-directory traversal, then grant only necessary read/traverse access. Retest; do not make the tree world-writable.',
      ),
    ],
    assignment:
      'Create a service health checklist and a least-privilege permission plan for an API configuration directory.',
    review:
      'Translate symbolic permissions to numbers, inspect service evidence and explain why 777 is a poor diagnostic fix before taking the quiz.',
    reviewQuestions: [
      'Why can directory permissions prevent reading an otherwise readable file?',
      'When would SIGTERM be preferable to SIGKILL?',
      'What does package metadata tell you?',
    ],
  }),
  w({
    number: 7,
    title: 'Linux administration & troubleshooting',
    topics: ['SSH', 'Logs', 'Environment variables', 'Bash scripts', 'Scheduled tasks', 'Troubleshooting'],
    objectives: [
      'Use key-based SSH deliberately.',
      'Write a small script that fails visibly.',
      'Investigate a service using ordered evidence.',
    ],
    sections: [
      {
        title: 'Remote access has two identities',
        body: 'SSH encrypts a remote session and authenticates the server and client. A host key identifies the server; your user key authenticates your account. The first-connection fingerprint must be verified through a trusted channel before accepting it. A changed host key can mean a rebuilt machine or an impersonation attempt. Deleting the warning without checking removes the protection.\n\nKeep private keys private, use a passphrase and restrict their file access. Only the public key belongs in authorized_keys. Do not paste private keys into an assignment, repository or support request. For a cloud VM, network access to SSH and account authorization are separate requirements; a valid key cannot bypass a firewall.',
      },
      {
        title: 'Scripts encode repeatable investigation',
        body: 'Environment variables are key/value strings inherited by child processes. They are convenient configuration, not a secret vault: process environments and diagnostic output can expose them. Quote variables to prevent unintended splitting and wildcard expansion. Validate required input explicitly. Bash set -euo pipefail can catch common errors, but it is not a substitute for understanding exit statuses and testing expected failure cases.\n\nAn investigation script should report timestamps, selected facts and failures without dumping sensitive files. Operational scripts need idempotency where possible: running them twice should not create duplicate rules or destroy evidence. Prefer read-only checks first and make mutations explicit.',
      },
      {
        title: 'Logs, schedules and a troubleshooting loop',
        body: 'Start with a concrete symptom and time window. Check recent changes, service state, logs, resources and dependencies. Form one hypothesis, run a low-risk test, and record whether the evidence supports it. Repeated random restarts erase useful evidence and can make intermittent failures harder to understand.\n\nCron uses a limited environment and may not run from your home directory. Use absolute paths and redirect output deliberately. A script that works interactively may fail under cron because PATH, working directory or permissions differ. systemd timers offer another scheduling mechanism with service integration. Never schedule a destructive exercise against a shared host.',
        code: '#!/usr/bin/env bash\nset -euo pipefail\nworkspace="${1:?Usage: health.sh DIRECTORY}"\n[[ -d "$workspace" ]] || { echo "Not a directory" >&2; exit 1; }\ndate -u\ndf -h "$workspace"\nprintf "Readable files: "\nfind "$workspace" -maxdepth 1 -type f -readable | wc -l',
        language: 'bash',
      },
    ],
    terms: {
      'Host key': 'SSH server identity key.',
      'Exit status': 'A numeric result conventionally using zero for success.',
      Idempotent: 'Producing the same intended state when repeated.',
      Cron: 'A time-based command scheduler.',
    },
    misconception:
      'An environment variable is not automatically secure just because it is absent from source code.',
    summary:
      'Authenticate remote hosts, quote and validate script inputs, and investigate using time-scoped evidence.',
    resources: [r.linux, r.ubuntu],
    lab: {
      title: 'Write a safe health-report script',
      tools: 'Bash in your Linux lab; optional SSH between authorized local environments.',
      cost: 'Free & local',
      setup:
        'Create scripts/health.sh inside your Week 5 workspace. Use dummy data and avoid system-wide changes.',
      tasks: [
        'Implement the lecture script and run it against your evidence directory. Explain each command and exit condition.',
        'Test a valid path, a path containing spaces, a missing argument and a nonexistent directory. Capture exit statuses with echo $?.',
        'Add a timestamped report file without exposing environment variables or personal paths in published evidence.',
        'Write a cron entry using absolute paths but do not install it until you have tested the command with a reduced environment.',
        'Draft a five-step runbook for a web process that fails after a configuration change. Optional: inspect a local SSH server fingerprint through a trusted console.',
      ],
      expected: 'A versioned script, a test matrix, a proposed schedule and a troubleshooting runbook.',
      validate:
        'Valid input exits zero; invalid input exits nonzero with a useful message. Paths containing spaces work.',
      troubleshooting:
        'Use chmod u+x on the script or invoke bash explicitly. Windows line endings can break the shebang; save as LF. A missing command under cron often indicates PATH differences.',
      cleanup:
        'Remove only any cron entry you added for this lab and stop optional local SSH services if enabled solely for the exercise.',
    },
    questions: [
      q(
        'What does an SSH host key identify?',
        ['The remote server', 'Your browser cookie', 'An Azure subscription', 'A DNS TTL'],
        0,
        'The host key lets the client authenticate the server.',
      ),
      m(
        'Which improve script safety?',
        ['Quote paths', 'Validate inputs', 'Print all environment variables', 'Return useful exit statuses'],
        [0, 1, 3],
        'Printing all environment variables can expose credentials. Inputs and outputs need deliberate handling.',
      ),
      b(
        'A script that runs in your terminal must also work unchanged under cron.',
        false,
        'Cron may use a different working directory, PATH and environment.',
      ),
      s(
        'A service stopped after a config edit. Describe your first investigation steps.',
        'Record the time and change, inspect status and logs, validate config syntax and permissions, then test a specific hypothesis or revert the known change with evidence preserved.',
      ),
    ],
    assignment:
      'Submit a script README describing inputs, outputs, failure behavior, safe scheduling and a sample sanitized report.',
    review:
      'Re-run failure cases, review your runbook for evidence before mutation, then complete the quiz and update script documentation.',
    reviewQuestions: [
      'Why verify a host fingerprint?',
      'What makes a script repeatable?',
      'Why can a scheduled command behave differently?',
    ],
  }),
  w({
    number: 8,
    title: 'Cloud computing fundamentals',
    topics: [
      'IaaS, PaaS & SaaS',
      'Cloud models',
      'Shared responsibility',
      'Elasticity',
      'Availability',
      'Pricing',
    ],
    objectives: [
      'Allocate responsibilities across service models.',
      'Distinguish scaling from reliability.',
      'Build a simple cost and failure model.',
    ],
    sections: [
      {
        title: 'Cloud is an operating model, not just a location',
        body: 'Cloud computing offers on-demand access to pooled resources through service interfaces, with measured consumption. A public cloud serves many customers using provider-operated infrastructure. A private cloud offers cloud-like provisioning within a dedicated organization’s environment. Hybrid systems connect environments; they also inherit the operational complexity of identity, networking and data movement across them.\n\nIaaS exposes resources such as VMs: you manage the guest OS and application. PaaS manages more of the runtime and infrastructure so you focus on application deployment and configuration. SaaS delivers a finished application. These are responsibility boundaries, not quality rankings. A VM can be appropriate when a managed platform cannot meet a specific compatibility requirement.',
      },
      {
        title: 'Responsibility never disappears',
        body: 'The provider secures its physical facilities and underlying service infrastructure. Customers still classify data, manage identities and configure their workloads. In IaaS, patching the guest OS is usually your responsibility. In PaaS, the provider may patch the runtime platform, but your vulnerable application dependency and excessive permissions remain your problem.\n\nAvailability is the ability to serve requests when needed. Reliability includes consistently performing the intended function over time and recovering from failures. Scaling up increases machine capacity; scaling out adds instances. Elasticity adapts capacity to demand. Autoscaling cannot repair a corrupt database, and a second web instance does not remove a single shared database dependency.',
      },
      {
        title: 'Consumption needs a budget and an exit plan',
        body: 'Costs can include compute time, provisioned storage, operations, outbound data transfer and log ingestion. A free account or free tier has conditions and limits; a service being available to a free account does not make every configuration free. Budgets send alerts and generally do not enforce a hard stop. Verify current prices and regional availability immediately before deployment.\n\nFor a small portfolio demo, reduce always-on components, use a short demonstration window and keep the architecture reproducible. Deleting a VM can leave disks or public IP resources behind. Deallocation may stop compute billing while storage continues. Plan cleanup and check the subscription inventory, not just the application page. A cost estimate should state assumptions: hours running, region, instance count, storage and traffic.',
      },
    ],
    terms: {
      IaaS: 'Infrastructure services with customer-managed guest systems.',
      PaaS: 'A managed application platform.',
      Elasticity: 'Adjusting capacity to changing demand.',
      SLA: 'A contractual service-level commitment with defined conditions.',
    },
    misconception:
      'A provider SLA is not automatically your application’s availability, and a budget alert is not a spending cap.',
    summary:
      'Choose a service model by responsibilities and requirements. Model failure and cost before provisioning.',
    resources: [r.cloud, r.cost, r.well],
    lab: {
      title: 'Choose a cloud service without deploying',
      tools: 'Browser, spreadsheet or text editor. No subscription required.',
      cost: 'Free & local',
      setup:
        'Use the official Azure pricing calculator through azure.microsoft.com/pricing/calculator. Do not sign up for paid infrastructure for this exercise.',
      tasks: [
        'List the operational tasks for hosting a Node API on a VM, App Service and a finished SaaS product. Mark provider and customer responsibilities.',
        'Estimate a short demo and a full-month deployment using current calculator inputs. Record region, date, hours and assumptions; do not assume a free allowance.',
        'Draw a two-instance web tier with one database and identify remaining single points of failure.',
        'Write an availability objective and describe how you would measure it from the user’s perspective.',
        'Create a preflight and cleanup checklist, including budget alerts and checking for orphaned disks.',
      ],
      expected: 'A service-model matrix, dated estimate and reliability/cost checklist.',
      validate:
        'The estimate includes storage and operations where applicable. Customer responsibilities include data and access management in every model.',
      troubleshooting:
        'If a calculator item differs by region or SKU, record the actual selection instead of copying an old price. An estimate is not a billing guarantee.',
      cleanup:
        'No resources should have been created. If you explored an existing subscription, confirm no deployment was submitted.',
    },
    questions: [
      q(
        'Who normally patches the guest OS in an IaaS VM?',
        ['The customer', 'The browser vendor', 'Nobody', 'The DNS provider'],
        0,
        'The provider operates physical hosts, while the customer manages the guest OS.',
      ),
      m(
        'Which can continue costing money after a VM is deallocated?',
        ['Managed disks', 'Retained backups', 'Some public IP resources', 'The stopped CPU execution itself'],
        [0, 1, 2],
        'Deallocation affects compute allocation, not all associated billable resources.',
      ),
      b(
        'Adding web replicas automatically fixes a single database failure.',
        false,
        'All replicas can still depend on the same failed database.',
      ),
      s(
        'Why choose PaaS for a small web API? State a tradeoff.',
        'It reduces guest OS/runtime operations and can speed deployment. Tradeoffs include platform constraints, service-specific configuration and less low-level control; data and application security remain customer responsibilities.',
      ),
    ],
    assignment:
      'Write a service-selection decision record for your future capstone, including operating responsibilities, one failure scenario and a dated cost estimate.',
    review:
      'Compare VM and PaaS responsibility lists, challenge your cost assumptions and complete the assessment before beginning Azure architecture.',
    reviewQuestions: [
      'How is elasticity different from availability?',
      'What remains your responsibility in SaaS?',
      'Why does cleanup need an inventory check?',
    ],
  }),
];
