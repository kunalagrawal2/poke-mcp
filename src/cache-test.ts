import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function testCachedPokemonTool() {
  console.log("🧪 Testing Cached Pokémon Tool");
  console.log("================================\n");

  // Create SSE transport to connect to your HTTP server
  const transport = new SSEClientTransport(
    new URL("http://127.0.0.1:3000/sse"),
    {}
  );

  const client = new Client(
    {
      name: "pokemon-cache-test-client",
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

    // Test cases for the cached tool
    const testCases = [
      { name: "charizard", description: "Charizard (first call - should hit network)" },
      { name: "charizard", description: "Charizard (second call - should hit cache)" },
      { name: "6", description: "Pokémon #6 (Charizard by ID - should hit cache)" },
      { name: "pikachu", description: "Pikachu (first call - should hit network)" },
      { name: "pikachu", description: "Pikachu (second call - should hit cache)" },
      { name: "25", description: "Pokémon #25 (Pikachu by ID - should hit cache)" },
      { name: "invalid-pokemon", description: "Invalid Pokémon (should fail)" }
    ];

    console.log("🧪 Running cache test suite...\n");

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`${i + 1}. ${testCase.description}`);
      console.log("─".repeat(60));
      
      const startTime = Date.now();
      
      try {
        const result = await client.callTool({
          name: "pokemon_info_cached",
          arguments: {
            name: testCase.name
          }
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`✅ Success! (${duration}ms)`);
        console.log((result.content as any[])[0].text);
        
        // Check if this looks like a cache hit (very fast) or network call (slower)
        if (duration < 100) {
          console.log("🚀 Likely cache hit!");
        } else {
          console.log("🌐 Likely network call");
        }
        
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.error(`❌ Error (${duration}ms):`, error);
      }
      
      console.log();
      
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("🎉 Cache test completed!");
    console.log("\n💡 Expected behavior:");
    console.log("  - First calls to new Pokémon: Network requests (slower)");
    console.log("  - Subsequent calls: Cache hits (faster)");
    console.log("  - Invalid Pokémon: Should fail with error");
    console.log("  - Cache file 'poke_cache.sqlite' should be created");

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

// Run the test
testCachedPokemonTool().catch(console.error);
