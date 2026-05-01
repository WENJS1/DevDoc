import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { AgentContext, DocLocation } from "./types";
import { ORCHESTRATOR_PROMPT } from "./prompts";

export class Orchestrator {
  private model: ChatOpenAI;

  constructor(model: ChatOpenAI) {
    this.model = model;
  }

  async analyzeCommit(context: AgentContext): Promise<AgentContext> {
    console.log("[Orchestrator] Analyzing commit intent...");
    
    // In a real implementation, we would extract the intent
    const response = await this.model.invoke([
      new SystemMessage(ORCHESTRATOR_PROMPT),
      new HumanMessage(\`Commit Message: \${context.commit.message}\n\nDiff:\n\${context.commit.diff}\`)
    ]);

    const content = response.content as string;
    
    // Parse the JSON response
    try {
      const parsed = JSON.parse(content);
      if (parsed.needsUpdate && parsed.targetDocs) {
         context.locationsToUpdate = parsed.targetDocs.map((doc: any) => ({
           file: doc.file,
           reason: doc.reason,
           section: "",
           originalContent: ""
         }));
      }
    } catch (e) {
      console.error("[Orchestrator] Failed to parse decision:", e);
    }
    
    return context;
  }
}
