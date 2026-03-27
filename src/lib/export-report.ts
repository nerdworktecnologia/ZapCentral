export interface ReportColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  format?: (value: unknown) => string;
}

export interface ReportOptions {
  title: string;
  subtitle?: string;
  columns: ReportColumn[];
  rows: Record<string, unknown>[];
  summaryRows?: { label: string; value: string }[];
}

function getCompanyInfo() {
  const logo = localStorage.getItem("company_logo");
  const name = localStorage.getItem("company_name") || "ZapCentral";
  return { logo, name };
}

export function exportReport(options: ReportOptions) {
  const { logo, name } = getCompanyInfo();
  const now = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const logoHtml = logo
    ? `<img src="${logo}" alt="${name}" style="height:48px;object-fit:contain;" />`
    : `<div style="font-size:22px;font-weight:700;color:#4f46e5;">${name}</div>`;

  const headerRow = options.columns
    .map(c => `<th style="padding:10px 12px;text-align:${c.align || "left"};background:#f1f5f9;font-size:12px;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0;">${c.label}</th>`)
    .join("");

  const bodyRows = options.rows.map((row, i) => {
    const cells = options.columns
      .map(c => {
        const raw = row[c.key];
        const val = c.format ? c.format(raw) : (raw ?? "—");
        return `<td style="padding:10px 12px;text-align:${c.align || "left"};font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9;">${val}</td>`;
      })
      .join("");
    const bg = i % 2 === 0 ? "#ffffff" : "#f8fafc";
    return `<tr style="background:${bg};">${cells}</tr>`;
  }).join("");

  const summaryHtml = options.summaryRows?.length
    ? `<div style="margin-top:24px;display:flex;gap:24px;flex-wrap:wrap;">
        ${options.summaryRows.map(s => `
          <div style="padding:12px 20px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
            <div style="font-size:11px;color:#64748b;margin-bottom:4px;">${s.label}</div>
            <div style="font-size:18px;font-weight:700;color:#1e293b;">${s.value}</div>
          </div>`).join("")}
      </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>${options.title} — ${name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #fff; padding: 32px; }
  @media print {
    body { padding: 16px; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #e2e8f0;">
    ${logoHtml}
    <div style="text-align:right;">
      <div style="font-size:11px;color:#94a3b8;">Relatório gerado em</div>
      <div style="font-size:13px;font-weight:500;color:#475569;">${now}</div>
    </div>
  </div>

  <div style="margin-bottom:24px;">
    <h1 style="font-size:20px;font-weight:700;color:#0f172a;">${options.title}</h1>
    ${options.subtitle ? `<p style="font-size:13px;color:#64748b;margin-top:4px;">${options.subtitle}</p>` : ""}
  </div>

  ${summaryHtml}

  <div style="margin-top:24px;overflow:hidden;border-radius:8px;border:1px solid #e2e8f0;">
    <table style="width:100%;border-collapse:collapse;">
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </div>

  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-size:11px;color:#94a3b8;">© ${new Date().getFullYear()} ${name}. Documento gerado automaticamente.</span>
    <button class="no-print" onclick="window.print()" style="padding:8px 20px;background:#4f46e5;color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;">
      Imprimir / Salvar PDF
    </button>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
