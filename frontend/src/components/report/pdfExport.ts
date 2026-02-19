import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Temporarily removes overflow clipping from all ancestor elements,
 * captures the full content with html2canvas, then restores everything.
 */
export async function exportToPDF(
  element: HTMLDivElement | null,
  title = "Customer Insurance Report"
): Promise<boolean> {
  if (!element) {
    console.error("[PDF] No element to capture");
    return false;
  }

  // Collect all ancestors and disable overflow clipping
  const overrides: { el: HTMLElement; overflow: string; maxHeight: string; height: string }[] = [];
  let parent: HTMLElement | null = element.parentElement;
  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    if (style.overflow !== "visible" || style.maxHeight !== "none") {
      overrides.push({
        el: parent,
        overflow: parent.style.overflow,
        maxHeight: parent.style.maxHeight,
        height: parent.style.height,
      });
      parent.style.overflow = "visible";
      parent.style.maxHeight = "none";
      parent.style.height = "auto";
    }
    parent = parent.parentElement;
  }

  try {
    // Wait a tick for layout to recalculate
    await new Promise((r) => setTimeout(r, 100));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    if (canvas.width === 0 || canvas.height === 0) {
      console.error("[PDF] Canvas has zero dimensions");
      return false;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    let yOffset = 0;
    let page = 0;

    while (yOffset < imgHeight) {
      if (page > 0) pdf.addPage();

      const sourceY = (yOffset / imgHeight) * canvas.height;
      const sourceHeight = Math.min(
        (usableHeight / imgHeight) * canvas.height,
        canvas.height - sourceY
      );
      const destHeight = (sourceHeight / canvas.height) * imgHeight;

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.ceil(sourceHeight);
      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0, Math.floor(sourceY), canvas.width, Math.ceil(sourceHeight),
          0, 0, canvas.width, Math.ceil(sourceHeight)
        );
        const pageImgData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageImgData, "PNG", margin, margin, usableWidth, destHeight);
      }

      yOffset += usableHeight;
      page++;
    }

    pdf.save(`${title}.pdf`);
    return true;
  } catch (err) {
    console.error("[PDF] Export failed:", err);
    return false;
  } finally {
    // Restore all ancestor overflow styles
    for (const { el, overflow, maxHeight, height } of overrides) {
      el.style.overflow = overflow;
      el.style.maxHeight = maxHeight;
      el.style.height = height;
    }
  }
}
