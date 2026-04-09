const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 48;
const BOTTOM_MARGIN = 56;
const DEFAULT_TITLE_SIZE = 20;
const DEFAULT_BODY_SIZE = 11;

const sanitizeText = (value) => {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
};

const wrapText = (text, maxChars) => {
  const source = sanitizeText(text).trim();
  if (!source) return [""];

  const words = source.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    if (word.length > maxChars) {
      let remainder = word;
      while (remainder.length > maxChars) {
        lines.push(remainder.slice(0, maxChars));
        remainder = remainder.slice(maxChars);
      }
      currentLine = remainder;
    } else {
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length ? lines : [""];
};

const estimateMaxChars = (size, indent = 0) => {
  const width = PAGE_WIDTH - MARGIN * 2 - indent;
  return Math.max(24, Math.floor(width / (size * 0.55)));
};

const formatGeneratedAt = (value) => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleString();
};

const createPage = () => ({
  lines: [],
  cursorY: PAGE_HEIGHT - MARGIN
});

const pushWrappedText = (pages, currentPage, content, text, options = {}) => {
  const {
    font = "regular",
    size = DEFAULT_BODY_SIZE,
    indent = 0,
    wrap = true,
    lineHeight = Math.max(13, Math.round(size * 1.35))
  } = options;

  const lines = wrap ? wrapText(text, estimateMaxChars(size, indent)) : [sanitizeText(text)];
  const requiredHeight = lines.length * lineHeight;
  let page = currentPage;

  if (page.cursorY - requiredHeight < BOTTOM_MARGIN) {
    page = startPage(pages, content);
  }

  for (const line of lines) {
    page.lines.push({
      x: MARGIN + indent,
      y: page.cursorY,
      size,
      font,
      text: line
    });
    page.cursorY -= lineHeight;
  }

  return page;
};

const pushSpacing = (page, amount = 8) => {
  page.cursorY = Math.max(BOTTOM_MARGIN, page.cursorY - amount);
};

const startPage = (pages, content) => {
  const page = createPage();
  pages.push(page);

  let currentPage = page;

  currentPage = pushWrappedText(pages, currentPage, content, content.title, {
    font: "bold",
    size: DEFAULT_TITLE_SIZE,
    wrap: false
  });

  if (content.subtitle) {
    currentPage = pushWrappedText(pages, currentPage, content, content.subtitle, {
      size: 11,
      wrap: true
    });
  }

  currentPage = pushWrappedText(
    pages,
    currentPage,
    content,
    `Generated ${formatGeneratedAt(content.generatedAt)}`,
    {
      size: 9,
      wrap: false
    }
  );

  pushSpacing(currentPage, 10);
  return currentPage;
};

const layoutReportPages = (content) => {
  const pages = [];
  let currentPage = startPage(pages, content);

  const pushLine = (text, options = {}) => {
    currentPage = pushWrappedText(pages, currentPage, content, text, options);
  };

  const pushMoreSpace = (amount = 8) => {
    pushSpacing(currentPage, amount);
  };

  if (Array.isArray(content.summary) && content.summary.length > 0) {
    pushLine("Summary", {
      font: "bold",
      size: 14,
      wrap: false
    });

    for (const item of content.summary) {
      pushLine(`${item.label}: ${item.value}`, {
        indent: 10,
        size: 11,
        wrap: true
      });
    }

    pushMoreSpace(6);
  }

  for (const section of content.sections || []) {
    pushLine(section.title, {
      font: "bold",
      size: 14,
      wrap: true
    });

    pushLine("-".repeat(70), {
      size: 9,
      wrap: false
    });

    if (!section.items || section.items.length === 0) {
      pushLine("No records available.", {
        indent: 10,
        size: 11,
        wrap: false
      });
      pushMoreSpace(8);
      continue;
    }

    section.items.forEach((item, index) => {
      pushLine(`${index + 1}. ${item.title}`, {
        font: "bold",
        size: 12,
        wrap: true
      });

      (item.details || []).forEach((detail) => {
        pushLine(detail, {
          indent: 14,
          size: 10,
          wrap: true
        });
      });

      pushMoreSpace(8);
    });
  }

  return pages;
};

const buildPdfObjects = (pages, content) => {
  const objects = [null];
  const addObject = (body) => {
    objects.push(body);
    return objects.length - 1;
  };

  const regularFontIndex = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  );
  const boldFontIndex = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
  );

  const pageObjectIndexes = [];
  const pagesIndex = 2 * pages.length + 3;

  pages.forEach((page) => {
    const stream = page.lines
      .map((line) => {
        const fontRef = line.font === "bold" ? "F2" : "F1";
        return `BT /${fontRef} ${line.size} Tf ${line.x.toFixed(2)} ${line.y.toFixed(
          2
        )} Td (${sanitizeText(line.text)}) Tj ET`;
      })
      .join("\n");

    const contentIndex = addObject(
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    );
    const pageIndex = addObject(
      `<< /Type /Page /Parent ${pagesIndex} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${regularFontIndex} 0 R /F2 ${boldFontIndex} 0 R >> >> /Contents ${contentIndex} 0 R >>`
    );
    pageObjectIndexes.push(pageIndex);
  });

  const pagesObjectIndex = addObject(
    `<< /Type /Pages /Kids [${pageObjectIndexes
      .map((index) => `${index} 0 R`)
      .join(" ")}] /Count ${pages.length} >>`
  );

  const catalogIndex = addObject(`<< /Type /Catalog /Pages ${pagesObjectIndex} 0 R >>`);

  return {
    objects,
    catalogIndex
  };
};

const buildPdfString = (content) => {
  const pages = layoutReportPages(content);
  const { objects, catalogIndex } = buildPdfObjects(pages, content);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root ${catalogIndex} 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return pdf;
};

export const downloadReportPdf = (content, filename = "report.pdf") => {
  const pdfString = buildPdfString({
    title: content.title || "Report",
    subtitle: content.subtitle || "",
    generatedAt: content.generatedAt || new Date(),
    summary: content.summary || [],
    sections: content.sections || []
  });

  const blob = new Blob([pdfString], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};
