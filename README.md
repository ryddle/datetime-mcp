# DateTime MCP Server

A Model Context Protocol (MCP) server that provides date and time utilities

## Features

- Get current date and time in user's timezone
- Get day of the week for any date
- Calculate difference between two dates

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
- Test the `datetime`, `day_of_week`, and `date_diff` tools
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

The server provides the following tools:

### 1. `datetime`
Get the current date and time in the user's local timezone.

**Parameters:** None

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

### 2. `day_of_week`
Get the day of the week for a given date in English.

**Parameters:**
- `date` (string, required): Date in ISO format (YYYY-MM-DD) or DD/MM/YYYY format

Example usage:
```typescript
use_mcp_tool({
  server_name: "datetime",
  tool_name: "day_of_week",
  arguments: {
    date: "2026-01-05"  // or "5/1/2026"
  }
})
```

Example response:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Monday"
    }
  ]
}
```

### 3. `date_diff`
Calculate the difference between two dates. Returns days, weeks, months, and years.

**Parameters:**
- `start_date` (string, required): Start date in ISO format (YYYY-MM-DD) or DD/MM/YYYY format
- `end_date` (string, optional): End date in ISO format (YYYY-MM-DD) or DD/MM/YYYY format. If omitted, uses current date.

Example usage:
```typescript
use_mcp_tool({
  server_name: "datetime",
  tool_name: "date_diff",
  arguments: {
    start_date: "2025-01-01",
    end_date: "2026-01-01"
  }
})
```

Example response:
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"days\": 365,\n  \"weeks\": 52,\n  \"months\": 12,\n  \"years\": 1,\n  \"start_date\": \"2025-01-01\",\n  \"end_date\": \"2026-01-01\"\n}"
    }
  ]
}
```

## Contributing

Feel free to submit issues and enhancement requests!
