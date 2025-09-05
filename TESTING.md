# Testing the Pokémon MCP Server

This document explains how to test your Pokémon MCP server using the lightweight TypeScript client.

## Prerequisites

1. Make sure your Pokémon MCP server is built and running:
   ```bash
   npm run build
   npm start
   ```

2. The server should be accessible at `http://127.0.0.1:3000`

## Available Test Scripts

### 1. Basic Test Client (`npm test` or `npm run test:client`)

Runs a comprehensive test suite that:
- Connects to the MCP server via SSE transport
- Lists all available tools
- Tests each tool with various parameters
- Tests error handling with invalid inputs
- Tests natural language queries

### 2. Interactive Test Client (`npm run test:interactive`)

Runs an enhanced test suite that:
- Tests all tools with multiple examples
- Shows detailed results for each test case
- Provides usage tips and examples
- Demonstrates proper tool usage patterns

## Test Results

The test clients will show:

✅ **Successful operations** with detailed Pokémon information including:
- Pokémon name and number
- Types, height, weight
- Abilities
- Description/flavor text

❌ **Error handling** for invalid inputs like:
- Unknown regions
- Invalid Pokémon types
- Malformed queries

## Available Tools Tested

1. **random-pokemon**: Gets a random Pokémon from the entire Pokédex
2. **random-pokemon-from-region**: Gets a random Pokémon from specific regions:
   - kanto, johto, hoenn, sinnoh, unova, kalos, alola, galar, paldea
3. **random-pokemon-by-type**: Gets a random Pokémon of specific types:
   - fire, water, grass, electric, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy
4. **pokemon-query**: Handles natural language queries:
   - "What is pokemon #X?" for specific Pokémon by number

## Example Usage

```typescript
// Connect to the server
const transport = new SSEClientTransport(
  new URL("http://127.0.0.1:3000/sse"),
  {}
);

const client = new Client({
  name: "test-client",
  version: "1.0.0"
}, {
  capabilities: { tools: {} }
});

await client.connect(transport);

// Get a random Pokémon
const randomPokemon = await client.callTool({
  name: "random-pokemon",
  arguments: {}
});

// Get a random Fire Pokémon
const firePokemon = await client.callTool({
  name: "random-pokemon-by-type",
  arguments: { type: "fire" }
});

// Get specific Pokémon by number
const pikachu = await client.callTool({
  name: "pokemon-query",
  arguments: { query: "What is pokemon #25?" }
});
```

## Troubleshooting

- **Connection errors**: Make sure the server is running on port 3000
- **Tool not found**: Verify the server has started successfully
- **Invalid responses**: Check that the PokeAPI is accessible and responding

## Server Endpoints

- **Info**: `http://127.0.0.1:3000/` - Server status and information
- **SSE**: `http://127.0.0.1:3000/sse` - Server-Sent Events endpoint for MCP clients
- **Message**: `http://127.0.0.1:3000/message` - POST endpoint for MCP messages
