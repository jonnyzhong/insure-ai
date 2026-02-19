import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";

interface Props {
  user: User;
}

export function UserPreviewCard({ user }: Props) {
  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4"
    >
      <Avatar className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-violet-500">
        <AvatarFallback className="bg-transparent text-white font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="font-semibold truncate">{user.displayName}</p>
        <p className="text-sm text-muted-foreground truncate">{user.customerId} — {user.age} Age</p>
      </div>
      <Badge variant="secondary" className="shrink-0">
        {user.policyType}
      </Badge>
    </motion.div>
  );
}
