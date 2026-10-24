import type { Kind, Question, Resource, Week } from './types';
import { baseline } from './baseline';
import { single as q, multiple as m, bool as b, short as s } from './helpers';
import { lecture, week1LabSections, week1Glossary } from './week-01-teaching';
export {
  week1LabSections,
  incidentFeedback,
  reviewSections,
  reviewFeedback,
  week1Glossary,
} from './week-01-teaching';

export const timetable: Record<Kind, { minutes: number; activity: string }[]> = {
  lecture: [
    { minutes: 20, activity: 'Answer the ungraded starting questions. “Not sure yet” is fine.' },
    { minutes: 55, activity: 'Read the explanations of running programs, the OS, CPU, memory and storage.' },
    { minutes: 35, activity: 'Work through the supplied React/Node request and failure examples.' },
    {
      minutes: 25,
      activity: 'Selected references: MDN 8 min, Node HTTP 10 min, React 7 min; stop at the named sections.',
    },
    { minutes: 25, activity: 'Check the tools, start the app once and draw its main parts.' },
    { minutes: 20, activity: 'Breaks and spare time for setup problems. Take breaks as needed.' },
  ],
  lab: [
    { minutes: 15, activity: 'Download and extract the app. Open two terminals and check Node.' },
    { minutes: 40, activity: 'Part A: follow the steps to test requests, memory and a saved file.' },
    { minutes: 50, activity: 'Part B: change the app settings and choose your own checks.' },
    {
      minutes: 35,
      activity: 'Part C: investigate a broken request. Record what happened before changing it.',
    },
    { minutes: 20, activity: 'Part D: explain your results, save the report and stop the app.' },
    { minutes: 20, activity: 'Breaks/contingency. Defer optional work rather than exceed three hours.' },
  ],
  review: [
    { minutes: 15, activity: 'Draw and explain the request path from memory, then check your notes.' },
    {
      minutes: 25,
      activity: 'Eight-question graded knowledge check; manually assess the short response afterward.',
    },
    { minutes: 40, activity: 'Explain a new written failure case yourself and check your lab results.' },
    { minutes: 25, activity: 'Read feedback, use the scoring guides and submit your explanation.' },
    { minutes: 15, activity: 'Correct one misunderstanding and prepare a question for Week 2.' },
  ],
};
export const week1Resources: Resource[] = [
  {
    title: 'What is a web server?',
    provider: 'MDN Web Docs',
    type: 'Documentation',
    url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server',
    description:
      'Read how a server can mean hardware or software. Static content is sent from a file; dynamic content is produced when a request is handled. Compare these with the lab’s web and API processes.',
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
      'Read the small createServer example. Connect the incoming request, outgoing response and listen call to this week’s explanation. Skip the rest of the API reference.',
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
      'Optional preview of Azure’s physical computers and how Azure groups resources. You do not need to create an account or deploy anything this week.',
    selection: 'Optional preview only; the whole module is not required for Week 1.',
    verified: true,
    reviewedOn: '2026-10-23',
  },
];

export const diagnosticQuestions: Question[] = [
  {
    ...q(
      'In this app, where does the React code that builds the browser page run after its JavaScript downloads?',
      [
        'In the Node API process',
        'Inside the storage file',
        'In the browser process',
        'In the Git repository',
      ],
      2,
      'The browser runs this React code and updates the page. This is called client rendering. Node sends the files and handles API requests. Other React apps can render on servers, but this app uses browser rendering.',
    ),
    domain: 'process boundaries',
  },
  {
    ...m(
      'Before testing: which items would you expect to remain after stopping and restarting only the running API?',
      [
        'A sample successfully written to its local file',
        'The API’s in-memory counter',
        'The same running copy of the API, with its process identity',
        'The frontend files already produced by the build',
      ],
      [0, 3],
      'The saved files remain after this process stops. The counter is held in the old process memory. A restarted API is a new running copy; do not depend on its process ID staying the same. A file surviving a restart is still not a backup.',
    ),
    domain: 'persistence',
  },
  {
    ...q(
      'A name lookup returns an IP address, but the app cannot connect. What would be most useful to check next?',
      [
        'The DNS answer alone proves that the API works',
        'Whether the intended program is waiting for connections at the expected address/port',
        'Whether the repository has a recent commit',
        'Whether the user can open another unrelated website',
      ],
      1,
      'Looking up an address does not prove a program is waiting for connections there. It also does not prove traffic can reach it. Check the intended address and port. Week 2 explains these checks. You are not expected to know them yet.',
    ),
    domain: 'networking',
  },
  {
    ...q(
      'A Linux service is set to start when the computer starts, but it is stopped now. What can you conclude?',
      [
        'Enabled means it is serving requests now',
        'Stopped means its files have been deleted',
        'Being set to start automatically and being running now are different facts',
        'The service must have a DNS failure',
      ],
      2,
      '“Enabled” means set to start automatically. It does not mean running now. Even a running service needs more checks before you know it can handle requests. Weeks 5–6 teach Linux services.',
    ),
    domain: 'Linux',
  },
  {
    ...s(
      'An app can see an Azure storage account but cannot read the data inside it. What would you check before giving it more access? If this is unfamiliar, write “I do not know yet.”',
      'Check who the request acts as, what data action is allowed, and where that permission applies. These are identity, permissions and scope. Also check whether the request can reach storage. Seeing the account does not prove permission to read its data. This checks prior experience, not a Week 1 skill or grade.',
    ),
    domain: 'identity',
  },
  {
    ...s(
      'Draw or describe what must be running for a React/Node app you know to work. Include programs, connection addresses/ports and saved data if you know them. Mark one part you cannot yet explain.',
      'A useful starting diagram separates the browser, the program sending page files, the running API, settings and saved data. Not knowing a part helps us choose practice. There is no pass mark.',
    ),
    domain: 'architecture',
  },
].map((item) => (item.options ? { ...item, options: [...item.options, 'Not sure yet'] } : item));

export const week1LabRubric = [
  {
    name: 'Functional observations',
    points: 40,
    description:
      'A: actual requests and memory/file results before and after restart (15). B: your own changed settings and working request (15). C: a new successful check after repairing the fault (10). Supplied observations cannot earn these execution points.',
  },
  {
    name: 'Diagnosis and evidence',
    points: 25,
    description:
      'Record the symptom, statuses, logs and listeners before editing (10). Give a possible cause supported by evidence and explain how you could test whether it is wrong (5). Show before/after checks through the original full request path (10).',
  },
  {
    name: 'Safety and reproducibility',
    points: 20,
    description:
      'Use only your own computer and dummy data; do not grant broad permissions or change system-wide controls (10). Keep settings and exact commands; stop only your own lab processes and verify their URLs no longer answer (10).',
  },
  {
    name: 'Explanation and limitations',
    points: 15,
    description:
      'Correct browser/web/API/file diagram (5). Explain temporary memory, saved data and backup as different things (5). Clearly state help used, supplied observations and anything untested (5).',
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
      'Use the Wednesday observations to support a possible cause, a small relevant check/change and a specific retest. Do not claim that more CPU/RAM or restarting the whole machine is needed without evidence.',
  },
  {
    name: 'Evidence quality and limits',
    points: 25,
    description:
      'Keep one short report. Distinguish what you observed, what the course supplied and what you only proposed. State what was not tested or is still pending.',
  },
];
export const week1: Week = {
  ...baseline[0],
  status: 'ready',
  objectives: [
    'Follow a React/Node request through the browser, listening programs, processes and saved files.',
    'Explain the difference between temporary memory, saved files and a backup.',
    'Use observations to investigate a process or port mismatch.',
  ],
  sections: lecture,
  resources: week1Resources,
  terms: Object.fromEntries(week1Glossary.map((g) => [g.term, g.definition + ' Example: ' + g.example])),
  misconception:
    'A React page can appear while its API request fails. Saving a local file does not prove you can recover it if the computer or disk is lost.',
  summary:
    'Follow the request and name the running program, address/port and data it needs. Compare responses and logs before choosing a change. Retry the original operation afterward. Cloud hosting changes who manages the computers and software; those parts still exist.',
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
      'A short report showing which programs answer requests, what survives a restart, your own changed settings and a small repair verified by a new request.',
    validate:
      'Record the page/API statuses and actual API PID/port through direct and forwarded requests. Compare counter and sample before/after restart. Keep the initial error logs and repeat the original operation after repairing it.',
    troubleshooting: week1LabSections[5].body,
    cleanup: week1LabSections[4].body,
    guide: week1LabSections,
  },
  questions: [
    q(
      'The app’s browser.js downloaded successfully. Which part runs its React code to build the page?',
      [
        'The Node API handler because all JavaScript belongs to Node',
        'The Node web process while it forwards every request',
        'The browser process after it receives the built JavaScript',
        'The local file containing the persisted sample',
      ],
      2,
      'The browser runs this built React code. Node sends page files and handles API requests. Sending a JavaScript file is different from running it in the browser.',
    ),
    q(
      'The homepage returns 200. API status through the web returns 502, but API status directly returns 200. What is the best next check?',
      [
        'Delete and rebuild the React components',
        'Compare where the web forwards the request with where the API actually listens',
        'Grant the API administrator access to every file',
        'Treat the successful homepage as proof the user operation works',
      ],
      1,
      'The web can send files and the API can answer directly. Check the connection between them and read the logs before making a broad change. A 502 by itself does not tell you its cause; the other observations help.',
    ),
    m(
      'You restart only the API without deleting its data folder. Which results match what we learned about memory and files?',
      [
        'The saved dummy sample is still readable',
        'The old counter value must remain because the disk exists',
        'The web process, which is still running, can still send the unchanged frontend file',
        'The stopped API process continues to handle new requests',
      ],
      [0, 2],
      'The sample file and built frontend files do not depend on the old API’s memory. Its counter does. This question says only the API restarts; in the guided lab, Ctrl+C stops both child processes together.',
    ),
    b(
      'Two separate Node processes on one computer can both fail when that computer loses power.',
      true,
      'Separate processes still share this computer’s hardware and power. One power loss can stop both.',
    ),
    q(
      'An API request is slow while CPU use is low. What can you conclude from only those two facts?',
      [
        'More CPU cores are proven to be the correct fix',
        'The API definitely has a memory leak',
        'A larger disk is guaranteed to fix the request',
        'The cause is not yet known; inspect timing, systems the request depends on and resource measurements',
      ],
      3,
      'A request can wait for a file, network response or another service while using little CPU. These facts do not prove any one cause. Collect measurements along the request path before choosing a larger machine.',
    ),
    m(
      'After changing the API port in Part B, which checks show that the intended request path works?',
      [
        'Change only the browser page heading to show the new port',
        'Send a new status request through the web and confirm it reaches the intended API',
        'Clear all browser storage as the main proof of a network repair',
        'Check where the API actually listens and compare it with the web’s forwarding target',
      ],
      [1, 3],
      'Check the real request and its destination. A label on screen does not move a listener. Clearing unrelated browser data does not prove the web can reach the API.',
    ),
    b(
      'Successfully saving a sample on the only local disk proves it can be recovered after that disk is lost.',
      false,
      'A file surviving a restart does not show it survives losing the disk. You would need a retained copy and a tested way to recover from that loss.',
    ),
    {
      ...s(
        'New case: the web page files at port 4580 return 200. API status directly at 4500 returns PID 9210. The web log says its forwarded connection to 4501 was refused. Explain the likely cause supported by these facts, the smallest correction and how you would check it.',
        'The API answers directly on 4500, but the web tries 4501. Inspect and correct the forwarding target while keeping the assigned listener ports. Restart what is needed to load the change. Request status through the original web URL again and check that it identifies the expected API. These checks do not prove every other service or recovery procedure works.',
      ),
      selfRubric: [
        '0/2: does not identify the right failed connection, or only suggests restarting/resizing the whole machine without evidence.',
        '1/2: identifies the likely destination/listener mismatch, but leaves out a small relevant correction or a check through the full original path.',
        '2/2: uses the direct/forwarded results, keeps assigned listeners, corrects the target relationship, and describes a new request through the web plus one limit of that test.',
      ],
    },
  ],
  assignment:
    'Use the same short lab report and labeled app diagram. Add your possible cause for Wednesday’s new case, the smallest relevant correction, your retest and one thing it would not prove. No second essay is needed.',
  review:
    'Wednesday 09:00–11:00: explain from memory (15 min), quiz (25), investigate a new case (40), score and submit your explanation (25), and correct one misunderstanding (15).',
  reviewQuestions: [
    'Where does this React code execute, and which two components act as servers?',
    'What does a 200 response for a page file prove? What does it not prove?',
    'Which data survives an API restart? What could be lost if the disk failed?',
  ],
};
