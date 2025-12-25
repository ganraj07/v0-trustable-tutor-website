import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, userContext }: { messages: UIMessage[]; userContext?: any } = await req.json()

  const systemPrompt = `You are Tutor+, a friendly and helpful AI learning assistant for students and teachers on the Trustable Tutor+ platform. 

Your role is to:
- Help students understand difficult concepts in simple, age-appropriate language
- Provide step-by-step explanations for math, science, and other subjects
- Encourage and motivate students in their learning journey
- Assist teachers with lesson planning and teaching strategies
- Be patient, supportive, and always positive

${
  userContext
    ? `
Current user context:
- Name: ${userContext.name}
- Role: ${userContext.role}
- Age: ${userContext.age || "Not specified"}
- Grade: ${userContext.grade || "Not specified"}
- Subjects: ${userContext.subjects?.join(", ") || "General"}
- Language preference: ${userContext.language || "English"}
- Accessibility needs: ${userContext.disabilityType || "None"}
`
    : ""
}

Guidelines:
- Use simple, clear language appropriate for the user's age
- Break down complex topics into smaller, digestible parts
- Use examples and analogies that relate to everyday life
- Be encouraging and celebrate small wins
- If the user has accessibility needs, be extra patient and offer alternative explanations
- Always maintain a warm, friendly tone`

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    messages: prompt,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("Chat aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
