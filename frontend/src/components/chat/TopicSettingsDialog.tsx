import { useState, useEffect } from "react";
import { Settings, Trash2, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTopicsStore, DEFAULT_TOPICS, type Topic } from "@/stores/topicsStore";

export function TopicSettingsDialog() {
  const { topics, setTopics, resetDefaults } = useTopicsStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Topic[]>([]);

  useEffect(() => {
    if (open) {
      setDraft(topics.map((t) => ({ ...t })));
    }
  }, [open, topics]);

  const updateDraft = (index: number, field: keyof Topic, value: string) => {
    setDraft((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const removeDraft = (index: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const addDraft = () => {
    setDraft((prev) => [...prev, { label: "", prompt: "" }]);
  };

  const handleSave = () => {
    const valid = draft.filter((t) => t.label.trim() && t.prompt.trim());
    setTopics(valid);
    setOpen(false);
  };

  const handleReset = () => {
    resetDefaults();
    setDraft(DEFAULT_TOPICS.map((t) => ({ ...t })));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Edit suggested topics"
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Suggested Topics</DialogTitle>
          <DialogDescription>
            Customize the quick action buttons shown in the sidebar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 py-2">
          {draft.map((topic, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1 space-y-1.5">
                <Input
                  placeholder="Button label"
                  value={topic.label}
                  onChange={(e) => updateDraft(i, "label", e.target.value)}
                />
                <Input
                  placeholder="Prompt to send"
                  value={topic.prompt}
                  onChange={(e) => updateDraft(i, "prompt", e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="mt-1 text-muted-foreground hover:text-destructive"
                onClick={() => removeDraft(i)}
                aria-label={`Remove ${topic.label}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={addDraft}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Topic
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" className="gap-1.5 mr-auto" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
