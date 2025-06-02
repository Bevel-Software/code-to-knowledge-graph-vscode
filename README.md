<p align="center">
<!--   <img src="media/bevel-large-logo.png" alt="Bevel Software Logo" width="150"/> -->
  <h1 align="center">Bevel LSP Interface (VS Code Extension)</h1> 
</p>

<p align="center">
  <strong>The essential VS Code companion for <a href="https://github.com/YOUR_USERNAME/code-to-knowledge-graph">Code-to-Knowledge-Graph</a>, enabling deep code analysis by exposing LSP capabilities over HTTP.</strong>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg" alt="License"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=bevel-software.code-to-knowledge-graph-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/bevel-software.code-to-knowledge-graph-vscode.svg?color=blue&label=VS%20Marketplace" alt="VS Marketplace Version"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=bevel-software.code-to-knowledge-graph-vscode"><img src="https://img.shields.io/visual-studio-marketplace/i/bevel-software.code-to-knowledge-graph-vscode.svg?color=blue&label=Installs" alt="VS Marketplace Installs"></a>
  <!-- Replace YOUR_USERNAME with the actual GitHub username if the Java library is hosted there -->
  <a href="https://github.com/bevel-software/code-to-knowledge-graph/stargazers"><img src="https://img.shields.io/github/stars/YOUR_USERNAME/code-to-knowledge-graph.svg?style=social&label=Star%20C2KG%20Library" alt="GitHub Stars for Code-to-Knowledge-Graph Library"></a>
</p>

---

The **Bevel LSP Interface** is a VS Code extension that acts as a vital bridge between your integrated development environment and the powerful [Code-to-Knowledge-Graph Java library](https://github.com/YOUR_USERNAME/code-to-knowledge-graph). It starts a local HTTP server, allowing the Code-to-Knowledge-Graph library (or other external tools) to securely query your codebase for symbols, references, definitions, and other structural information by leveraging VS Code's built-in Language Server Protocol capabilities.

This extension is can be used in tandem with the Code-to-Knowledge-Graph library to do the following on your own code:
*   🔍 **Extract deep structural information** from your code.
*   🗣️ **Communicate code insights** to external analysis tools.
*   ⚙️ **Power advanced code understanding** and knowledge graph generation.

Essentially, this extension turns VS Code into a data source for sophisticated code analysis.

## ✨ Key Features

*   **HTTP Interface:** Exposes VS Code's LSP commands over a local HTTP REST API.
*   **Dynamic Port Allocation:** Automatically finds an available port and writes it to `.bevel/do_not_share/port` for discovery by client applications like the Code-to-Knowledge-Graph library.
*   **Robust Command Execution:** Handles various VS Code commands such as:
    *   `vscode.executeReferenceProvider` (Find all references)
    *   `vscode.executeDefinitionProvider` (Go to definition)
    *   `vscode.executeWorkspaceSymbolProvider` (Search symbols in workspace)
    *   `vscode.executeDocumentSymbolProvider` (Get symbols in a document)
*   **Batch Processing:** Supports batching of commands for improved performance when dealing with multiple requests.
*   **Standardized Data Transfer:** Uses clear JSON structures (`src/data/*.ts`) for requests and responses.
*   **Automatic Activation:** Starts automatically when VS Code finishes loading (`onStartupFinished`).
*   **Singleton Server:** Checks if a server instance is already running on the configured port to prevent multiple instances.

## ⚙️ How It Works

1.  **Activation:** When VS Code starts and your project is loaded, this extension activates.
2.  **Server Startup:**
    *   It first checks if a port is specified in the project's `.bevel/do_not_share/port` file.
    *   If a port is found, it pings `http://localhost:<port>/api/isAlive` to see if an instance of this server is already running.
    *   If no server is running (or no port file exists), it starts a new Express.js HTTP server on a dynamically assigned available port.
    *   The chosen port number is then written to `.bevel/do_not_share/port` within your project's workspace. This allows client applications (like the Code-to-Knowledge-Graph Java library) to discover which port to communicate on.
3.  **API Endpoints:** The server listens for incoming HTTP requests on specific endpoints (e.g., `/api/command`).
4.  **Command Execution:**
    *   When a request is received (typically from the Code-to-Knowledge-Graph Java library), the extension translates it into a corresponding `vscode.commands.executeCommand(...)` call.
    *   It leverages VS Code's internal LSP capabilities to fetch the requested code information (e.g., symbol locations, references).
5.  **Response:** The results from VS Code are packaged into a JSON response and sent back to the client.

This extension acts as an intermediary, making VS Code's powerful code intelligence accessible to external processes.

## 📦 Installation

1.  Open **VS Code**.
2.  Go to the **Extensions** view (Ctrl+Shift+X or Cmd+Shift+X).
3.  Search for `Bevel LSP Interface` or `bevel-software.code-to-knowledge-graph-vscode`.
4.  Click **Install**.

The extension will be automatically activated when VS Code starts.

## 🚀 Usage

This extension primarily works in the background. Its main purpose is to serve requests from the [Code-to-Knowledge-Graph Java library](https://github.com/YOUR_USERNAME/code-to-knowledge-graph).

1.  Ensure this extension is installed and enabled in VS Code.
2.  Open the project you want to analyze in VS Code.
3.  When you run the Code-to-Knowledge-Graph Java library (or a similar tool configured to use this extension), it will:
    *   Read the port number from the `.bevel/do_not_share/port` file in your project's root.
    *   Send HTTP requests to this extension at `http://localhost:<port>/api/...`.
4.  The extension will process these requests and return code information.

**Key File:**
*   `.bevel/do_not_share/port`: This file is automatically created/updated by the extension in your project's root directory. It contains the port number the internal HTTP server is listening on. Client applications should read this file to know where to connect.

## 🔧 Configuration

The extension is designed to be zero-config for most use cases. The port for the HTTP server is allocated dynamically.

## 🛠️ For Developers of This Extension

If you want to contribute to or modify the Bevel LSP Interface extension itself:

### Prerequisites

*   [Node.js](https://nodejs.org/) (version specified in `package.json` `engines.node` or newer, e.g., 20.x)
*   NPM (comes with Node.js)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/code-to-knowledge-graph-vscode.git # Or your fork
    cd code-to-knowledge-graph-vscode
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Development Workflow

*   **Watch for changes and auto-recompile:**
    ```bash
    npm run watch
    ```
    This command runs `esbuild` in watch mode to recompile TypeScript files and `tsc` for type-checking in watch mode.
*   **Run in VS Code Debug Mode:**
    *   Open the project in VS Code.
    *   Press `F5` to open a new VS Code window (Extension Development Host) with the extension loaded.
    *   You can set breakpoints in your `.ts` files and debug the extension.
    *   Output from `console.log` in the extension will appear in the Debug Console of the main VS Code window (where you pressed F5).
*   **Linting:**
    ```bash
    npm run lint
    ```
*   **Type Checking:**
    ```bash
    npm run check-types
    ```
*   **Building for Production:**
    ```bash
    npm run package
    # or
    npm run build
    ```
    This creates a production-ready build in the `out/` directory.
*   **Running Tests:**
    Tests use `@vscode/test-cli`.
    ```bash
    npm run pretest # This compiles tests and builds the extension
    # To run tests (after pretest):
    # npx vscode-test # This usually requires configuration in .vscode-test.mjs
    # Alternatively, use the VS Code Testing view if configured.
    ```
    (Test setup is defined in `.vscode-test.mjs` and tests are typically in `out/test/**/*.test.js` after compilation from `src/test/`.)

### Key Project Files & Structure

*   **`package.json`**: Manifest file for the extension. Defines metadata, scripts, dependencies, and activation events.
*   **`esbuild.js`**: Script for bundling the extension using ESBuild.
*   **`src/`**: Contains the TypeScript source code.
    *   **`extension.ts`**: Main activation point of the extension. Initializes and starts the `RestServer`.
    *   **`RestServer.ts`**: Manages the Express.js HTTP server.
    *   **`CommandRoute.ts`**: Defines the API routes (e.g., `/api/command`) and maps them to handlers.
    *   **`ParsingSocket.ts`**: Contains the `executeCommand` function, which is the core logic for interacting with VS Code's internal commands and formatting responses.
    *   **`data/`**: Holds TypeScript classes defining the structure of data exchanged between the extension and clients (e.g., `VsCodeCommand.ts`, `VsCodeLocation.ts`).
    *   **`BatchProcessor.ts`**: Utility to handle multiple asynchronous operations concurrently up to a batch limit.
    *   **`BevelFilesPathResolver.ts`**: Utility class for resolving paths to Bevel-specific files and directories (like the port file).
*   **`out/`**: Compiled JavaScript output directory.
*   **`media/`**: Static assets like icons.
*   **`LICENSE`**: Mozilla Public License 2.0.

### API Endpoints Exposed

The extension exposes the following primary endpoints under the `/api` path:

*   **`GET /api/isAlive`**:
    *   Returns `200 OK` with body `true` if the server is running. Used by the extension itself to check for existing instances.
*   **`POST /api/command`**:
    *   **Body (Single Command):**
        ```json
        {
          "command": "vscode.executeReferenceProvider",
          "args": [
            {
              "filePath": "/path/to/your/file.ext",
              "range": { "startLine": 10, "startCharacter": 5, "endLine": 10, "endCharacter": 15 }
            }
          ]
        }
        ```
    *   **Body (Batch Command):** An array of the single command objects.
        ```json
        [
          { "command": "...", "args": [...] },
          { "command": "...", "args": [...] }
        ]
        ```
    *   **Response:** A JSON object (or an array of results for batch requests) containing the data fetched from VS Code, structured according to the classes in `src/data/`.
*   **`POST /api/showMessage`**:
    *   **Body:**
        ```json
        {
          "message": "Your information message here"
        }
        ```
    *   Displays an information message in VS Code. Returns `200 OK`.

## 📜 License

This project is licensed under the **Mozilla Public License Version 2.0**. See the [LICENSE](./LICENSE) file for full details.

## 🤝 Contributing

Contributions are welcome! Please refer to the development setup above and feel free to open an issue or pull request.

---

This VS Code extension is a crucial component of the Bevel Code-to-Knowledge-Graph ecosystem. We hope it serves you well in your advanced code analysis endeavors!
