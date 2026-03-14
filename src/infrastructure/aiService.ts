import Anthropic from "@anthropic-ai/sdk";

export async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log("[aiService] ANTHROPIC_API_KEY present:", !!apiKey);

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY no está definida en las variables de entorno.");
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  for (const block of message.content) {
    if (block.type === "text") return block.text;
  }

  throw new Error("No text block in response");
}
