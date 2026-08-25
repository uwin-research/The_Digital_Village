const SLIDE_PATHS = [
  "/module-2-section-3-slides/1.jpg",
  "/module-2-section-3-slides/2.jpg",
  "/module-2-section-3-slides/3.jpg",
  "/module-2-section-3-slides/4.jpg",
  "/module-2-section-3-slides/5.jpg",
] as const;

/**
 * Opens a hidden iframe and prints Module 2 passcode slides (landscape, one per page).
 */
export function printModule2Section3Slides(): void {
  const printFrame = document.createElement("iframe");
  printFrame.setAttribute("aria-hidden", "true");
  Object.assign(printFrame.style, {
    position: "fixed",
    right: "0",
    bottom: "0",
    width: "0",
    height: "0",
    border: "0",
  });
  document.body.appendChild(printFrame);

  const printWindow = printFrame.contentWindow;
  const printDocument = printWindow?.document;
  if (!printWindow || !printDocument) {
    printFrame.remove();
    return;
  }

  const origin = window.location.origin;
  const slideMarkup = SLIDE_PATHS.map(
    (src, i) => `
        <section class="print-slide">
          <img src="${new URL(src, origin).toString()}" alt="Module 2 Section 3 slide ${i + 1}" />
        </section>
      `
  ).join("");

  printDocument.open();
  printDocument.write(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Section 3 Slides</title>
          <style>
            @page { size: landscape; margin: 0; }
            html, body { margin: 0; padding: 0; background: #ffffff; }
            .print-slide {
              width: 100%; margin: 0; padding: 0; line-height: 0;
              break-inside: avoid; page-break-inside: avoid;
            }
            .print-slide + .print-slide {
              break-before: page; page-break-before: always;
            }
            img { display: block; width: 100%; max-width: none; height: auto; margin: 0; }
          </style>
        </head>
        <body>${slideMarkup}</body>
      </html>`);
  printDocument.close();

  const images = Array.from(printDocument.images);
  const cleanup = () => {
    window.setTimeout(() => printFrame.remove(), 300);
  };

  const startPrint = () => {
    const onAfterPrint = () => {
      printWindow.removeEventListener("afterprint", onAfterPrint);
      cleanup();
    };
    printWindow.addEventListener("afterprint", onAfterPrint);
    printWindow.focus();
    printWindow.print();
    window.setTimeout(cleanup, 2000);
  };

  if (images.length === 0) {
    startPrint();
    return;
  }

  let loaded = 0;
  const onReady = () => {
    loaded += 1;
    if (loaded === images.length) startPrint();
  };

  images.forEach((img) => {
    if (img.complete) {
      onReady();
      return;
    }
    img.addEventListener("load", onReady, { once: true });
    img.addEventListener("error", onReady, { once: true });
  });
}
