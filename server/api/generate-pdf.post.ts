import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  let browser = null; // Declare browser outside try block to ensure it's accessible in finally
  try {
    const body = await readBody(event);
    const {
      html,
      fileName,
      fontSizeMultiplier = 11,
      gapMultiplier = 14,
    } = body;

    if (!html) {
      throw createError({
        statusCode: 400,
        statusMessage: "HTML content is required",
      });
    }

    // Calculate CSS variable values based on multipliers
    const fontRatio = fontSizeMultiplier / 11;
    const gapRatio = gapMultiplier / 14;

    const cssStyles = `
      :root {
        --base-font-size: ${fontSizeMultiplier}pt;
        --line-height: 1.5;
        --section-margin: ${(18 * gapRatio).toFixed(0)}px;
        --item-margin: ${gapMultiplier}px;
        --header-margin: ${(20 * gapRatio).toFixed(0)}px;
        --name-font-size: ${(20 * fontRatio).toFixed(2)}pt;
        --section-title-font-size: ${(12 * fontRatio).toFixed(2)}pt;
        --item-title-font-size: ${(11.5 * fontRatio).toFixed(2)}pt;
        --contact-info-font-size: ${(10 * fontRatio).toFixed(2)}pt;
        --item-sub-font-size: ${(10.5 * fontRatio).toFixed(2)}pt;
        --item-tech-font-size: ${(10.5 * fontRatio).toFixed(2)}pt;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        color: #000000;
      }
      .ats-cv-preview {
        padding: 0.75in;
        font-size: var(--base-font-size);
        line-height: var(--line-height);
        word-break: break-word;
      }
      .cv-header { margin-bottom: 16px; }
      .name {
        font-size: var(--name-font-size);
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        margin-bottom: 4px;
        margin-top: 0;
        letter-spacing: 1px;
      }
      .contact-info {
        text-align: center;
        font-size: var(--contact-info-font-size);
        margin-bottom: var(--header-margin);
      }
      .cv-section {
        margin-bottom: var(--section-margin);
      }
      .section-title {
        font-size: var(--section-title-font-size);
        font-weight: bold;
        text-transform: uppercase;
        border-bottom: 1px solid #000;
        margin-bottom: 10px;
        padding-bottom: 4px;
        margin-top: 0;
      }
      .section-content {
        margin-left: 0;
      }
      .section-content p {
        margin-top: 0;
        text-align: justify;
      }
      .item {
        margin-bottom: var(--item-margin);
      }
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-weight: bold;
      }
      .item-title {
        font-size: var(--item-title-font-size);
      }
      .item-tech {
        font-weight: normal;
        font-style: italic;
        font-size: var(--item-tech-font-size);
      }
      .item-sub {
        font-style: italic;
        margin-bottom: 4px;
        font-size: var(--item-sub-font-size);
      }
      .desc-list {
        margin: 0;
        padding-left: 1.5em;
        list-style-type: disc;
      }
      .desc-list li {
        margin-bottom: 3px;
        text-align: justify;
      }
      .skills-text {
        margin: 0;
        line-height: 1.6;
      }
      .cv-link {
        color: inherit;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .external-link-icon {
        font-size: 0.8em;
        opacity: 0.7;
        vertical-align: super;
      }
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${cssStyles}</style>
      </head>
      <body>
        <div id="cv-container" class="ats-cv-preview">
          ${html}
        </div>
        <script>
          function autoShrink() {
            const container = document.getElementById('cv-container');
            const A4_HEIGHT_PX = 1056; // A4 height at 96 DPI (8.27in * 96dpi)
            
            // Check if content exceeds page height
            if (container.offsetHeight <= A4_HEIGHT_PX) {
              // Content fits, no need to shrink
              return;
            }
            
            // Only scale down if content overflows
            let scale = 1.0;
            const MIN_SCALE = 0.7;
            
            // Initial values (use multipliers)
            let baseFontSize = ${fontSizeMultiplier};
            let lineHeightMultiplier = 1.5;
            let sectionMarginPx = ${(18 * gapRatio).toFixed(0)};
            let itemMarginPx = ${gapMultiplier};
            let headerMarginPx = ${(20 * gapRatio).toFixed(0)};
            let nameFontSizePx = ${(20 * fontRatio).toFixed(2)};
            let sectionTitleFontSizePx = ${(12 * fontRatio).toFixed(2)};
            let itemTitleFontSizePx = ${(11.5 * fontRatio).toFixed(2)};
            let contactInfoFontSizePx = ${(10 * fontRatio).toFixed(2)};
            let itemSubFontSizePx = ${(10.5 * fontRatio).toFixed(2)};
            let itemTechFontSizePx = ${(10.5 * fontRatio).toFixed(2)};

            // Reduce values incrementally if content overflows
            while (container.offsetHeight > A4_HEIGHT_PX && scale > MIN_SCALE) {
              scale -= 0.01; // Reduce scale by 1% each iteration

              // Apply scaling to all font sizes and margins
              document.documentElement.style.setProperty('--base-font-size', (baseFontSize * scale).toFixed(2) + 'pt');
              document.documentElement.style.setProperty('--line-height', (lineHeightMultiplier * scale).toFixed(2));
              document.documentElement.style.setProperty('--section-margin', Math.max(8, (sectionMarginPx * scale)).toFixed(0) + 'px');
              document.documentElement.style.setProperty('--item-margin', Math.max(6, (itemMarginPx * scale)).toFixed(0) + 'px');
              document.documentElement.style.setProperty('--header-margin', Math.max(10, (headerMarginPx * scale)).toFixed(0) + 'px');
              document.documentElement.style.setProperty('--name-font-size', (nameFontSizePx * scale).toFixed(2) + 'pt');
              document.documentElement.style.setProperty('--section-title-font-size', (sectionTitleFontSizePx * scale).toFixed(2) + 'pt');
              document.documentElement.style.setProperty('--item-title-font-size', (itemTitleFontSizePx * scale).toFixed(2) + 'pt');
              document.documentElement.style.setProperty('--contact-info-font-size', (contactInfoFontSizePx * scale).toFixed(2) + 'pt');
              document.documentElement.style.setProperty('--item-sub-font-size', (itemSubFontSizePx * scale).toFixed(2) + 'pt');
              document.documentElement.style.setProperty('--item-tech-font-size', (itemTechFontSizePx * scale).toFixed(2) + 'pt');
            }
          }
          // Wait a tiny bit for any layout calculations
          window.onload = () => {
            // Give a moment for the DOM to fully render before shrinking
            setTimeout(autoShrink, 100); 
          };
        </script>
      </body>
      </html>
    `;

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 60000, // Increased timeout to 60 seconds
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    // Create public directory if it doesn't exist for saving PDFs locally
    const publicDir = path.join(process.cwd(), "public", "pdf");
    await fs.mkdir(publicDir, { recursive: true });

    const safeFileName = fileName ? `${fileName}.pdf` : `CV_${Date.now()}.pdf`;
    const pdfPath = path.join(publicDir, safeFileName);

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    });

    return {
      success: true,
      url: `/pdf/${safeFileName}`,
      fileName: safeFileName,
    };
  } catch (error) {
    console.error("PDF generation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate PDF",
    });
  } finally {
    if (browser) {
      await browser.close(); // Ensure browser is closed even if an error occurs
    }
  }
});
