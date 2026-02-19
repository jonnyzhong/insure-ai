import { Download, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReportMetadata } from "@/types";

interface Props {
  metadata: ReportMetadata | null;
  onExportPDF: () => void;
  isExporting: boolean;
}

export function ReportHeader({ metadata, onExportPDF, isExporting }: Props) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
      <div>
        <h2 className="text-lg font-semibold">
          {metadata?.report_title || "Customer Insurance Report"}
        </h2>
        {metadata && (
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {metadata.generation_date}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {metadata.customer_id}
            </span>
          </div>
        )}
      </div>
      <Button
        size="sm"
        className="gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
        onClick={onExportPDF}
        disabled={!metadata || isExporting}
      >
        <Download className="h-4 w-4" />
        {isExporting ? "Exporting..." : "Export PDF"}
      </Button>
    </div>
  );
}
