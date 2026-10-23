import type { Kind, Question, Resource, Section, Week } from './types';
import { baseline } from './baseline';
import { single as q, multiple as m, bool as b, short as s } from './helpers';

export const timetable: Record<Kind, { minutes: number; activity: string }[]> = {
  lecture: [
    { minutes: 20, activity: 'Ungraded diagnostic: record what you know before reading.' },
    { minutes: 55, activity: 'Read and explain process, OS, CPU/RAM/storage and hosting boundaries.' },
    { minutes: 35, activity: 'Work through the supplied React/Node request and failure examples.' },
    {
      minutes: 25,
      activity: 'Selected references: MDN 8 min, Node HTTP 10 min, React 7 min; stop at the named sections.',
    },
    { minutes: 25, activity: 'Tool readiness and application diagram micro-exercise.' },
    { minutes: 20, activity: 'Breaks and contingency; distribute breaks through the session.' },
  ],
  lab: [
    { minutes: 15, activity: 'Download/extract, check Node, scope and available loopback ports.' },
    { minutes: 40, activity: 'Part A: guided request/state experiment.' },
    { minutes: 50, activity: 'Part B: independent configuration variation.' },
    { minutes: 35, activity: 'Part C: deliberately broken incident; evidence before correction.' },
    { minutes: 20, activity: 'Part D: reflection, evidence packet and cleanup.' },
    { minutes: 20, activity: 'Breaks/contingency. Defer optional work rather than exceed three hours.' },
  ],
  review: [
    { minutes: 15, activity: 'Closed-note request-path retrieval.' },
    {
      minutes: 25,
      activity: 'Eight-question graded knowledge check; manually assess the short response afterward.',
    },
    { minutes: 40, activity: 'Fresh independent evidence investigation and lab verification.' },
    { minutes: 25, activity: 'Feedback, rubric scoring and concise documentation submission.' },
    { minutes: 15, activity: 'Remediation and Week 2 preparation; no extra homework.' },
  ],
};
export const week1Resources: Resource[] = [
  {
    title: 'What is a web server?',
    provider: 'MDN Web Docs',
    type: 'Documentation',
    url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server',
    description:
      'Read the distinction between web-server hardware and software, then static versus dynamic content. Relate it to the two Node listeners.',
    selection:
      '8-minute assigned extract: opening explanation and static/dynamic server distinction. Skip related-link trees.',
    verified: true,
    reviewedOn: '2026-10-23',
  },
  {
    title: 'Node.js HTTP: createServer',
    provider: 'Node.js',
    type: 'Documentation',
    url: 'https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener',
    description:
      'Inspect the request listener example and explain request, response and listen. Do not read the complete API reference.',
    selection:
      '10-minute assigned extract: http.createServer example, response status/header and server.listen concepts.',
    verified: true,
    reviewedOn: '2026-10-23',
  },
  {
    title: 'React createRoot: rendering in a browser',
    provider: 'React',
    type: 'Documentation',
    url: 'https://react.dev/reference/react-dom/client/createRoot',
    description:
      'Read the browser DOM example. The workload uses this client rendering, not React Server Components or server rendering.',
    selection:
      '7-minute assigned extract: Reference example and Rendering an app fully built with React. Skip API caveats unrelated to this lab.',
    verified: true,
    reviewedOn: '2026-10-23',
  },
  {
    title: 'Node.js process: PID, memory and uptime',
    provider: 'Node.js',
    type: 'Documentation',
    url: 'https://nodejs.org/docs/latest-v22.x/api/process.html',
    description:
      'Optional reference for process.pid, process.memoryUsage().rss and process.uptime(); these are already explained in the lecture.',
    selection: 'Optional deeper reference, not additional assigned homework.',
    verified: true,
    reviewedOn: '2026-10-23',
  },
  {
    title: 'Describe Azure core architectural components',
    provider: 'Microsoft Learn',
    type: 'Course',
    url: 'https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/',
    description:
      'Optional data-center/region/resource vocabulary preview. No Azure account or deployment is needed this week.',
    selection: 'Optional preview only; the whole module is not required for Week 1.',
    verified: true,
    reviewedOn: '2026-10-23',
  },
];

export const diagnosticQuestions: Question[] = [
  {
    ...q(
      'In this supplied app, where does the client-rendered React component execute after its JavaScript has downloaded?',
      [
        'In the Node API process',
        'Inside the storage file',
        'In the browser process',
        'In the Git repository',
      ],
      2,
      'The browser executes this client-rendered React bundle and updates its DOM. Node serves the assets and API. React can also be used in server-rendered architectures; that is not the configuration of this workload.',
    ),
    domain: 'process boundaries',
  },
  {
    ...m(
      'Before testing, which items would you expect to survive stopping and restarting only the API process?',
      [
        'A sample successfully written to its local file',
        'The API’s in-memory counter',
        'The same running API process identity',
        'The already-built frontend asset files',
      ],
      [0, 3],
      'The files outlive this process. The counter is memory state. A new process gets an identity; never rely on PID reuse. File persistence is still not a backup.',
    ),
    domain: 'persistence',
  },
  {
    ...q(
      'A name resolves to an IP, but the application cannot establish its connection. What evidence would most directly help next?',
      [
        'The DNS answer alone proves that the API works',
        'Whether the destination process is listening on the expected address/port',
        'Whether the repository has a recent commit',
        'Whether the user can open another unrelated website',
      ],
      1,
      'A successful name lookup does not prove the destination listener, route or filtering. Checking the intended endpoint is a useful next step. Week 2 develops this method.',
    ),
    domain: 'networking',
  },
  {
    ...q(
      'A Linux service is enabled at boot but currently stopped. Which conclusion is justified?',
      [
        'Enabled means it is serving requests now',
        'Stopped means its files have been deleted',
        'Startup policy and current running state are different facts',
        'The service must have a DNS failure',
      ],
      2,
      'Enabled is a startup policy; active/running is current state. Listener and application health are additional checks. Linux service practice is planned for Weeks 5–6.',
    ),
    domain: 'Linux',
  },
  {
    ...s(
      'A workload can see a storage account but cannot read its data. What would you inspect before granting more access? If unfamiliar, say so.',
      'Identify the principal actually making the request, the permitted data operation and assignment scope, and distinguish network reachability from authorization. Management visibility alone is not data access. This is a diagnostic of prior experience, not a Week 1 grade.',
    ),
    domain: 'identity',
  },
  {
    ...s(
      'Sketch or describe the processes, ports and data needed by a React/Node app you already know. Mark one boundary you cannot yet explain.',
      'A useful baseline separates browser execution, static asset delivery, API listener/runtime, configuration and durable data. Unknowns are useful evidence for allocating future practice; there is no pass mark.',
    ),
    domain: 'architecture',
  },
].map((item) => (item.options ? { ...item, options: [...item.options, 'Not sure yet'] } : item));

const lecture: Section[] = [
  {
    title: 'Start from the application you already know',
    body: 'You know how to write components and endpoints. This week asks a different question: which running components must exist for an endpoint to work, who operates them, and what observation identifies a failed boundary? You do not need another programming introduction. You do need a reliable mental model that separates code, a process, a machine and a service.\n\nUse the supplied Request notebook as the existing workload. It is a ready-to-run React frontend with two small Node services. You will operate the supplied files, not build features. Its architecture deliberately resembles an ordinary application: a browser requests assets from a web process; that web process forwards /api requests to a separate API process; the API keeps a small counter in memory and a dummy sample in a file. There is no database, cloud account, authentication or TLS in this local fixture. Those are deliberate limits, not production recommendations.\n\nIf you have your own React/Node application, label its equivalent components on a second diagram. Do not spend the three-hour lab fixing that application’s dependencies. The controlled fixture is the common basis for the observations and fault exercise. The academy website itself is another application, normally on port 5173; do not confuse it with this lab workload.',
  },
  {
    title: 'Source files, built assets and running processes are different things',
    body: 'A Git repository records instructions and assets; it does not execute them. Building the React frontend produces JavaScript that can be sent as a file. In this workload, the browser downloads that file, executes the client React code and renders DOM elements. The Node web process delivers files and forwards API requests. The Node API process executes server-side request handlers. “React runs on the server” is therefore the wrong explanation for this specific client-rendered workload, even though other React architectures can render on servers.\n\nA process is a running instance of a program with execution state, memory, open handles and an operating-system identity. Two processes can use the same Node executable and still have different PIDs and memory. One machine can host both; one physical failure can stop both. Stopping the web process does not automatically stop a separately supervised API, although our launcher deliberately stops its two child processes together for convenient cleanup.\n\nWhen the API starts, Node loads code and libraries into its execution environment. The OS schedules its threads and mediates files and network access. A listener is an address/port endpoint to which the OS can deliver incoming connections. A repository being present proves neither that a process is running nor that it listens on the address the caller uses. Later Linux service managers will make process startup and supervision more deliberate.',
  },
  {
    title: 'Trace one click across the actual boundaries',
    body: 'In the guided configuration, the browser opens http://127.0.0.1:4170. The Node web process accepts this connection and returns index.html, browser.js and style.css. React then executes in the browser. Clicking Refresh API status causes a new HTTP request to the same web origin, /api/status. The web process acts as a client to a second listener, 127.0.0.1:4100, and forwards the request. The API returns JSON. The web process relays the result, and React displays it.\n\nThere are two server roles and an intermediate client role, even though everything runs on one computer. A connection is addressed using both an interface address and a port. The web and API listeners need different ports in this exercise. An API listening successfully on one port does not help a proxy that targets another. 127.0.0.1 is loopback: each device uses it to refer to itself. Your phone cannot reach your laptop by entering its own 127.0.0.1.\n\nThis URL uses a literal IPv4 address, so no hostname lookup is needed to discover it. DNS discovery is a separate exchange taught in Week 2, not an invisible server through which this HTTP request travels. We use plain HTTP only on loopback. No security claim about encrypted public hosting follows from a successful local request. Also use the exact IPv4 address rather than localhost here: a hostname can resolve to IPv6 while a listener binds only to IPv4.',
    diagram: [
      'Browser process · client-rendered React, fetch /api/status',
      'Node web process · 127.0.0.1:4170 · serves assets and forwards API requests',
      'Node API process · 127.0.0.1:4100 · CPU, memory and handlers',
      'Local data file · dummy persistent sample; no database or backup',
    ],
  },
  {
    title: 'CPU, RAM and storage answer different questions',
    body: 'The CPU executes instructions: parsing a request, comparing a value or serializing JSON. More cores permit concurrent work, but a single application task does not automatically spread across every core. Imagine an ideal single-core workload needing 100 milliseconds of CPU per request: ten such requests per second consume approximately one CPU-second each second before overhead. This is a rough capacity model, not a measurement of the supplied tiny app. Waiting on a remote database can produce slow requests without high CPU use.\n\nRAM is the volatile working area of running processes. The API counter lives in this process’s memory. Restarting that process discards it. The status response reports memoryBytes using Node’s resident set size (RSS): memory resident for the process, including more than just JavaScript objects. It is not the computer’s total installed RAM, and a single large number does not prove a leak. Establish a baseline, relevant time window and behavior before diagnosing memory pressure. Do not stress or exhaust your machine for this lab.\n\nStorage retains bytes beyond the process lifetime. A successful write of the dummy sample to a local file means the next API instance can read it. Disk capacity, access latency, throughput and small-operation rate describe different constraints; a large disk can still be slow for a workload. Our tiny JSON file cannot benchmark a real database or storage service. The browser also has its own memory: leaving an old status response on screen does not prove the API still runs. Refreshing is a new observation.',
  },
  {
    title: 'Persistence, replicas and backups protect different lifetimes',
    body: 'The counter and saved sample provide a controlled experiment. Increment the counter and save a recognizable dummy phrase. Stop and restart the launcher without deleting the data file. A new API instance starts the counter from zero and reads the saved phrase from disk. The observation supports a narrow claim: this file survives that process restart. It does not prove recovery from disk loss, accidental deletion, corruption or machine replacement.\n\nIf you delete the only file, having persisted it earlier is not a recovery mechanism. A second current copy may also receive the same unwanted deletion. A backup or retained historical version must preserve a recoverable state under specified failure conditions, with access and a tested restore procedure. Later storage/reliability weeks will measure recovery time and recovery point. This week, label the local sample honestly as persistent data, not a backup.\n\nFor an application you know, classify each state item: source in version control; a built asset; a transient request/cache/counter; an uploaded file; a database record; a secret; a historical recovery copy. A container image is a distribution artifact, not an automatic home for changing uploads. A file inside an instance can be persistent across a process restart yet disappear when that instance is replaced. Always name the lifetime and failure you actually tested.',
  },
  {
    title: 'The operating system, machine and data center underneath',
    body: 'The operating system schedules CPU work, manages memory, exposes files/devices and delivers bytes to listening processes. It enforces identities and permissions: a service should read the files it needs without gaining permission to rewrite the whole host. A server is a role providing a service to clients, not necessarily a special type of computer. Your laptop plays that role for this exercise; production hosting adds different availability, security, administration and capacity requirements.\n\nA data center supplies power, cooling, racks and connectivity. Two application processes on one machine share its OS and hardware failure boundaries. Two machines sharing one power supply or one required database still have common dependencies. Adding replicas without examining shared dependencies is not a reliability guarantee. A deployment diagram should identify the dependency that remains, not just draw more copies.\n\nA hypervisor exposes virtual hardware to guest operating systems. A VM has its own guest kernel and allocated virtual CPU, RAM and disks, backed by finite physical resources. A container usually isolates application processes while sharing the host Linux kernel; on some desktop platforms a Linux VM supplies that kernel. Containers and VMs are complementary rather than interchangeable. For Week 1, explain the boundary rather than install a cluster. The managed cloud will change who operates each layer, not remove the layer.',
  },
  {
    title: 'Worked investigation: the page opens, but the API does not',
    body: 'Suppose the browser receives a 200 response for the homepage and browser.js, but the status button receives HTTP 502. The API terminal says it is listening on port 4100, and a direct request there returns JSON with an API PID. The web log records a refused connection to port 4101. These are distinct observations.\n\nThe static response proves that the web process served those assets. Direct API success shows that the API listener and that handler work from this machine. The proxy error identifies the target it tried. Together they support a mismatch between the web process’s target and the API listener, rather than proof that the whole computer or all networking failed. A reasonable repair is to align the intended upstream configuration, restart the process that reads it, and retest the original browser operation. Do not merely change a display label or restart every service repeatedly.\n\nVerify both the repaired request and its identity: a fresh /api/status response should report the expected listener and a real running API process. Preserve the before/after output. A 404 is different: it is an HTTP response saying that this responding server did not find the requested resource. A stopped listener can instead cause a connection error. Even a 200 status is scoped evidence; it does not prove every application dependency works. Sunday’s incident uses its own configuration and requires an attempt before feedback. The worked case demonstrates a method, not a command to paste over the fault.',
  },
  {
    title: 'Read the evidence, not just the command',
    body: 'Download the ready-to-run workload from this lesson and extract it to a disposable folder. Run the launcher in one terminal and the client in a second terminal. On Windows use curl.exe to avoid the older PowerShell alias; on Linux/macOS use curl. These examples are read-only requests. The first targets the web process, the second follows its proxy path, the third targets the API directly and the fourth requests a missing static file.\n\nUse -i to include status and headers. A plain curl invocation may exit successfully even for an HTTP error response; inspect the HTTP status rather than equating command exit zero with application success. A PID and memory size vary from run to run; they are not values to memorize. The code’s Node process identifier is useful for matching the application log with Task Manager, Activity Monitor or ps.',
    code: 'node --version\nnode run.mjs guided\n# In a SECOND terminal, from the extracted workload folder:\ncurl.exe -i http://127.0.0.1:4170/\ncurl.exe -i http://127.0.0.1:4170/api/status\ncurl.exe -i http://127.0.0.1:4100/api/status\ncurl.exe -i http://127.0.0.1:4170/missing.html\n# Linux/macOS: replace curl.exe with curl.\n# Return to the launcher terminal and press Ctrl+C to stop both children.',
    language: 'shell',
  },
  {
    title: 'Finish Saturday with a readiness record',
    body: 'Use the 25-minute micro-exercise to check node --version (22 or later), extract the workload, locate its JSON configurations and draw the browser/web/API/file diagram. A successful start is enough; save the full state and fault experiments for Sunday. Record how you will inspect a PID and listening port on your operating system. Windows Task Manager and Get-NetTCPConnection, Linux ps and ss, or macOS Activity Monitor/lsof are reasonable tools; do not spend the block learning every variant.\n\nFor future Linux practice, record whether a supported disposable Ubuntu VM or systemd-capable WSL is already available. Do not spend today installing multiple hypervisors or changing a managed work computer’s settings. If Node or a permission restriction blocks local execution, the Sunday page includes a clearly labeled evidence-only fallback. That fallback supports reasoning, but it does not establish that you ran or repaired the service. Resolve the tool blocker within later allocated contingency/remediation time. No Azure account, Python installation, GitHub workflow or production access is needed.',
  },
];

export const week1LabSections: Section[] = [
  {
    title: 'Preflight: establish a safe, repeatable workspace · 15 minutes',
    body: 'Download the workload ZIP below, extract it into a new disposable folder, and open a terminal there. Confirm Node 22+ with node --version. No npm install is needed: the React client is already built. Use a browser and a second terminal; do not start a cloud deployment. All listeners are fixed to 127.0.0.1, and the app writes only dummy data beneath its data directory.\n\nBefore each part, stop the previous launcher with Ctrl+C and confirm its URLs no longer respond. Keep guided.json unchanged as the control. Save copies of variation.json and incident.json before edits. Use a text editor that saves valid UTF-8 JSON: property names/strings in double quotes, no comments. If a port is busy, identify whether the listener is yours before stopping it; otherwise choose a consistent set of unused high ports and record the deviation.',
  },
  {
    title: 'Part A — Guided request and state experiment · 40 minutes',
    body: 'Start guided mode and open the web URL printed in its terminal. Open browser developer tools → Network, then click Refresh API status. Identify the document, JavaScript and /api/status requests; record status and Content-Type. Request the API both through the web process and directly using the lecture commands. Match the API PID to an OS process tool and the API log; do not assume the launcher PID is the API PID.\n\nIncrement the volatile counter twice. Replace the dummy sample with “week01 persisted sample” and click Save dummy sample; refresh to verify the write. Record the counter and sample. Stop the launcher and show the original endpoints no longer respond. Restart guided mode and refresh again. Compare counter and sample, then explain which lifetime you tested. Request /missing.html while the web process runs and compare its HTTP response with the stopped-listener observation.\n\nExpected shape: the web document returns 200 text/html; /api/status returns 200 application/json; /missing.html returns 404. The proxy and direct API responses identify the same API process. The counter resets after restart and the saved phrase survives. Record actual values rather than copying a model screenshot. A memoryBytes value is bytes of process RSS, not free host RAM.',
    code: 'node run.mjs guided\n# SECOND terminal (use curl on Linux/macOS):\ncurl.exe -i http://127.0.0.1:4170/api/status\ncurl.exe -i http://127.0.0.1:4100/api/status\ncurl.exe -i http://127.0.0.1:4170/missing.html',
    language: 'shell',
  },
  {
    title: 'Part B — Independent configuration variation · 50 minutes',
    body: 'Stop the control run. Requirements: operate the web listener on 4180 and the API on 4200; preserve a correct web-to-API request path; use the separate variation data file. Adapt variation.json from these requirements and your diagram. The meanings of webPort, apiPort, upstreamPort and dataFile are inspectable in the supplied code. No step-by-step edit or completed configuration is supplied here. Do not edit the React components or API handlers.\n\nRun variation mode. Prove the document and the proxied status request work, the status identifies the intended API listener, and a direct API request agrees. Save a distinct dummy phrase, restart, and verify its persistence independently of the reset counter. Check the old guided endpoints after stopping guided mode so you do not accidentally test the wrong instance. Explain why changing only a browser URL or only a label would not move a listener.\n\nSubmit before/after configuration and your own requests/results. If you needed a hint from Part A, record it honestly. This is independent variation of a familiar task, not a claim of complete production networking mastery.',
    code: 'node run.mjs variation\n# Choose your own validation requests from the requirements.\n# Preserve configuration and observed outputs in your evidence packet.',
    language: 'shell',
  },
  {
    title: 'Part C — A deliberately broken request path · 35 minutes',
    body: 'Stop variation mode. Start incident mode without first copying the guided settings into it. Open the web address printed by the launcher. The incident contract is: the existing document and React assets must load; Refresh API status must reach the supplied API; both processes stay on their assigned incident ports; no application feature rewrite, global firewall change or broad binding is allowed. The configuration contains one deliberate connection fault.\n\nBefore changing anything, record the symptom, document/API HTTP statuses, actual API listener/PID evidence, the web log’s attempted target and one hypothesis. Use the least invasive check that could disprove your hypothesis. Read the configuration only after you have captured the initial symptom; reading it is valid investigation, not cheating. Change the smallest relevant setting while preserving the incident’s assigned listener ports and data file. Restart only as required to load configuration and retest the original browser operation plus a direct check.\n\nWrite the root cause, minimal correction, before/after verification and one limitation. Save this investigation in the lab submission. Incident feedback becomes available only after a meaningful written submission. It is self-study feedback, not automatic verification that you executed the repair. Do not replace evidence with “restarted and it worked.”',
    code: 'node run.mjs incident\n# Keep this terminal’s logs. In another terminal, investigate the printed web/API endpoints.\n# Record your hypothesis before editing incident.json.',
    language: 'shell',
  },
  {
    title: 'Part D — Reflection, evidence and cleanup · 20 minutes',
    body: 'One evidence packet serves both submissions. Include: the workload/configuration version; a labeled browser → web → API → file diagram; two actual process identities; the proxy/direct/missing/stopped observations; the counter/sample restart comparison; Part B’s changed configuration and verification; and Part C’s initial symptom, hypothesis, smallest change and retest. Mark any hint, fallback or unexecuted claim. Remove personal paths from a public report and use only dummy data.\n\nAnswer briefly: what would an API-only restart lose; what could a lost disk destroy; which shared failure can stop both Node processes; and what would you inspect before buying a larger VM? Do not turn this into a long application-development essay. Stop the launcher with Ctrl+C and confirm its web/API endpoints refuse a new connection. Keep the small evidence and data directory, or remove only the extracted disposable folder after checking its exact path. There are no Azure charges and no cloud resources to delete.',
  },
  {
    title: 'Troubleshooting the exercise without skipping the investigation',
    body: 'EADDRINUSE means the selected listener could not bind because the address/port is already in use; it does not justify killing every node process. A terminal returning to its prompt means the launcher is no longer running—inspect its first error. A static 404 is an HTTP response, while an upstream 502 means this web process could not complete its forwarded request; determine the particular cause from logs. An old status on screen is cached display state until you refresh.\n\nIf browser.js is missing, you probably copied only source files rather than extracting the complete published ZIP. Use the package linked here. If a saved phrase appears missing, verify the selected configuration/dataFile and that the save request succeeded; do not assume the disk failed. If a corporate machine blocks Node, do not bypass its policy. Record the blocker and use the explicitly labeled evidence-only fallback until a permitted local environment is available.',
  },
  {
    title: 'Evidence-only fallback · reasoning without an execution claim',
    body: 'Use only if local tooling is blocked after the 15-minute preflight/allocated contingency. Supplied observations: guided GET / is 200; proxied GET /api/status and direct API GET are 200 and report API PID 7420/port 4100; /missing.html is 404. Before restart counter=2 and saved text is “week01 persisted sample”; afterward counter=0 and saved text is unchanged. Incident: document=200, API operation=502; API log shows its own assigned listener responding directly; the web log shows ECONNREFUSED at a different target.\n\nClassify these facts, propose the next test and explain the likely boundary, but write “provided evidence, not executed” on the packet. Do not invent PIDs or repaired output as your own. Local execution, independent port variation and live repair remain pending; a written reasoning score can still be recorded separately. No Week 1 mark certifies future Azure L3 competence.',
  },
];
export const incidentFeedback: Section = {
  title: 'Incident feedback — compare with your recorded investigation',
  body: 'In the supplied default incident, the API listens on 4300 while the web process attempts its upstream request on 4301. The web can deliver React assets while failing to reach that target, so static success and the API 502 are compatible. A direct request to the actual API and the web log distinguish this connection mismatch from a missing static file or a database failure.\n\nPreserving assigned listener ports means correcting the upstream target rather than moving the API arbitrarily or replacing the whole configuration with the guided control. Reload configuration, then verify the browser operation, proxied/direct status and actual API listener. A valid answer includes your original observations, smallest change and new successful evidence. If you selected different allowed ports to avoid a collision, assess the same relationship rather than copying these numbers.\n\nNo full score should be awarded just for naming “port mismatch.” Compare your packet against the rubric: evidence before change, a supported cause, a minimal safe correction and an observed retest. If you opened feedback before executing, record that assistance and repeat Part B with a new parameter set during Wednesday remediation.',
};
export const reviewSections: Section[] = [
  {
    title: 'Retrieve before you reread · 15 minutes',
    body: 'Close the Saturday lecture. Draw the four components and two request legs from memory. Label which process runs the React component and which process owns the counter. State what survives an API restart and what the experiment did not prove. Reopen your diagram only after writing your initial answer. If you confused a process with a machine, fix that boundary before taking the quiz.',
  },
  {
    title: 'Fresh evidence investigation · 40 minutes',
    body: 'Use this independent review case after the quiz. A client receives 200 for the React assets at web port 4480. Its API request receives 502. The API status responds directly at 4400 with PID 8162. The web log shows ECONNREFUSED for 4401. Another operator proposes “restart the whole VM and allocate more RAM.”\n\nWithout looking at Sunday’s feedback, write: the strongest supported hypothesis; two observations that distinguish it from an unavailable web process; the smallest configuration relationship to inspect; a safe correction preserving the assigned listeners; and the end-to-end retest. Then verify Part B’s actual configuration/results from your own lab packet. This case checks transfer of the method, not memorization of Sunday’s port numbers. Do not claim the proposed correction was executed if you only reasoned from the transcript.\n\nUse the documentation submission for this response and your diagram/limitations. A model and criterion-specific feedback become available only after that response is recorded. If the practical part was blocked, spend the available time resolving the tooling or honestly record it as pending.',
  },
  {
    title: 'Score evidence and give useful feedback · 25 minutes',
    body: 'Review the lab rubric against actual observations, not intention. The documentation mark evaluates the same short packet’s explanation, diagram and limits; it does not demand another essay. A source/file diagram is incomplete if it omits the running web/API processes and the browser’s execution. A claim of backup is unsupported by a process-restart test. A claimed fix without a new end-to-end request is unverified.\n\nYou may update submissions and scores after correction. Preserve the original error and identify what changed in your understanding. Objective quiz answers are graded automatically; the short response and lab work use explicit self-assessment. The academy does not execute your local commands or use AI to certify arbitrary prose.',
  },
  {
    title: 'Remediation and next-week preparation · 15 minutes',
    body: 'Choose one misconception from the diagnostic, quiz or packet. Rewrite its mechanism and a limitation; repeat one small request/state observation if local tooling is ready. If you used the supplied solution, document the hint and repeat a changed familiar case. Do not add unpaid hours to reach a checkmark. Week 2’s topic is name resolution, TCP/UDP, TLS and HTTP; prepare one question about a failed real request, without searching for another full networking course.',
  },
];
export const reviewFeedback: Section = {
  title: 'Wednesday case feedback',
  body: 'Static success plus a direct successful API response narrows the failure to the forwarded path in this evidence set. The attempted upstream target differs from the API’s observed listener. Inspect that relationship, align the intended target without changing unrelated listeners, then request /api/status through the web again and match the API identity. A larger VM or a global reboot does not address the demonstrated mismatch. This evidence does not prove the app’s authentication, every API route or any production database works.',
};
export const week1LabRubric = [
  {
    name: 'Functional observations',
    points: 40,
    description:
      'A: real request/state/restart evidence (15). B: independently adapted configuration and working path (15). C: repaired incident retest (10). Evidence-only fallback cannot earn these execution points.',
  },
  {
    name: 'Diagnosis and evidence',
    points: 25,
    description:
      'Initial symptom/status/log/listener evidence before edits (10), a falsifiable supported hypothesis (5), and before/after end-to-end verification (10).',
  },
  {
    name: 'Safety and reproducibility',
    points: 20,
    description:
      'Loopback/dummy-data scope and no privileged/global fixes (10); preserved configurations, exact commands, owned-process cleanup and verified stopped endpoints (10).',
  },
  {
    name: 'Explanation and limitations',
    points: 15,
    description:
      'Correct browser/web/API/file diagram (5), volatile versus persistent versus backup distinction (5), and candid assistance/fallback/untested limits (5).',
  },
];
export const week1DocRubric = [
  {
    name: 'Mechanism and diagram',
    points: 40,
    description:
      'Browser execution, two Node process/listener roles, proxy request and file persistence are correctly connected.',
  },
  {
    name: 'Independent case reasoning',
    points: 35,
    description:
      'The Wednesday transcript supports a hypothesis, minimal inspection/correction and specific retest; no unsupported CPU/RAM or global-reboot claim.',
  },
  {
    name: 'Evidence quality and limits',
    points: 25,
    description:
      'A concise linked packet distinguishes observed, supplied and proposed results; states what was not tested and what remains pending.',
  },
];
export const week1: Week = {
  ...baseline[0],
  status: 'ready',
  sections: lecture,
  resources: week1Resources,
  terms: {
    Process: 'A running program instance with memory, identity and open resources.',
    Listener: 'An address/port endpoint accepting connections for a process.',
    Proxy: 'A component making a request to another service on a caller’s behalf.',
    RSS: 'Resident set size: process memory resident in RAM, beyond just JavaScript heap.',
    Persistence: 'Data surviving a specified process or instance lifetime.',
    Backup: 'A recoverable retained copy/state tested against defined loss scenarios.',
    Hypervisor: 'A layer presenting virtual hardware to guest operating systems.',
  },
  misconception:
    'A working React page does not prove the API path works. A saved local file does not establish a backup or recovery from machine loss.',
  summary:
    'Trace the actual request and identify its process, listener and data lifetime. Use status, logs, direct/proxy checks and an explicit retest before claiming a cause. Managed hosting changes who operates infrastructure; it does not remove the underlying boundaries.',
  lab: {
    title: 'Operate and investigate the React/Node workload',
    tools:
      'Node 22+, browser developer tools, text editor and a terminal with curl/curl.exe. The supplied ZIP includes React assets; no npm install, Python, Docker, Azure or API keys.',
    cost: 'Free & local',
    setup: week1LabSections[0].body,
    tasks: [
      'A — Guided request/state experiment (40 min).',
      'B — Independent configuration variation (50 min).',
      'C — Deliberately broken request path (35 min).',
      'D — Reflection, evidence and cleanup (20 min).',
    ],
    expected:
      'A truthful evidence packet showing process/listener relationships, persistence limits, an independent configuration variation and a tested minimal incident repair.',
    validate:
      'Observe document/API statuses and the actual API PID/port through both paths. Compare volatile counter/persisted sample after restart. Preserve initial incident logs and verify the repaired original operation.',
    troubleshooting: week1LabSections[5].body,
    cleanup: week1LabSections[4].body,
    guide: week1LabSections,
  },
  questions: [
    q(
      'The workload’s browser.js was downloaded successfully. Which component executes its client React rendering code?',
      [
        'The Node API handler because all JavaScript belongs to Node',
        'The Node web proxy while it forwards every request',
        'The browser process after it receives the bundle',
        'The local file containing the persisted sample',
      ],
      2,
      'This is a client-rendered React bundle. The browser executes it; Node serves assets/API. Downloading code and executing server handlers are different boundaries.',
    ),
    q(
      'The homepage is 200, the proxied status request is 502, and the direct API status is 200. What is the best next inspection?',
      [
        'Delete and rebuild the React components',
        'Compare the web proxy’s attempted target with the actual API listener',
        'Grant the API administrator access to every file',
        'Treat the successful homepage as proof the user operation works',
      ],
      1,
      'The web’s static path and a direct API path work. Inspect the forwarding relationship and logs before making a broad change. A 502 alone is not a universal diagnosis; the additional evidence matters.',
    ),
    m(
      'You restart only the API without deleting its data directory. Which observations support the expected state model?',
      [
        'The saved dummy sample is still readable',
        'The old counter value must remain because the disk exists',
        'The unchanged frontend asset can still be delivered by the running web process',
        'The stopped API process continues to handle new requests',
      ],
      [0, 2],
      'The sample and built frontend files have lifetimes separate from API memory. The counter belongs to the old process. The launcher may stop both children together, but this question explicitly isolates an API-only restart.',
    ),
    b(
      'Two separate Node processes on one computer can both fail when that computer loses power.',
      true,
      'Process separation is not independent hardware or power resilience. Name the shared failure boundary.',
    ),
    q(
      'One API request is slow while CPU use is low. What conclusion is justified from those facts alone?',
      [
        'More CPU cores are proven to be the correct fix',
        'The API definitely has a memory leak',
        'A larger disk is guaranteed to fix the request',
        'The bottleneck is not established; inspect time, dependencies and relevant resource evidence',
      ],
      3,
      'Low CPU plus latency is compatible with waiting on I/O or a dependency, among other causes. A measurement and request path are needed before resizing.',
    ),
    m(
      'After moving the API listener for Part B, which checks actually validate the intended relationship?',
      [
        'Change only the browser page heading to show the new port',
        'Make a fresh proxied status request and confirm it reaches the intended API',
        'Clear all browser storage as the main proof of a network repair',
        'Check the observed API listener and compare it with the proxy target',
      ],
      [1, 3],
      'The operation and target relationship must agree. A display label is not configuration, and clearing unrelated browser state does not prove the connection path.',
    ),
    b(
      'Successfully saving a sample on the only local disk proves it can be recovered after that disk is lost.',
      false,
      'Persistence beyond a process restart is narrower than recovery from disk loss. A separate retained copy and tested recovery procedure would be needed for that claim.',
    ),
    {
      ...s(
        'A fresh case: web assets at 4580 return 200. Direct API status at 4500 returns PID 9210. The web log shows a refused upstream connection at 4501. Explain the supported cause, smallest correction and verification.',
        'The observations support a mismatch in the web-to-API target: the intended API is available directly on 4500, while forwarding attempts 4501. Inspect and align the upstream setting while preserving assigned listeners; reload the relevant process and retest through the original web path, matching the actual API identity. Do not claim that every dependency or production recovery has been tested.',
      ),
      selfRubric: [
        '0/2: missing/incorrect boundary, or only proposes an unsupported global reboot/resize.',
        '1/2: identifies the likely target/listener mismatch but omits either a minimal scoped correction or end-to-end verification.',
        '2/2: cites the direct/proxy evidence, preserves assigned listeners, aligns the forwarding relationship and specifies a fresh proxied retest plus a limitation.',
      ],
    },
  ],
  assignment:
    'Use the same concise lab evidence packet. Add the Wednesday fresh-case hypothesis, minimal correction, retest and one untested limit; include the labeled known-application diagram. Do not write a second long essay.',
  review:
    'Wednesday 09:00–11:00: 15 min retrieval, 25 min knowledge check, 40 min fresh evidence investigation, 25 min feedback/documentation and 15 min remediation.',
  reviewQuestions: [
    'Where does this React code execute, and which two components act as servers?',
    'What does a static 200 prove, and what does it leave unproven?',
    'Which state survives an API restart, and what would disk loss change?',
  ],
};
