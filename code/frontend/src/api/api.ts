import { ConversationRequest } from "./models";


export async function conversationApi(options: ConversationRequest, abortSignal: AbortSignal): Promise<Response> {
    const response = await fetch("/api/conversation/azure_byod", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: options.messages }), signal: abortSignal,
    });
    
    const { id, model, created, object, choices } = await response.json();
    return new Response(JSON.stringify({
        id, model, created, object,
        choices: choices.map(({ message }: { message: any }) => ({
            messages: [{
            content: JSON.stringify(JSON.parse(message.context.messages[0].content)),
            end_turn: false, role: "tool"
            }, {
            content: message.content, end_turn: true, role: "assistant"
            }],
        })),
    }), {
    status: response.status, statusText: response.statusText,
    headers: response.headers,
    });
};

export async function customConversationApi(options: ConversationRequest, abortSignal: AbortSignal): Promise<Response> {
    const response = await fetch("/api/conversation/custom", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages: options.messages,
            conversation_id: options.id
        }),
        signal: abortSignal
    });

    return response;
}
