import type { Section } from './types';

export const week1Glossary = [
  {
    term: 'Infrastructure',
    definition: 'The computers, OS, connections and storage an app needs to run.',
    example: 'A Node API needs a running computer and a way to receive requests.',
  },
  {
    term: 'Workload',
    definition: 'The application and work you want the computer to run.',
    example: 'Request notebook is this week’s workload.',
  },
  {
    term: 'Process',
    definition: 'One running copy of a program, with its own memory and identity.',
    example: 'The running Node API is a process; api.mjs is a file.',
  },
  {
    term: 'PID',
    definition: 'Process ID: the OS number identifying a running process.',
    example: 'Match the pid in /api/status with Task Manager.',
  },
  {
    term: 'Operating system (OS)',
    definition: 'Software that manages hardware and running programs.',
    example: 'Windows or Linux gives the API CPU time and file access.',
  },
  {
    term: 'Kernel',
    definition: 'The central part of an OS that manages resources and access.',
    example: 'Typical Linux containers share a Linux kernel.',
  },
  {
    term: 'CPU and core',
    definition: 'The CPU executes instructions. A core is one execution unit within it.',
    example: 'Turning a JavaScript object into JSON uses CPU time.',
  },
  {
    term: 'RAM / memory',
    definition: 'Working space used by running programs.',
    example: 'The API counter is held in its process memory.',
  },
  {
    term: 'Volatile',
    definition: 'Temporary; not expected to survive the relevant stop or loss of power.',
    example: 'The in-memory counter resets when the API restarts.',
  },
  {
    term: 'RSS',
    definition:
      'Resident set size: memory resident in RAM for a process, including more than JavaScript objects.',
    example: 'memoryBytes in the status response reports API RSS.',
  },
  {
    term: 'Storage',
    definition: 'A place to keep files beyond a process running, such as a disk.',
    example: 'The API writes the dummy sample into a file in data/.',
  },
  {
    term: 'Persistence',
    definition: 'Data surviving a specified event or lifetime.',
    example: 'The saved phrase survives an API process restart.',
  },
  {
    term: 'State',
    definition: 'Information a system currently holds.',
    example: 'The counter and saved sample are two kinds of application state.',
  },
  {
    term: 'Backup / restore',
    definition: 'A retained copy or older state for recovery; restoring means recovering from it.',
    example: 'Recovering a deleted sample from a tested separate copy is different from restarting the API.',
  },
  {
    term: 'Replica',
    definition: 'Another current copy of a system or data.',
    example: 'Two data copies can both receive an unwanted deletion, so replication alone is not a backup.',
  },
  {
    term: 'IP address / loopback',
    definition: 'An address identifies a network destination; loopback refers to the same computer.',
    example: '127.0.0.1 sends this lab’s request back to your own computer.',
  },
  {
    term: 'Port',
    definition: 'A number used with an address to select where a program exchanges data.',
    example: '4170 selects the guided web listener.',
  },
  {
    term: 'Listener / bind',
    definition:
      'A listener waits for connections at an address and port. Binding sets up its use of that address and port.',
    example: 'The API listens on 127.0.0.1:4100 in guided mode.',
  },
  {
    term: 'Client / server',
    definition: 'A client sends a request. A server handles requests.',
    example: 'The web process is a server to the browser and a client to the API.',
  },
  {
    term: 'Proxy / upstream',
    definition: 'A proxy forwards a request. Its upstream is the server it forwards to.',
    example: 'The web process forwards /api/status to the API.',
  },
  {
    term: 'HTTP / status / header',
    definition:
      'HTTP defines requests and responses. A status describes the result; headers describe the message.',
    example: '200 with Content-Type application/json indicates a successful response carrying JSON.',
  },
  {
    term: 'Route / endpoint',
    definition:
      'In this app, a route is a requested path. An endpoint is the address/port or API operation you connect to, depending on context.',
    example: '/api/status is an API route; http://127.0.0.1:4100/api/status identifies its direct URL.',
  },
  {
    term: 'DNS / hostname',
    definition: 'A hostname is a readable destination name. DNS looks up information for names.',
    example: 'localhost is a name, while 127.0.0.1 is already an IP address.',
  },
  {
    term: 'IPv4 / IPv6',
    definition: 'Two IP address formats.',
    example: '127.0.0.1 is IPv4; ::1 is an IPv6 loopback address.',
  },
  {
    term: 'HTTPS / TLS',
    definition: 'HTTPS protects HTTP traffic using TLS encryption and related security checks.',
    example:
      'A public login page needs appropriate HTTPS protection; this loopback lab does not demonstrate it.',
  },
  {
    term: 'TCP / UDP',
    definition: 'Transport protocols: different rules for moving data between applications.',
    example: 'Week 2 examines why HTTP connections and other traffic use particular transports.',
  },
  {
    term: 'Built asset / bundle',
    definition: 'A file produced for the browser by a build; a bundle combines code into a deliverable file.',
    example: 'browser.js contains the already-built React client.',
  },
  {
    term: 'Client rendering / DOM',
    definition: 'Client rendering builds the UI in the browser. The DOM is its tree of page elements.',
    example: 'React updates the page after the browser receives API data.',
  },
  {
    term: 'Configuration / JSON',
    definition: 'Configuration is settings. JSON is a text format for structured data.',
    example: 'guided.json contains the lab’s port and data-file settings.',
  },
  {
    term: 'Log / evidence / hypothesis',
    definition:
      'A log records events; evidence supports a claim; a hypothesis is a possible cause you can test.',
    example: 'A refused target in a log can help test a connection hypothesis.',
  },
  {
    term: 'Retest / end-to-end check',
    definition:
      'Repeat a check after a change; an end-to-end check follows the original user operation through its full required path.',
    example: 'Click Refresh API status after a repair, rather than only checking that a file was saved.',
  },
  {
    term: 'Terminal / current directory',
    definition: 'A command window and the folder its relative file commands use.',
    example: 'Run node run.mjs guided from the extracted folder containing run.mjs.',
  },
  {
    term: 'Launcher / child process',
    definition: 'A launcher starts other processes. Those processes are its children.',
    example: 'run.mjs starts separate api.mjs and web.mjs processes.',
  },
  {
    term: 'Permissions / identity',
    definition: 'An identity is who a request or process acts as; permissions specify allowed actions.',
    example: 'An API needs permission to write its data file, not every file on the computer.',
  },
  {
    term: 'VM / host / guest / hypervisor',
    definition:
      'A VM is a software-presented machine. The host supplies resources, the guest OS runs inside it, and the hypervisor presents virtual hardware.',
    example: 'A Windows host can run a Linux guest VM.',
  },
  {
    term: 'Container / image',
    definition:
      'A container runs isolated app processes. An image is the packaged app and its starting files.',
    example: 'A Linux Node container usually shares a kernel rather than running a separate guest kernel.',
  },
  {
    term: 'Availability / failure boundary',
    definition:
      'Availability is being usable when needed. A failure boundary describes what one failure can affect.',
    example: 'Power loss on one computer can stop both Node servers.',
  },
  {
    term: 'Rubric / diagnostic',
    definition:
      'A rubric describes scoring criteria. A diagnostic checks prior understanding to guide learning.',
    example: 'The first six questions are ungraded; the lab rubric awards points for real evidence.',
  },
  {
    term: 'Latency / throughput / capacity',
    definition:
      'Latency is how long an operation waits; throughput is how much work or data moves per second; capacity is how much can fit or be handled.',
    example: 'A disk can have space left but still respond slowly to many small requests.',
  },
  {
    term: 'Dependency / memory leak',
    definition:
      'A dependency is another system an operation needs. A memory leak means retaining memory the program no longer needs.',
    example: 'A slow database dependency can delay a request without proving a memory leak or high CPU use.',
  },
];

export const lecture: Section[] = [
  {
    title: 'Start with an app you know',
    body: 'You have probably seen this before: a React page opens, but its API call fails. The page and the API depend on different running programs. This week, we will learn how to tell which part is working and which part needs attention.\n\nInfrastructure means the equipment and software that keep an app running. We will meet each part in turn. We will start on your own computer. You do not need an Azure account. You will use Request notebook, a small React/Node app that is already written. A workload simply means the application and work we want the computer to run. You will see this word in cloud documentation.\n\nFirst, complete the ungraded diagnostic above. It asks what you already know, including topics from later weeks. An unfamiliar question is expected. Choose “Not sure yet” or write “I do not know yet.” Do not search for answers. The diagnostic does not affect your grade.\n\nRead the explanations below in order. Try each “Pause and think” question before opening its explanation. Save the full experiments for Sunday. On Saturday, you only need to check that the app can start and draw its main parts. Keep the academy open in one browser tab and the lab app in another. They are different applications.',
  },
  {
    title: 'A process is a program that is running',
    body: 'Having server code in a folder is useful, but the code cannot answer a request until a program runs it.',
    concept: {
      what: 'A process is one running copy of a program. It has its own working memory and an ID called a process ID, or PID. A Node process can run your API code. The browser also runs as processes on your computer.',
      why: 'A repository stores code. It does not keep that code running. When an API stops responding, we need to check the running program as well as the files. Two Node processes can use the same installed Node program but do different jobs.',
      how: [
        'You start Node with a file to run. Node starts a process and loads the code it needs.',
        'The operating system, or OS, manages the computer. It lets the process execute instructions on the processor, use working memory and access allowed files. We will examine these resources next.',
        'While the process runs, it can handle requests and keep temporary values in memory.',
        'When the process stops, it can no longer handle new requests. Starting it again creates a new running copy. Do not depend on its PID staying the same; an OS can reuse IDs.',
      ],
      example:
        'Request notebook starts two Node processes: one delivers the web page, and one runs API handlers. A third Node process, the launcher, starts and stops those two children. A child process is simply a process started by another process. The launcher is not the API. The API status response reports the API PID.',
      remember:
        'Code on disk and a running process are different things. A running process has an identity and memory. A machine is the computer that can run several processes.',
    },
    checks: [
      {
        question:
          'The API files are still in the folder, but the API process has stopped. Can those files answer a new request?',
        answer:
          'No. The files remain, but no running API process is handling the request. Check whether the intended process is running before changing application code.',
      },
    ],
  },
  {
    title: 'Where does the React code run?',
    body: 'Let us separate three things you already use: source code, a build and a running app.',
    concept: {
      what: 'Source code is what you edit. A build turns that code into files ready to use. A built asset is one of those output files, such as browser.js or style.css. In this app, client rendering means the browser runs the React code and creates the page elements.',
      why: 'A successful frontend build does not prove the API is running. Knowing who runs each piece helps you investigate deployment failures without rebuilding everything.',
      how: [
        'The Node web process sends index.html, browser.js and style.css to the browser.',
        'The browser runs browser.js. React updates the DOM: the browser’s tree of page elements.',
        'When you click a button that needs data, the browser sends a separate API request. The API process runs the server-side handler.',
      ],
      example:
        'The Request notebook title can appear even when its API request fails. The files needed to display the title arrived successfully. The later request for API data is a different operation. Other React apps may render on a server; we are describing this specific client-rendered app.',
      remember:
        'In this app, Node delivers the React files and the browser executes them. Do not treat “the page appeared” as proof that every API operation works.',
    },
  },
  {
    title: 'A port tells a request where to go',
    body: 'Your computer may run the academy, a web server and an API at the same time. A request needs a way to choose the right destination.',
    concept: {
      what: 'An IP address identifies a network destination. A port is a number used with that address to select where a program exchanges data. A listener is a running program waiting for connections at an address and port. “Bind” means ask the OS to use that address and port for a listener.',
      why: 'The browser needs both the right address and the right port. A healthy API on one port cannot answer a request sent to a different port with no listener.',
      how: [
        'The guided web process listens at 127.0.0.1:4170. Here, 4170 is the port.',
        '127.0.0.1 is a loopback address. It means “this computer itself.” The lab listens only there, so other devices cannot connect through your computer’s network address.',
        'The API listens at 127.0.0.1:4100. The web and API use different ports.',
        'The OS delivers a connection to the listener using that address and port. If nothing accepts it, the client may receive a connection-refused error.',
      ],
      example:
        'Open http://127.0.0.1:4170 in your browser for the guided lab. Keep the academy in its own tab; a local academy often uses port 5173. Entering 127.0.0.1 on your phone refers to your phone, not your laptop.',
      remember:
        'Use the exact address and port. “localhost” is a hostname, a readable name for a destination. It may select IPv6, a different IP address format. This lab uses the IPv4 address 127.0.0.1 explicitly to avoid that mismatch.',
    },
    checks: [
      {
        question:
          'An API runs on port 4100. A request goes to unused port 4101. Does the running API make that request succeed?',
        answer:
          'No. The destination port is different. Check the address and port the caller actually used, rather than only checking that an API process exists.',
      },
    ],
  },
  {
    title: 'Follow one click from the browser to the API',
    body: 'Now connect those parts. A client asks for something. A server answers requests. These are roles: the same program can be a server for one request and a client for another.',
    concept: {
      what: 'A proxy forwards a request to another server. That destination is often called the upstream server. HTTP is the request-and-response protocol used here: a set of rules for sending requests and responses. A route is an application path such as /api/status.',
      why: 'The browser talks to the web address. The web process forwards API requests to the separate API. You need to understand both connections to find a failure between them.',
      how: [
        'The browser opens http://127.0.0.1:4170 and receives the page and React files.',
        'You click Refresh API status. React sends an HTTP request for /api/status to the web process at port 4170.',
        'The web process becomes a client. Its proxy forwards the request to the API at port 4100.',
        'The API answers with JSON, a text format for structured data. The web process sends that response back to the browser, where React displays it.',
      ],
      example:
        'A direct request goes straight to port 4100. A proxied request goes to port 4170 first. Comparing them helps locate a failure: can the API answer directly, and can the web process reach it?',
      remember:
        'A working request depends on the whole path. For this API operation, check browser → web → API. Only a request that reads or writes the sample also needs the sample file.',
    },
    diagram: [
      'Browser runs React and asks for /api/status',
      'Node web process · 127.0.0.1:4170 · forwards the request',
      'Node API process · 127.0.0.1:4100 · handles it',
      'Local data file · used when reading or saving the dummy sample',
    ],
    checks: [
      {
        question: 'Does a request to 127.0.0.1 need DNS to discover its IP address?',
        answer:
          'No. The URL already contains an IP address. DNS, the Domain Name System, looks up information such as IP addresses for names. Name lookup is separate from the later HTTP request. Week 2 teaches it in detail.',
      },
    ],
  },
  {
    title: 'CPU: the computer doing the work',
    body: 'A slow API is not automatically a problem with the processor. First ask what work the request is waiting for.',
    concept: {
      what: 'The CPU, or central processing unit, executes instructions. A core is a part of the CPU that can execute work. Parsing a request and turning an object into JSON use CPU time.',
      why: 'CPU capacity limits how much computation a machine can do. But buying a larger machine helps only if the limited resource is part of the real problem.',
      how: [
        'The OS gives running processes turns on the available CPU cores.',
        'A request uses CPU while executing instructions. It can also spend time waiting, for example for a database response.',
        'More cores can allow more work at once. One task does not automatically split itself across every core.',
      ],
      example:
        'Imagine one request needs 100 milliseconds of CPU work. Ten such requests per second need about one CPU-second each second, before other work is counted. That is a rough example, not a benchmark of this lab. A request waiting two seconds for a database might be slow while CPU use stays low.',
      remember:
        'Measure before resizing. Low CPU plus slow responses does not tell you the cause. Look at the request, time spent waiting and the systems it calls. These other required systems are its dependencies.',
    },
  },
  {
    title: 'RAM: a process keeping information while it runs',
    body: 'Think of a variable in your API. Where does its current value live while the program is running?',
    concept: {
      what: 'RAM, or random-access memory, is the computer’s working memory. A process uses memory to hold values while it runs. Volatile means temporary: do not expect the API’s in-memory value to survive the process stopping.',
      why: 'Memory lets the API keep values it can use quickly. But an ordinary variable is not a safe place for data that must survive a restart.',
      how: [
        'The API starts its counter at zero in process memory.',
        'Clicking Increment volatile counter changes that running API’s value.',
        'Stopping the API discards that value. The next API process starts its own counter at zero.',
        'The status response also reports memoryBytes. This uses RSS, resident set size: memory currently resident in RAM for that process. It includes more than JavaScript objects and is not the machine’s total RAM.',
      ],
      example:
        'A browser may still display counter 2 after you stop the API. That is an old response on screen. Click Refresh API status to make a new request before deciding whether the server is still running.',
      remember:
        'API memory and browser memory are separate. One large memory reading does not prove a memory leak, where a program keeps memory it no longer needs. Compare readings over time and with the work being done. Do not exhaust your machine to test this.',
    },
    checks: [
      {
        question:
          'You stop the API and start it again without deleting files. Should its ordinary in-memory counter keep its old value?',
        answer:
          'No. The new process starts a new counter. To keep the value across restarts, the app would need to save and reload it somewhere outside that process memory.',
      },
    ],
  },
  {
    title: 'Storage, persistence and backup',
    body: 'Now compare the counter with a file saved by the API. They have different lifetimes.',
    concept: {
      what: 'Storage holds files on a device such as a disk. Persistence means data survives a particular event, such as a process restart. A backup is a retained copy or older saved state that you can use to recover from a specified loss.',
      why: 'An application needs some data to outlive its running processes. It also needs a recovery plan if the only stored copy is lost or damaged. Saving data and protecting it from loss are different jobs.',
      how: [
        'You save a dummy sample. The API writes that text into its configured data file.',
        'You restart the app without deleting that file. The new API can read it, even though its counter starts over.',
        'This proves the file survived that restart. It does not prove the file survives a lost disk, deletion or damaged contents.',
        'A replica is another current copy. It can improve availability, but an unwanted deletion may reach both copies. A backup or retained older version must support a tested restore for the loss you care about.',
      ],
      example:
        'Source code in Git, built browser.js, a temporary counter, an uploaded file, a database record and a backup are different kinds of data. State means the information a system currently holds. Always ask which state lives where and what can destroy it.',
      remember:
        'Name the event you tested: “the sample survived a process restart.” Do not turn that into “we have a backup.” Disk capacity is how much fits; latency is how long an operation waits; throughput is how much data moves per second. A large disk can still be slow. This tiny file is not a storage performance test.',
    },
  },
  {
    title: 'The operating system and shared failures',
    body: 'Separate Node processes still need the same computer to keep working.',
    concept: {
      what: 'An operating system (OS), such as Linux or Windows, manages the computer’s hardware and running programs. Its kernel is the central part that manages resources and access. A data center is a building with computers, power, cooling and network connections.',
      why: 'Your app needs CPU time, memory, files and connections. The OS manages those resources. It also checks permissions: rules about who may read, write or run something. A data center supplies the physical conditions needed to keep machines running.',
      how: [
        'The OS schedules work, manages memory, reads and writes files, and delivers network data to listeners.',
        'Processes run with an identity and permissions. An API should get the access it needs, rather than permission to rewrite the whole computer.',
        'Two processes on one machine share its OS, hardware and power. A power loss can stop both.',
        'Two machines may still share a power supply, database or network connection. A failure boundary means the set of things one failure can affect.',
      ],
      example:
        'Your laptop is acting as a server when it answers lab requests. Server describes that role; it does not require a special-looking computer. Production hosting adds stronger security, capacity and availability needs. Availability means the service is usable when needed. Drawing two API boxes does not prove availability if both still depend on one failed machine.',
      remember:
        'Process separation is useful, but it does not remove shared failures. Draw the shared machine and important dependencies on your diagram.',
    },
  },
  {
    title: 'Virtual machines and containers',
    body: 'You have used Docker. Now connect it to the computer underneath.',
    concept: {
      what: 'Virtualization lets software present a machine-like environment using real hardware. A virtual machine (VM) has a guest OS: an OS running inside the VM. The physical computer is the host. A hypervisor is the layer that supplies virtual hardware to VMs.',
      why: 'VMs let multiple operating systems use a physical computer while keeping separate guest environments. Containers package an application and isolate its processes without usually supplying a separate guest kernel for each container.',
      how: [
        'A hypervisor gives each VM virtual CPU, memory and disks. Those resources still depend on finite physical hardware.',
        'Each VM runs its guest OS and applications.',
        'A Linux container normally shares the host Linux kernel. Its application processes have isolation, but not a separate kernel in each container.',
        'On some desktop systems, Docker uses a Linux VM. Containers then share that VM’s Linux kernel. A VM and containers can be used together.',
      ],
      example:
        'A Node process in a container still needs memory and CPU, and it can still fail. A container image is the packaged app and its files. It is not automatically a safe home for changing uploads. A file may survive a process restart but disappear when its container or machine is replaced, depending on how storage is configured.',
      remember:
        'A VM includes a guest OS; a typical Linux container shares a kernel. Cloud services change who manages these layers, not whether the layers exist. You only need to explain the difference this week; do not install a cluster, a group of machines managed together.',
    },
  },
  {
    title: 'Worked example: the page opens, but API data does not',
    body: 'A status code is the number in an HTTP response. In this example, 200 means the request succeeded. 404 means the responding server did not find that path. 502 means this web proxy could not complete its request to the upstream API. A connection error is different: you may receive no HTTP response at all.\n\nSuppose the homepage and browser.js return 200. Refresh API status returns 502. A direct request to API port 4100 returns JSON. The web log, a record of events printed by the program, says it tried port 4101 and got ECONNREFUSED. That error means the attempted connection was refused.\n\nFirst, say what each result proves. The web process delivered files. The API answered its direct request. The proxy tried a different destination. A hypothesis is a possible cause that you can check. Here, a sensible hypothesis is that the proxy’s target does not match the API listener.\n\nNext, inspect that setting. If it is wrong, make the smallest relevant correction, restart the process that reads it, and retry the original operation through the web page. A retest means repeating a check after a change. Verify the API port and PID in the fresh result too. Do not just change a label or restart everything.\n\nA single 502 can have several causes. This example supports a target mismatch because we also have direct API success and the attempted destination in the log. A successful retest still does not prove every other route, authentication check or database works. This is how engineers keep a useful conclusion within the evidence they collected.',
    checks: [
      {
        question:
          'The browser shows an old successful status after the server stops. What should you do before saying the API is healthy?',
        answer:
          'Make a fresh request. A displayed result can be old. New response data, or a new connection error, tells you more about the current state.',
      },
    ],
  },
  {
    title: 'Saturday readiness check and command practice',
    body: 'Use your 25-minute readiness block to download the app, check Node and make a simple diagram. The steps below explain which folder and terminal to use. A terminal is the window where you type commands. Your current folder is the folder that terminal commands use for relative filenames.\n\nName your terminals A and B in your notes. Terminal A keeps the app running. Terminal B sends test requests. The command prompt is the line where the terminal is ready for another command. While the launcher runs, Terminal A normally prints logs rather than returning to that prompt.\n\nFollow the numbered readiness steps here for one start and one request. Do not do the full restart or incident experiments today. Draw browser → web process → API process → sample file. Mark the web and API ports. Record anything you cannot explain yet.\n\nCheck whether you already have a permitted Ubuntu VM or WSL environment for later Linux weeks. WSL is Windows Subsystem for Linux, which provides a Linux environment on Windows. Do not spend today installing several tools or changing a managed work computer. If Node is blocked, use the clearly labeled supplied-evidence option on Sunday and record local execution as pending. There is no Azure deployment this week.\n\nThis app uses plain HTTP on your computer only. HTTPS adds encryption using TLS, Transport Layer Security. Public applications need suitable security; a successful loopback request does not demonstrate it. We will study DNS, TCP/UDP and TLS in Week 2. TCP and UDP are transport protocols: rules for moving data between applications. You do not need to learn them from another course tonight.',
    steps: [
      'Download the ZIP above and extract it into a new folder. Open the folder containing run.mjs. On Windows, File Explorer’s Open in Terminal option opens Terminal A in that folder. On macOS/Linux use the folder’s terminal option, or change to that folder from an existing terminal. Ask for help if setup is blocked rather than using all your study time.',
      'In Terminal A run node --version. If it reports version 22 or newer, run node run.mjs guided. Keep that terminal open.',
      'Open the printed web URL in your browser. In Terminal B run the read-only status request below. Today one request is enough.',
      'Draw the browser, web process, API process and file, with their connections. Record any unknown part. In Terminal A press Ctrl+C to stop the launcher. Save the full memory/restart and repair activities for Sunday.',
    ],
    commands: [
      {
        where:
          'Terminal A in the extracted folder containing run.mjs. If your terminal opened elsewhere, change its folder first.',
        command: 'node --version\nnode run.mjs guided',
        does: 'The first command checks Node. If its version is supported, the second starts the supplied app with guided settings.',
        options: '--version prints the version; guided selects guided.json.',
        expect:
          'Node 22 or newer, then API/web Listening messages on ports 4100 and 4170. The launcher keeps running.',
        ifFails:
          'If Node is not found, record the tool problem. If run.mjs is not found, check the current folder. For an occupied port, identify your own previous lab process before stopping it. Sunday’s troubleshooting notes explain these errors.',
      },
      {
        where:
          'Terminal B, while Terminal A still runs. Windows command shown; Linux/macOS use curl instead of curl.exe.',
        command: 'curl.exe -i http://127.0.0.1:4170/api/status',
        does: 'Reads API status through the web process, without changing the counter or sample.',
        options:
          '-i prints response headers as well as the body. Content-Type is the header that describes the data format.',
        expect:
          'HTTP 200 and JSON with the API PID and port 4100. Actual PID, uptime and memory readings vary.',
        ifFails:
          'Check the printed web URL and that Terminal A is still running. If curl is unavailable, open this read-only URL in the browser. Do not treat the old displayed response as a new check.',
      },
    ],
  },
];

const folder = 'Terminal A, inside the extracted lab folder that contains run.mjs. Keep this terminal open.';
const requestCommand = (url: string, expect: string) => ({
  where:
    'Terminal B, a second terminal. It can use the same extracted folder. Keep Terminal A running. On Windows use the command shown; on Linux/macOS replace curl.exe with curl.',
  command: `curl.exe -i ${url}`,
  does: 'Sends a read-only HTTP GET request to this exact URL and prints the response. GET asks to read a resource; it does not ask the API to save a sample.',
  options:
    '-i includes the response headers above the body. Headers describe the response; Content-Type tells you its format. Inspect the HTTP status, not only whether the command returned.',
  expect,
  ifFails:
    'Check that Terminal A is still running and the address/port matches the printed URL. If curl.exe is unavailable on Windows, use the browser address bar for this read-only URL and its Network tools. Do not change a firewall or stop unrelated processes.',
});

export const week1LabSections: Section[] = [
  {
    title: 'Preflight: open the right folder · 15 minutes',
    body: 'Goal: get a safe local copy of the app ready. Use only dummy text, such as “week01 persisted sample”. The app does not have login protection and is not a production template. It listens only on 127.0.0.1, your own computer. Nothing is created in Azure.',
    purpose:
      'All later commands depend on running the supplied files from the right folder. We want setup problems to be separate from the investigation.',
    steps: [
      'Download the ZIP using the button above. Extract it into a new folder you can delete later, for example Documents/academy-week01-lab. Do not run commands inside the ZIP preview.',
      'Open the extracted folder. Find run.mjs, guided.json, variation.json and incident.json. If an extra folder surrounds them, open that inner folder.',
      'Open Terminal A there. On Windows, use File Explorer’s Open in Terminal option, or open PowerShell and type cd followed by the full folder path in double quotes. On macOS/Linux, open a terminal and use cd with the quoted folder path. cd means “change directory”; directory means folder. Use your actual path, not an example copied literally.',
      'Run node --version below. You need version 22 or later. If Node is missing or blocked, record the error; use the supplied-evidence option if setup takes longer than the available setup/break time. Do not bypass workplace restrictions.',
      'Make copies of variation.json and incident.json in the file manager before editing them. Keep guided.json unchanged. Configuration means settings the app reads when it starts. These files use JSON: use double quotes around property names and strings, and do not add comments.',
      'Open Terminal B for requests. Leave Terminal A for the launcher. Keep both separate from any terminal running the academy website.',
    ],
    commands: [
      {
        where: folder,
        command: 'node --version',
        does: 'Asks the installed Node program for its version. It does not start the lab.',
        options: '--version means print the version number.',
        expect: 'A version such as v22.x.x or a newer major version. The exact patch number can differ.',
        ifFails:
          'If the command is not found, Node may not be installed or your terminal may not find it. Reopen the terminal after an allowed installation; otherwise record the blocker and use the supplied-evidence option.',
      },
    ],
    expected:
      'Two terminals are available, Node is supported, and the extracted files are visible. No npm install is needed; the React files are already built.',
    evidence: [
      'Record Node version, operating system and the lab folder name. Do not publish your full personal folder path.',
    ],
  },
  {
    title: 'Part A — Guided requests and restart experiment · 40 minutes',
    body: 'Goal: see which program answers each request, then compare temporary memory with a saved file. This part gives you a method to reuse independently in Part B.',
    purpose:
      'A page appearing, an API answering and data surviving a restart are three different observations. You will collect evidence for each.',
    steps: [
      'In Terminal A, run node run.mjs guided. Wait for both “[api …] Listening” and “[web …] Listening” messages. The numbers after api and web are their process IDs. Leave it running.',
      'Open http://127.0.0.1:4170 in a browser tab. You should see Request notebook. Open the browser developer tools (F12 or Inspect), then Network. Reload the page to see requests for the HTML, JavaScript and CSS. Click Refresh API status to see /api/status.',
      'Run the three read-only request commands below in Terminal B. Record the HTTP status and Content-Type. Compare the PID from the API response through the web with the PID from the direct API response. They should identify the same running API.',
      'Match that API PID with an OS process tool. On Windows open Task Manager → Details; on macOS open Activity Monitor; on Linux use the process command below. Do not stop it yet. The launcher PID is a different process.',
      'Click Increment volatile counter twice. Wait for each request to finish. Record counter 2. Enter “week01 persisted sample” in Dummy persisted sample and click Save dummy sample. Click Refresh API status and confirm the phrase is still shown.',
      'Return to Terminal A and press Ctrl+C. That stops this launcher and its two child processes. In Terminal B, retry both the web and direct API status commands. Expect a connection error, not a 404 response. Record what actually happened.',
      'In Terminal A, run node run.mjs guided again. In the browser, click Refresh API status. Record the counter and saved phrase. Explain the difference. A displayed old value is not new evidence; refresh after restarting.',
      'Stop the launcher with Ctrl+C before Part B. Confirm both old status URLs no longer answer new requests.',
    ],
    commands: [
      {
        where: folder,
        command: 'node run.mjs guided',
        does: 'Runs the supplied launcher using guided.json. The launcher starts separate web and API processes. guided selects the prepared control settings; it is not an option to install anything.',
        expect:
          'Listening messages for web port 4170 and API port 4100. The terminal stays busy with logs until you stop it with Ctrl+C.',
        ifFails:
          '“Cannot find module” often means the terminal is in the wrong folder. A JSON error means the configuration is not valid JSON. EADDRINUSE means another listener already uses a selected address/port; identify it before stopping anything. Keep guided settings as the control if possible.',
      },
      requestCommand(
        'http://127.0.0.1:4170/api/status',
        'HTTP 200 and JSON with pid, port 4100, uptimeSeconds, memoryBytes and counter. uptimeSeconds is time since this API started. memoryBytes is process RSS in bytes, not free machine RAM.',
      ),
      requestCommand(
        'http://127.0.0.1:4100/api/status',
        'HTTP 200 and the same API PID and port as the proxied request. Uptime and memory readings can change between requests.',
      ),
      requestCommand(
        'http://127.0.0.1:4170/missing.html',
        'HTTP 404 from the running web process. curl can finish normally even when the HTTP response is an error, so read the status line.',
      ),
      {
        where:
          'Linux only: Terminal B while the lab runs. Windows/macOS students can use the process tools named in step 4 instead.',
        command: 'ps -eo pid,args',
        does: 'Lists running process IDs and their commands. Find the API PID reported by /api/status; no process is changed.',
        options: '-e selects all processes. -o pid,args chooses the PID and command columns.',
        expect: 'A row for the API PID whose command runs api.mjs. Other Node processes may also appear.',
        ifFails:
          'Use your OS process viewer instead and record the tool. Do not guess a PID or kill every Node process.',
      },
    ],
    expected:
      'The page and API requests succeed while running; the missing file returns 404. After restart, the counter is zero but the saved phrase remains. Both URLs stop accepting connections after cleanup.',
    evidence: [
      'Keep the statuses, Content-Type values and actual API PID. Add the process-tool observation.',
      'Record counter and sample before and after restart. State exactly what survived, and why this is not a backup test.',
      'Keep the stopped-listener results, including any unexpected result you need to investigate.',
    ],
  },
  {
    title: 'Part B — Independent task: change the settings · 50 minutes',
    body: 'Goal: run the same app with web port 4180, API port 4200 and the separate variation data file. Its page and API operation must both work. Configuration keys are named webPort, apiPort, upstreamPort and dataFile. Use Saturday’s model and the supplied code to understand what each setting controls. The completed configuration is intentionally not provided.',
    purpose:
      'This checks whether you can apply the method to a similar task without copying a complete solution.',
    steps: [
      'Confirm the guided launcher is stopped. Work on variation.json, not guided.json. Keep a copy of its starting settings.',
      'Change the settings to meet the goal. Do not change React code, API handlers or the files that implement the servers. You may use the lecture, guided notes and supplied source files.',
      'Start variation mode using the command below. Choose your own browser and direct/proxied request checks. Show that the status belongs to the intended API listener, not an old instance.',
      'Save a different dummy phrase. Test a restart and compare the saved sample with the counter. Explain which lifetime you tested.',
      'Stop the variation launcher. Check its URLs and the old guided URLs so you know you are not looking at a different running instance.',
    ],
    commands: [
      {
        where: folder,
        command: 'node run.mjs variation',
        does: 'Starts the same supplied servers using your variation.json settings. It does not edit the settings for you.',
        expect:
          'Listening messages on the ports required above, a working page and successful API operation. Choose checks that prove those results.',
        ifFails:
          'Keep the first error and compare it with your intended settings and diagram. Use the troubleshooting notes, but record any help used. Do not replace your file with a model answer.',
      },
    ],
    expected:
      'Your own checks demonstrate the required listeners, a working request through the web, and the expected memory/file behavior.',
    evidence: [
      'Before/after variation settings, your chosen commands and actual outputs, your restart comparison and any hint used.',
    ],
  },
  {
    title: 'Part C — Investigate a deliberately broken request · 35 minutes',
    body: 'Goal: investigate a configuration with one deliberate fault. The page can load, but Refresh API status fails. Your repair must keep the incident’s assigned web and API listener ports and its data file. Do not replace the configuration with guided.json, rewrite application features, change a firewall or allow public connections. The fix is withheld until you submit your investigation.',
    purpose:
      'An engineer needs a reason for a change and evidence that it worked. “I restarted everything” is not enough.',
    steps: [
      'Stop variation mode. Keep a copy of incident.json, then start incident mode below. Use the URLs printed by this run; do not assume the guided ports apply.',
      'Before editing, open the page and try Refresh API status. Record what works, what fails and the relevant terminal messages. Collect enough information to support a possible cause.',
      'Write your hypothesis: what might be wrong, and which observation would show that your guess is wrong? You may read the configuration and supplied source after recording the initial symptom.',
      'Choose and test the smallest relevant change while keeping the assigned listeners and data file. Decide what needs restarting to read the change.',
      'Repeat the original browser operation and another useful check of your choice. Record actual results and one thing they do not prove. Submit before opening the model feedback.',
    ],
    commands: [
      {
        where: folder,
        command: 'node run.mjs incident',
        does: 'Runs the supplied broken configuration in incident.json. Starting it does not repair it.',
        expect:
          'Both servers start and the document loads, but the API operation fails. Preserve the logs as evidence.',
        ifFails:
          'A startup error such as an occupied listener is a setup problem, not necessarily the intended fault. Record any port changes needed to avoid a conflict and preserve the same exercise constraints. Do not stop unrelated services.',
      },
    ],
    expected:
      'A supported explanation, a small permitted repair and a fresh successful test of the original operation. Naming a likely cause without testing the repair is incomplete.',
    evidence: [
      'Initial symptom and logs, actual listener/process observations, your hypothesis, change, retest and limits. Mark any provided help.',
    ],
  },
  {
    title: 'Part D — Explain your results and stop the app · 20 minutes',
    body: 'Your evidence packet is just one short report containing your observations. Evidence means the actual settings, outputs or screenshots that support a claim. Use this same report for the lab and Wednesday documentation; you do not need a second essay.',
    purpose: 'A teammate should be able to understand what you did, why it worked and what remains untested.',
    steps: [
      'Draw browser → web process → API process → sample file. Label ports and the two server process IDs. Note that only sample operations need the file.',
      'Add the Part A request and restart observations, Part B configuration/results, and Part C symptom → hypothesis → change → retest. Remove personal paths and secrets before sharing.',
      'Briefly explain what an API restart loses, what disk loss could destroy, what shared failure can stop both servers, and what you would inspect before buying a larger VM.',
      'In the launcher’s Terminal A, press Ctrl+C. From Terminal B retry the web and direct API status URLs for the last configuration. Both should fail to connect. If a response arrives, identify the listener before claiming cleanup worked.',
      'Keep your report and dummy files. If you want to remove the app, use the file manager to delete only the extracted lab folder after checking its path. Do not delete the academy repository.',
    ],
    expected:
      'A concise report and no lab listeners left running. No Azure resources were created, so there are no cloud resources to delete or Azure charges from this lab.',
    evidence: [
      'Your A/B/C/D report, cleanup results, any assistance and any activity still blocked. Paste it into the lab submission below. Add Wednesday’s case there or in the documentation submission later.',
    ],
  },
  {
    title: 'If something does not work',
    body: 'If an older downloaded copy shows ERR_UNSAFE_PORT in the browser, download and extract the current ZIP into a new folder. The incident now uses web port 4192. Keep browser security checks enabled.\n\nEADDRINUSE: a listener cannot use an address/port that is already occupied. First check whether an earlier lab is still running in one of your terminals. Stop only a process you know is yours. If you must choose other unused ports, record all changes and keep the request path consistent.\n\nCannot find module: check the current terminal folder contains run.mjs. If browser.js is missing, extract the complete downloaded ZIP rather than copying only the source files.\n\nJSON error: open the configuration in a text editor. Use double quotes, no comments, and valid commas. Save the file, then restart the selected mode so it reads the settings.\n\n404: the responding server did not find the requested path. ECONNREFUSED: a connection attempt was refused. 502: this web proxy could not complete its upstream request. These are clues, not the same error or a complete diagnosis. Keep the URL, time and log message.\n\nThe phrase appears missing: check which mode and dataFile you selected. Did the save request succeed? Click Refresh API status for a fresh view. Do not assume the disk failed.\n\nA managed computer blocks Node: record the message. Do not bypass its policy. Use the supplied observations below for reasoning and label local execution as pending.',
  },
  {
    title: 'If you cannot run Node: use supplied observations honestly',
    body: 'Use this only if setup is blocked after the available setup and spare time. These results are supplied by the course; they are not your own run.\n\nGuided run: GET / returns 200. GET /api/status through the web and directly to the API both return 200, PID 7420 and API port 4100. /missing.html returns 404. Before restart counter=2 and saved text is “week01 persisted sample”. After restart counter=0 and the text is unchanged.\n\nIncident: the page returns 200 and its API operation returns 502. The API answers directly on its assigned listener. The web log reports ECONNREFUSED at a different target.\n\nExplain what each observation supports. Propose a next check and repair, but label them as proposed rather than executed. Write “provided evidence, not executed” on your report. The live variation, repair and cleanup checks remain pending. The rubric does not award execution points for reading supplied results.',
  },
];

export const incidentFeedback: Section = {
  title: 'Incident feedback — compare with your own report',
  body: 'In the default incident, the API listens on 4300. The web process tries port 4301 instead. That is why the API can answer directly while the web’s API operation fails. A working page proves only that the web delivered its files.\n\nKeep the assigned listeners and correct the upstream target: the setting that tells the web where to forward API requests. Restart to load the setting, then request /api/status through the web again. Compare the port/PID with a direct API request. If you used different ports to avoid a conflict, check the same relationship rather than copying these numbers.\n\nCompare your report with the rubric. Did you record the symptom before editing? Does your evidence support the cause? Did a new request confirm the repair? Naming “port mismatch” alone does not earn full marks. If you read this before repairing the app, note the help and repeat a changed Part B task during Wednesday’s practice time.',
};

export const reviewSections: Section[] = [
  {
    title: 'First, explain it from memory · 15 minutes',
    body: 'Put Saturday’s lecture aside for a moment. This is practice recalling an explanation, not a test of formal English.',
    steps: [
      'Draw the browser, web process, API process and sample file. Show how an API request travels between them.',
      'Label where React executes and where the counter lives. Write what survives an API restart and what this test cannot prove.',
      'Compare your explanation with your Saturday notes. Correct any mix-up between a process and a machine before taking the quiz.',
    ],
    expected:
      'Your own explanation first, then a correction if needed. Use ordinary words as long as the technical meaning is right.',
  },
  {
    title: 'A new case to investigate yourself · 40 minutes',
    body: 'This is a written case, not a request to start another app. The observations are supplied: the React page files at web port 4480 return 200. The API operation through that web process returns 502. A direct API status request at 4400 returns PID 8162. The web log says ECONNREFUSED for 4401. Another operator suggests restarting the whole VM and adding RAM.\n\nUse your lecture, notes and lab evidence, but do not open Sunday’s model while writing your first answer. You may use an editor or the documentation box below. The model appears only after submission.',
    purpose:
      'Apply the same investigation method to new numbers. We are checking your reasoning, not whether you memorized Sunday’s settings.',
    steps: [
      'Write your strongest supported hypothesis. Identify two observations that help distinguish it from the web process being stopped.',
      'Name the configuration relationship you would inspect. Propose the smallest safe correction without changing the assigned listeners.',
      'Describe how you would test the original user operation after that change. Explain one thing a successful result would not prove.',
      'Review your actual Part B settings and results. If local execution was blocked, use the remaining practice time to address the blocker or record it as pending.',
    ],
    expected:
      'A reasoned answer supported by the given facts. Do not claim you executed a correction when you only described it.',
    evidence: [
      'Add your answer, diagram and limits to the documentation submission. Use the same lab report rather than writing another essay.',
    ],
  },
  {
    title: 'Use the rubrics to score your work · 25 minutes',
    body: 'A rubric is a scoring guide. Read each row and compare it with your actual evidence. Add earned points and enter the total out of 100. Leave the score blank until you have assessed it; zero means you assessed the work and awarded no points.\n\nThe lab score checks what you did and verified. The documentation score checks how clearly and correctly you explain it. They use the same report but different criteria. A diagram needs the running programs as well as files. A restart test is not proof of backup. A proposed repair without a fresh request is not a verified repair.\n\nThe quiz grades selection questions automatically. For the short answer, compare your explanation with the model and the 0–2 rubric after submitting. The course cannot inspect your local computer or grade free text with AI. You can update submissions and scores after correcting mistakes. Keep the first error and explain what changed.',
  },
  {
    title: 'Fix one misunderstanding and prepare for next week · 15 minutes',
    body: 'Choose one point you got wrong or could not explain. Write a corrected explanation and one limit: what does your evidence still not prove? If your computer is ready, repeat one small relevant check. If a model helped, say so and try a changed familiar case.\n\nStay within this class block. Week 2 explains how names are looked up and how connections and encrypted requests work. Bring one question about a request that failed. You do not need to search for another full networking course.',
  },
];

export const reviewFeedback: Section = {
  title: 'Wednesday case feedback',
  body: 'The web delivered files, and the API answered directly. The web’s attempted destination differs from the API’s observed port. Together, these facts point to the forwarded request path. Inspect that relationship, correct the intended target while keeping the assigned listeners, and retry /api/status through the web. Confirm the response comes from the expected API.\n\nAdding RAM or restarting the whole machine does not address the mismatch shown here. These observations do not test login security, every API route or a production database. Your report should make those limits clear.',
};
