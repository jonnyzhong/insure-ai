import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { AgentBadge } from "./AgentBadge";
import { AgentTracePanel } from "./AgentTracePanel";
import { GuardrailNotice } from "./GuardrailNotice";
import type { Message } from "@/types";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const isGuardrail = message.role === "guardrail";

  if (isGuardrail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[85%] md:max-w-[70%]"
      >
        <GuardrailNotice message={message.content} />
      </motion.div>
    );
  }

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
          <div className="rounded-2xl rounded-br-md bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm text-white shadow-sm">
            {message.content}
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
            <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Assistant message
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 max-w-[85%] md:max-w-[70%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0">
        {message.agentName && (
          <div className="mb-1">
            <AgentBadge agent={message.agentName} />
          </div>
        )}
        <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm shadow-sm">
          <div className="prose prose-sm dark:prose-invert max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
        {message.toolCalls && message.toolCalls.length > 0 && (
          <AgentTracePanel toolCalls={message.toolCalls} agentName={message.agentName} />
        )}
      </div>
    </motion.div>
  );
}
