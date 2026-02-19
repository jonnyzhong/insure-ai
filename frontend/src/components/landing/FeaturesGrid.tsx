import { GitBranch, FileCheck, CreditCard, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: GitBranch,
    title: "Smart Routing",
    description: "Your question reaches the right specialist — policy, claims, billing, or FAQ agent.",
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400",
  },
  {
    icon: FileCheck,
    title: "Instant Claims",
    description: "File and track insurance claims directly within the conversation.",
    color: "text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-400",
  },
  {
    icon: CreditCard,
    title: "Billing Clarity",
    description: "View PayNow, GIRO, and overdue payment status at a glance.",
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    icon: BookOpen,
    title: "Singapore Knowledge",
    description: "NCD, COE, MAS regulations — AI-powered answers to insurance questions.",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-950 dark:text-purple-400",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-3 text-muted-foreground">
            Five specialized AI agents working together to manage your insurance.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="group transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
