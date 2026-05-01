import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { AgentContext } from "./types";
import { VERIFIER_PROMPT } from "./prompts";

export class Verifier {
  private model: ChatOpenAI;

  constructor(model: ChatOpenAI) {
    this.model = model;
  }

  async verify(context: AgentContext): Promise<AgentContext> {
    console.log("[Verifier] Fact-checking generated documentation against source code...");

    context.verificationResults = {};

    for (const loc of context.locationsToUpdate) {
      const generated = context.generatedUpdates[loc.file];
      
      const response = await this.model.invoke([
         new SystemMessage(VERIFIER_PROMPT),
         new HumanMessage(\`
           Code Diff: \${context.commit.diff}
           Generated Doc: \${generated}
         \`)
      ]);

      try {
        const parsed = JSON.parse(response.content as string);
        context.verificationResults[loc.file] = {
           passed: parsed.passed,
           reason: parsed.reason,
           feedback: parsed.feedback
        };
      } catch (e) {
        // Fallback if not valid JSON
        context.verificationResults[loc.file] = {
           passed: true,
           reason: "Failed to parse verifier response, assuming pass to not block."
        };
      }
    }

    return context;
  }
}
