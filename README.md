[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/naveenbandarage-poke-mcp-badge.png)](https://mseep.ai/app/naveenbandarage-poke-mcp)

[![smithery badge](https://smithery.ai/badge/@NaveenBandarage/poke-mcp)](https://smithery.ai/server/@NaveenBandarage/poke-mcp)

<a href="https://glama.ai/mcp/servers/@NaveenBandarage/poke-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@NaveenBandarage/poke-mcp/badge" alt="Poke-MCP MCP server" />
</a>

## Overview

Poke-MCP is a Model Context Protocol (MCP) server that provides Pokémon information through a standardized interface. It connects to the [PokeAPI](https://pokeapi.co/) to fetch Pokémon data and exposes it through MCP tools that can be used by any MCP-compatible client, such as Claude Desktop App, Continue, Cline, and others.

**This server now supports HTTP transport using Server-Sent Events (SSE) for real-time communication, making it accessible over HTTP instead of just stdio.**

## Features

- Get information about specific Pokémon by name
- Discover random Pokémon
- Find random Pokémon from specific regions (Kanto, Johto, Hoenn, etc.)
- Get random Pokémon of specific types (Fire, Water, Electric, etc.)
- Natural language query interface for Pokémon information

## How It Works

Poke-MCP is built using the [Model Context Protocol](https://modelcontextprotocol.io/), which enables AI applications to access external tools and data sources in a standardized way. The server:

1. Connects to the PokeAPI to fetch Pokémon data
2. Exposes several tools through the MCP interface
3. Processes requests from MCP clients
4. Returns formatted Pokémon information

### MCP Tools

The server provides the following tools:

- get-pokemon: Get detailed information about a specific Pokémon by name
- random-pokemon: Get information about a random Pokémon
- random-pokemon-from-region: Get a random Pokémon from a specific region
- random-pokemon-by-type: Get a random Pokémon of a specific type
- pokemon-query: Answer natural language queries about Pokémon

### Architecture

The server is built using:

- TypeScript
- MCP TypeScript SDK (@modelcontextprotocol/sdk)
- Zod for input validation
- HTTP transport with Server-Sent Events (SSE) for MCP communication
- Node.js built-in HTTP server

## Installation

### Installing via Smithery

To install Pokémcp for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@NaveenBandarage/poke-mcp):

```bash
npx -y @smithery/cli install @NaveenBandarage/poke-mcp --client claude
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/poke-mcp.git
cd poke-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Running the HTTP Server

To start the server in HTTP mode:

```bash
# Start the server (defaults to port 3000)
npm start

# Or specify a custom port
PORT=8080 npm start
```

The server will be available at:

- **Info endpoint**: `http://127.0.0.1:3000/` - Server information and status
- **SSE endpoint**: `http://127.0.0.1:3000/sse` - Server-Sent Events connection for MCP clients
- **Message endpoint**: `http://127.0.0.1:3000/message` - POST endpoint for sending MCP messages

### With Claude Desktop App (HTTP Transport)

1. Download and install [Claude Desktop App](https://claude.ai/download)
2. Open Claude Desktop settings
3. Go to Developer settings and edit the config file
4. Add the following configuration for HTTP transport:

```json
{
  "mcpServers": {
    "pokedex": {
      "transport": {
        "type": "sse",
        "url": "http://127.0.0.1:3000/sse"
      }
    }
  }
}
```

5. Start the Poke-MCP server: `npm start`
6. Restart Claude Desktop
7. You should now see the Pokémon tools available in Claude

### Legacy Usage (stdio)

For backward compatibility, you can still run the server with stdio transport by reverting to the stdio implementation.

### Example Queries

Once connected to an MCP client, you can ask questions like:

- "Tell me about Pikachu"
- "Give me a random Pokémon"
- "Show me a random Pokémon from Kanto"
- "What's a random Water Pokémon?"

### Project Structure

- src/index.ts: Main server implementation
- src/types.ts: TypeScript type definitions for Pokémon data
- package.json: Project dependencies and scripts
- tsconfig.json: TypeScript configuration

### Adding New Features

To add new tools or enhance existing ones:

1. Define new helper functions to fetch and format data
2. Register new tools using the server.tool() method
3. Implement the tool logic to handle requests and return responses

## License

ISC

## Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing the Pokémon data
- [Model Context Protocol](https://modelcontextprotocol.io/) for the standardized interface

---

This project demonstrates how to build custom MCP servers that can extend AI assistants with domain-specific knowledge and capabilities.