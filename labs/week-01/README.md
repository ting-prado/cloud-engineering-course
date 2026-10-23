# Week 1 ready-to-run React/Node workload

This supplied reference application is the existing workload for the lesson. Do not spend the lab building new application features. If you have your own React/Node app, annotate its equivalent components too; use this workload for the controlled fault and reproducible checks.

Requires Node 22+ and a browser. The downloadable ZIP includes the prebuilt React client and licenses. No npm install, Docker, Python, Azure account, API key or paid service is required to run it. Repository maintainers regenerate the bundle/ZIP with `npm run build` at the academy root.

Extract the ZIP to a new directory, open a terminal in that directory, and run:

```sh
node --version
node run.mjs guided
```

Open `http://127.0.0.1:4170`. Both services bind only to loopback. Use a second terminal for `curl.exe` on Windows, or `curl` on Linux/macOS. The academy itself normally runs on 5173 and is a different application.

The web process serves prebuilt React assets and proxies `/api/*` to the API. The API holds a volatile counter and stores one short dummy sample in `data/`. Stop both processes with Ctrl+C. Restarting resets the counter but leaves the saved sample. There is no database, authentication or TLS in this local fixture: this is not a production deployment template.

`variation.json` is the independent configuration task. `incident.json` is the fault scenario. Follow the lesson requirements and record an investigation before changing a configuration. Do not copy the guided configuration over the incident; preserve the original as evidence. No diagnostic solution is included in this README.

If a port is occupied, stop only a process you own or choose unused high ports in the selected configuration. The frontend and API ports must differ; proxy configuration and listeners must be evaluated from evidence. Do not expose this lab on a public interface or use real personal data/secrets.

Cleanup: Ctrl+C stops both child processes. Verify the chosen loopback URLs no longer respond. Keep your evidence and dummy samples, or delete only this extracted disposable directory through your file manager after verifying the exact path. Do not remove the academy repository or change host firewall settings.
