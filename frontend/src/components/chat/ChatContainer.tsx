import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";

export function ChatContainer() {
  const { messages, isTyping } = useChatStore();
  const { user } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1 overflow-hidden">
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="mx-auto max-w-3xl space-y-4 p-4 pb-2"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
              <span className="text-2xl text-white font-bold">AI</span>
            </div>
            <h3 className="text-lg font-semibold">
              Welcome{user ? `, ${user.displayName}` : ""}!
            </h3>
            {user?.customerId && (
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{user.customerId}</span>
                {user.age != null && <> — {user.age} Age</>}
              </p>
            )}
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Ask about your policies, file a claim, check billing, or learn about insurance terms.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
