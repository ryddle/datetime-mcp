#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class DateTimeServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'datetime-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private parseDate(dateStr: string): Date {
    let date: Date;
    if (dateStr.includes('-')) {
      // ISO format
      date = new Date(dateStr);
    } else if (dateStr.includes('/')) {
      // DD/MM/YYYY format
      const parts = dateStr.split('/');
      if (parts.length !== 3) {
        throw new Error('Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY');
      }
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    } else {
      throw new Error('Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY');
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    return date;
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'datetime',
          description: 'Get the current date and time in the user\'s local timezone.',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'day_of_week',
          description: 'Get the day of the week for a given date. Returns the day name in English (e.g., Monday, Tuesday, etc.).',
          inputSchema: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                description: 'Date in ISO format (YYYY-MM-DD) or DD/MM/YYYY format. Examples: "2026-01-05" or "5/1/2026"',
              },
            },
            required: ['date'],
          },
        },
        {
          name: 'date_diff',
          description: 'Calculate the difference between two dates. Returns the difference in days, weeks, months, and years.',
          inputSchema: {
            type: 'object',
            properties: {
              start_date: {
                type: 'string',
                description: 'Start date in ISO format (YYYY-MM-DD) or DD/MM/YYYY format',
              },
              end_date: {
                type: 'string',
                description: 'End date in ISO format (YYYY-MM-DD) or DD/MM/YYYY format. If omitted, uses current date.',
              },
            },
            required: ['start_date'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'datetime') {
        try {
          const result = new Date().toString();
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error getting date and time: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      }

      if (request.params.name === 'day_of_week') {
        try {
          const dateStr = request.params.arguments?.date as string;
          if (!dateStr) {
            throw new Error('Date parameter is required');
          }

          const date = this.parseDate(dateStr);

          // Get day of week in English
          const daysInEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayOfWeek = daysInEnglish[date.getDay()];

          return {
            content: [
              {
                type: 'text',
                text: dayOfWeek,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error getting day of week: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      }

      if (request.params.name === 'date_diff') {
        try {
          const startDateStr = request.params.arguments?.start_date as string;
          const endDateStr = request.params.arguments?.end_date as string;

          if (!startDateStr) {
            throw new Error('start_date parameter is required');
          }

          const startDate = this.parseDate(startDateStr);
          const endDate = endDateStr ? this.parseDate(endDateStr) : new Date();

          // Calculate difference in milliseconds
          const diffMs = endDate.getTime() - startDate.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diffWeeks = Math.floor(diffDays / 7);
          const diffMonths = Math.floor(diffDays / 30.44); // Average days per month
          const diffYears = Math.floor(diffDays / 365.25); // Account for leap years

          const result = {
            days: diffDays,
            weeks: diffWeeks,
            months: diffMonths,
            years: diffYears,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error calculating date difference: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      }

      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('DateTime MCP server running on stdio');
  }
}

const server = new DateTimeServer();
server.run().catch(console.error);
