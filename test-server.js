import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testServer() {
  console.log('🚀 Starting test of the MCP server...\n');

  // Start the server as a child process
  const serverProcess = spawn('node', ['./build/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  // Create client transport
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['./build/index.js'],
  });

  const client = new Client(
    {
      name: 'test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    // Connect to the server
    await client.connect(transport);
    console.log('✅ Connected to the server\n');

    // List available tools
    console.log('📋 Listing tools...');
    const toolsResponse = await client.listTools();
    console.log('Available tools:', JSON.stringify(toolsResponse, null, 2));
    console.log();

    // Call the datetime tool
    console.log('🕐 Calling the datetime tool...');
    const result = await client.callTool({
      name: 'datetime',
      arguments: {},
    });
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log();

    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error during the test:', error);
  } finally {
    await client.close();
    serverProcess.kill();
  }
}

testServer().catch(console.error);
