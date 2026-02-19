import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageSquare, Bot, Shield } from "lucide-react";

function ChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl dark:shadow-indigo-500/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
        <div className="h-3 w-3 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium">Insurance Assistant</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-br-md bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-xs text-white">
            What is my policy coverage?
          </div>
        </div>
        <div className="flex gap-2">
          <Bot className="mt-1 h-4 w-4 shrink-0 text-indigo-500" />
          <div>
            <Badge variant="secondary" className="mb-1 text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              Policy Agent
            </Badge>
            <div className="rounded-2xl rounded-bl-md border border-border bg-muted/50 px-3 py-2 text-xs">
              You have a Comprehensive Motor policy (POL000042) with $150,000 liability limit.
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-br-md bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-xs text-white">
            What is NCD?
          </div>
        </div>
        <div className="flex gap-2">
          <Bot className="mt-1 h-4 w-4 shrink-0 text-purple-500" />
          <div>
            <Badge variant="secondary" className="mb-1 text-[10px] px-1.5 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              FAQ Agent
            </Badge>
            <div className="rounded-2xl rounded-bl-md border border-border bg-muted/50 px-3 py-2 text-xs">
              No Claim Discount (NCD) rewards claim-free years — up to 50% off for private cars in Singapore!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(99,102,241,0.08),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              <Shield className="h-3 w-3" />
              AI-Powered Insurance Assistant
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Meet Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                AI Insurance
              </span>{" "}
              Expert
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Ask questions, file claims, check billing — your personal insurance
              assistant understands Singapore coverage inside and out.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25"
              >
                <Link to="/login">
                  Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#features">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Learn More
                </a>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <ChatMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
