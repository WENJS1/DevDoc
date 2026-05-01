import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { SUMMARIZER_PROMPT } from "./prompts";

export class Summarizer {
  private model: ChatOpenAI;

  constructor(model: ChatOpenAI) {
    this.model = model;
  }

  async summarizeCommits(commits: string[]): Promise<string> {
    console.log("[Summarizer] Generating Changelog from accumulated commits...");

    const response = await this.model.invoke([
        new SystemMessage(SUMMARIZER_PROMPT),
        new HumanMessage(\`Commits:\n\${commits.join("\\n")}\`)
    ]);

    return response.content as string;
  }
}
