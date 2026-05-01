import { ChatOpenAI } from "@langchain/openai";
import { Orchestrator } from "./orchestrator";
import { Locator } from "./locator";
import { Generator } from "./generator";
import { Verifier } from "./verifier";
import { AgentContext } from "./types";
import * as fs from "fs";

export async function runPipeline(commitHash: string, message: string, diff: string) {
  // Configured to use a cheaper model for normal generation context
  const model = new ChatOpenAI({ 
    modelName: "gpt-4o-mini",
    temperature: 0.1 // Keep it deterministic for doc generation
  });

  const orchestrator = new Orchestrator(model);
  const locator = new Locator(model);
  const generator = new Generator(model);
  const verifier = new Verifier(model);

  let context: AgentContext = {
    commit: { commitHash, message, diff, filesChanged: [] },
    locationsToUpdate: [],
    generatedUpdates: {},
    verificationResults: {},
    attempts: 0
  };

  const MAX_RETRIES = 3;

  try {
    context = await orchestrator.analyzeCommit(context);
    
    if (context.locationsToUpdate.length === 0) {
      console.log("No documentation updates required.");
      return context;
    }

    context = await locator.locateSections(context);

    let allVerified = false;

    while (!allVerified && context.attempts < MAX_RETRIES) {
      context.attempts++;
      console.log(\`--- Attempt \${context.attempts} ---\`);
      
      context = await generator.generateUpdates(context);
      context = await verifier.verify(context);

      allVerified = Object.values(context.verificationResults).every(v => v.passed);
      
      if (!allVerified) {
        console.log("Verification failed, iterating...");
      }
    }

    if (allVerified) {
      console.log("✅ Documentation successfully updated and verified!");
      // In a real run, we would map the generated strings back into the files
      for (const [file, content] of Object.entries(context.generatedUpdates)) {
        console.log(\`📝 Would write to \${file}:\n\${content}\`);
      }
    } else {
      console.log("❌ Failed to generate verified documentation within max retries.");
    }
    
    // Save state for debug
    fs.writeFileSync('.devdoc/context.json', JSON.stringify(context, null, 2));

  } catch (error) {
    console.error("Pipeline crashed:", error);
  }

  return context;
}
