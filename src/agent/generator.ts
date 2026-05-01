import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { AgentContext } from "./types";
import { GENERATOR_PROMPT } from "./prompts";

export class Generator {
  private model: ChatOpenAI;

  constructor(model: ChatOpenAI) {
    this.model = model;
  }

  async generateUpdates(context: AgentContext): Promise<AgentContext> {
    console.log("[Generator] Generating documentation updates...");

    context.generatedUpdates = {};

    for (const loc of context.locationsToUpdate) {
      // Get previous feedback if this is a retry
      const feedback = context.verificationResults[loc.file]?.feedback || "None";
      
      const response = await this.model.invoke([
         new SystemMessage(GENERATOR_PROMPT),
         new HumanMessage(\`
           File: \${loc.file}
           Goal: \${loc.reason}
           Original Content: \${loc.originalContent}
           Code Diff: \${context.commit.diff}
           Previous Verification Feedback: \${feedback}
         \`)
      ]);

      context.generatedUpdates[loc.file] = response.content as string;
    }

    return context;
  }
}
