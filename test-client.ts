import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function testPokemonMCPServer() {
  console.log("🔍 Testing Pokémon MCP Server...\n");

  // Create SSE transport to connect to your HTTP server
  const transport = new SSEClientTransport(
    new URL("http://127.0.0.1:3000/sse"),
    {}
  );

  const client = new Client(
    {
      name: "pokemon-test-client",
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
    console.log("🛠️  Listing available tools...");
    const tools = await client.listTools();
    console.log(`Found ${tools.tools.length} tools:`);
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    // Test 1: Get a random Pokémon
    console.log("🎲 Testing random-pokemon tool...");
    try {
      const randomPokemon = await client.callTool({
        name: "random-pokemon",
        arguments: {}
      });
      console.log("✅ Random Pokémon result:");
      console.log(randomPokemon.content[0].text);
      console.log();
    } catch (error) {
      console.error("❌ Error getting random Pokémon:", error);
    }

    // Test 2: Get a random Pokémon from Kanto region
    console.log("🏔️  Testing random-pokemon-from-region tool (Kanto)...");
    try {
      const kantoPokemon = await client.callTool({
        name: "random-pokemon-from-region",
        arguments: {
          region: "kanto"
        }
      });
      console.log("✅ Kanto Pokémon result:");
      console.log(kantoPokemon.content[0].text);
      console.log();
    } catch (error) {
      console.error("❌ Error getting Kanto Pokémon:", error);
    }

    // Test 3: Get a random Fire type Pokémon
    console.log("🔥 Testing random-pokemon-by-type tool (Fire)...");
    try {
      const firePokemon = await client.callTool({
        name: "random-pokemon-by-type",
        arguments: {
          type: "fire"
        }
      });
      console.log("✅ Fire Pokémon result:");
      console.log(firePokemon.content[0].text);
      console.log();
    } catch (error) {
      console.error("❌ Error getting Fire Pokémon:", error);
    }

    // Test 4: Test natural language query tool
    console.log("💬 Testing pokemon-query tool with natural language...");
    const queries = [
      "Give me a random Pokémon",
      "What is pokemon #25?",
      "Give me a random Pokémon from Johto",
      "Give me a random Water Pokémon"
    ];

    for (const query of queries) {
      console.log(`🔍 Query: "${query}"`);
      try {
        const result = await client.callTool({
          name: "pokemon-query",
          arguments: {
            query: query
          }
        });
        console.log("✅ Query result:");
        console.log(result.content[0].text);
        console.log();
      } catch (error) {
        console.error("❌ Error with query:", error);
      }
    }

    // Test 5: Test error handling with invalid region
    console.log("⚠️  Testing error handling with invalid region...");
    try {
      const invalidRegion = await client.callTool({
        name: "random-pokemon-from-region",
        arguments: {
          region: "invalid-region"
        }
      });
      console.log("✅ Error handling result:");
      console.log(invalidRegion.content[0].text);
      console.log();
    } catch (error) {
      console.error("❌ Error with invalid region:", error);
    }

    // Test 6: Test error handling with invalid type
    console.log("⚠️  Testing error handling with invalid type...");
    try {
      const invalidType = await client.callTool({
        name: "random-pokemon-by-type",
        arguments: {
          type: "invalid-type"
        }
      });
      console.log("✅ Error handling result:");
      console.log(invalidType.content[0].text);
      console.log();
    } catch (error) {
      console.error("❌ Error with invalid type:", error);
    }

    console.log("🎉 All tests completed!");

  } catch (error) {
    console.error("❌ Connection error:", error);
  } finally {
    // Clean up
    try {
      await client.close();
      console.log("🔌 Client disconnected");
    } catch (error) {
      console.error("Error closing client:", error);
    }
  }
}

// Run the test
testPokemonMCPServer().catch(console.error);
