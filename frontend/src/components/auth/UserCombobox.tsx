import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface Props {
  users: User[];
  selected: User | null;
  onSelect: (user: User) => void;
}

export function UserCombobox({ users, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label htmlFor="user-select" className="mb-2 block text-sm font-medium">
        Select your profile
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="user-select"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select user profile"
            className="w-full justify-between text-left font-normal h-11"
          >
            {selected ? (
              <span className="truncate">
                {selected.displayName} — {selected.customerId}
              </span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search users...
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Type name or email..." />
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {users.map((user) => (
                  <CommandItem
                    key={`${user.customerId}-${user.policyType}`}
                    value={`${user.displayName} ${user.customerId} ${user.policyType}`}
                    onSelect={() => {
                      onSelect(user);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected?.email === user.email && selected?.policyType === user.policyType
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.customerId} — {user.age} Age
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
