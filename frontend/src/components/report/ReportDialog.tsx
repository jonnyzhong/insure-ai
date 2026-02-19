import { useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useReportStore } from "@/stores/reportStore";
import { ReportHeader } from "./ReportHeader";
import { ReportContent } from "./ReportContent";
import { ReportSkeleton } from "./ReportSkeleton";
import { exportToPDF } from "./pdfExport";

export function ReportDialog() {
  const { isOpen, setOpen, report, isLoading, error } = useReportStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const success = await exportToPDF(reportRef.current, report?.report_metadata.report_title);
      if (!success) {
        // Fallback to browser print
        window.print();
      }
    } catch {
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[95vw] h-[95vh] overflow-hidden flex flex-col p-0"
        showCloseButton
      >
        <ReportHeader
          metadata={report?.report_metadata ?? null}
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />

        <ScrollArea className="flex-1 overflow-hidden">
          <div ref={reportRef} className="p-6 report-print-area">
            {isLoading && <ReportSkeleton />}

            {error && (
              <div className="flex flex-col items-center py-16 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-3" />
                <p className="text-sm font-medium">Failed to Generate Report</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </div>
            )}

            {report && !isLoading && <ReportContent report={report} />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
