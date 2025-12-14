# DateTime MCP Server

A Model Context Protocol (MCP) server that returns current user's timezone date and time

## Features

- returns current user's timezon date and time

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```
3. Build the server:
```bash
npm run build
```

## Testing and Debugging

### 1. MCP Inspector (Recommended)
The easiest way to test your MCP server interactively:
```bash
npm run inspector
```
This will open a web interface where you can:
- See all available tools
- Test the `datetime` tool
- Inspect requests and responses

### 2. VSCode Debugging
Use the built-in VSCode debugger with the provided launch configurations:
- Press `F5` or go to Run → Start Debugging
- Choose "Debug MCP with Inspector" to debug with the web interface
- Choose "Debug MCP Server" to debug the server directly
- Set breakpoints in your code to step through execution

### 3. Manual Testing
Run the test script:
```bash
node test-server.js
```

### 4. Development Mode
Build automatically on file changes:
```bash
npm run watch
```
In another terminal, run the inspector:
```bash
npm run inspector
```

### Common Issues
- **Exit Code 1**: Make sure to run `npm run build` first
- **Port in use**: Close other inspector instances
- **Module errors**: Verify `"type": "module"` is in package.json

## Configuration

Add the server to your MCP configuration:

For VSCode (Claude Dev Extension):
```json
{
  "mcpServers": {
    "datetime": {
      "command": "node",
      "args": ["/path/to/datetime-mcp/build/index.js"]
    }
  }
}
```

For Claude Desktop:
```json
{
  "mcpServers": {
    "datetime": {
      "command": "node",
      "args": ["/path/to/datetime-mcp/build/index.js"]
    }
  }
}
```

## Usage

The server provides a single tool named `datetime` with no parameters:

Example usage:
```typescript
use_mcp_tool({
  server_name: "datetime",
  tool_name: "datetime",
})
```

Example response:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Fri Dec 13 2025 10:30:45 GMT-0500 (Eastern Standard Time)"
    }
  ]
}
```

## Contributing

Feel free to submit issues and enhancement requests!
