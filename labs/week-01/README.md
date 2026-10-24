# Week 1 ready-to-run React/Node workload

This is Request notebook, the app used in Week 1. It is already written. Your job is to run it, explain its parts and investigate a broken request. You do not need to build new features. Use the academy lesson for the full steps and submission requirements.

Requires Node 22+ and a browser. The downloadable ZIP includes the prebuilt React client and licenses. No npm install, Docker, Python, Azure account, API key or paid service is required to run it. Repository maintainers regenerate the bundle/ZIP with `npm run build` at the academy root.

1. Extract the ZIP into a new folder. Keep its files together.
2. Find `run.mjs` in that folder. Open **Terminal A** there (on Windows, File Explorer's Open in Terminal option is useful).
3. Type `node --version`. `--version` asks Node to print its version. Expect `v22...` or a newer major version. If the command is missing or blocked, record the problem and follow the lesson's supplied-evidence option.
4. Type the launcher command below. `guided` tells it to read `guided.json`. It starts a web process and a separate API process. A process is a running copy of a program.

```sh
node --version
node run.mjs guided
```

5. Leave Terminal A running. Expect two Listening messages, for web port 4170 and API port 4100. If you see “Cannot find module,” check that your terminal's folder contains `run.mjs`. `EADDRINUSE` means a selected address/port is already occupied; do not stop unrelated programs.
6. Open `http://127.0.0.1:4170` in your browser. Expect the Request notebook page. `127.0.0.1` is loopback: this computer itself. The app accepts connections only from this computer.
7. Open **Terminal B** for the lesson's request commands. Keep Terminal A for the app. Use `curl.exe` on Windows or `curl` on Linux/macOS. The academy website is a separate app, normally on port 5173 when run locally.

The web process sends the already-built React files and forwards `/api/*` requests to the API. This forwarding is called proxying. The API keeps its counter in temporary memory and saves one dummy text sample in a file under `data/`. After stopping and starting again, the counter resets but the saved sample remains. This demonstrates process-restart persistence, not backup or recovery from disk loss. There is no database, login protection or HTTPS encryption here; do not use this toy app as a public deployment template.

`variation.json` holds settings for your independent task. `incident.json` holds the deliberately broken settings. Run the corresponding mode with `node run.mjs variation` or `node run.mjs incident` in Terminal A, from this same folder, after stopping the previous mode. Follow the lesson's goals and constraints; these commands start the mode without solving it. Keep the initial logs and a copy of the starting settings. Record your investigation before editing. The repair is not included here.

If a port is occupied, stop only a process you own or choose unused high ports in the selected configuration. The frontend and API ports must differ; proxy configuration and listeners must be evaluated from evidence. Do not expose this lab on a public interface or use real personal data/secrets.

Cleanup: press Ctrl+C in Terminal A. Retry the selected web and direct API status URLs from Terminal B. Both should fail to connect. If either answers, identify that listener before saying the lab is stopped. Keep your report and dummy files, or delete only this extracted lab folder through the file manager after checking its exact path. Do not delete the academy repository or change the computer's firewall. No Azure resources were created.
