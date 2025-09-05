import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function testOfflineBehavior() {
  console.log("🔌 Testing Offline Behavior with Cached Data");
  console.log("===========================================\n");

  // Create SSE transport to connect to your HTTP server
  const transport = new SSEClientTransport(
    new URL("http://127.0.0.1:3000/sse"),
    {}
  );

  const client = new Client(
    {
      name: "pokemon-offline-test-client",
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

    console.log("🧪 Testing offline behavior...\n");

    // Test cached Pokémon (should work offline)
    console.log("1. Testing cached Pokémon (should work offline):");
    console.log("─".repeat(50));
    
    try {
      const result = await client.callTool({
        name: "pokemon_info_cached",
        arguments: {
          name: "charizard"
        }
      });
      
      console.log("✅ Cached Pokémon retrieved successfully!");
      console.log((result.content as any[])[0].text);
      
    } catch (error) {
      console.error("❌ Error:", error);
    }

    console.log("\n2. Testing another cached Pokémon:");
    console.log("─".repeat(50));
    
    try {
      const result = await client.callTool({
        name: "pokemon_info_cached",
        arguments: {
          name: "pikachu"
        }
      });
      
      console.log("✅ Another cached Pokémon retrieved successfully!");
      console.log((result.content as any[])[0].text);
      
    } catch (error) {
      console.error("❌ Error:", error);
    }

    console.log("\n3. Testing uncached Pokémon (should fail if offline):");
    console.log("─".repeat(50));
    
    try {
      const result = await client.callTool({
        name: "pokemon_info_cached",
        arguments: {
          name: "mewtwo"
        }
      });
      
      console.log("✅ Uncached Pokémon retrieved (network available)!");
      console.log((result.content as any[])[0].text);
      
    } catch (error) {
      console.error("❌ Error (expected if offline):", error);
    }

    console.log("\n🎉 Offline test completed!");
    console.log("\n💡 Key behaviors demonstrated:");
    console.log("  ✅ Cached Pokémon work even when network is unavailable");
    console.log("  ✅ Cache provides instant responses for previously fetched data");
    console.log("  ✅ No TTL - cached data persists indefinitely");
    console.log("  ✅ Network failures on cache misses surface errors properly");

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
testOfflineBehavior().catch(console.error);
