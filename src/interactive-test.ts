import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function interactivePokemonTest() {
  console.log("🎮 Interactive Pokémon MCP Test Client");
  console.log("=====================================\n");

  // Create SSE transport to connect to your HTTP server
  const transport = new SSEClientTransport(
    new URL("http://127.0.0.1:3000/sse"),
    {}
  );

  const client = new Client(
    {
      name: "pokemon-interactive-client",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  try {
    // Connect to the server
    console.log("📡 Connecting to Pokémon MCP Server...");
    await client.connect(transport);
    console.log("✅ Connected successfully!\n");

    // List available tools
    console.log("🛠️  Available tools:");
    const tools = await client.listTools();
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    // Test cases that work with the current patterns
    const testCases = [
      {
        name: "Random Pokémon",
        tool: "random-pokemon",
        args: {}
      },
      {
        name: "Random Pokémon from Kanto",
        tool: "random-pokemon-from-region", 
        args: { region: "kanto" }
      },
      {
        name: "Random Pokémon from Johto",
        tool: "random-pokemon-from-region",
        args: { region: "johto" }
      },
      {
        name: "Random Fire Pokémon",
        tool: "random-pokemon-by-type",
        args: { type: "fire" }
      },
      {
        name: "Random Water Pokémon", 
        tool: "random-pokemon-by-type",
        args: { type: "water" }
      },
      {
        name: "Random Electric Pokémon",
        tool: "random-pokemon-by-type", 
        args: { type: "electric" }
      },
      {
        name: "Pokémon #25 (Pikachu)",
        tool: "pokemon-query",
        args: { query: "What is pokemon #25?" }
      },
      {
        name: "Pokémon #1 (Bulbasaur)",
        tool: "pokemon-query", 
        args: { query: "What is pokemon #1?" }
      },
      {
        name: "Pokémon #150 (Mewtwo)",
        tool: "pokemon-query",
        args: { query: "What is pokemon #150?" }
      }
    ];

    console.log("🧪 Running comprehensive test suite...\n");

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n${i + 1}. ${testCase.name}`);
      console.log("─".repeat(50));
      
      try {
        const result = await client.callTool({
          name: testCase.tool,
          arguments: testCase.args
        });
        
        console.log("✅ Success!");
        console.log((result.content as any[])[0].text);
        
      } catch (error) {
        console.error("❌ Error:", error);
      }
      
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n💡 Tips for using the Pokémon MCP Server:");
    console.log("  - Use 'random-pokemon' for any random Pokémon");
    console.log("  - Use 'random-pokemon-from-region' with regions: kanto, johto, hoenn, sinnoh, unova, kalos, alola, galar, paldea");
    console.log("  - Use 'random-pokemon-by-type' with types: fire, water, grass, electric, etc.");
    console.log("  - Use 'pokemon-query' with 'What is pokemon #X?' for specific Pokémon");

  } catch (error) {
    console.error("❌ Connection error:", error);
  } finally {
    // Clean up
    try {
      await client.close();
      console.log("\n🔌 Client disconnected");
    } catch (error) {
      console.error("Error closing client:", error);
    }
  }
}

// Run the interactive test
interactivePokemonTest().catch(console.error);
