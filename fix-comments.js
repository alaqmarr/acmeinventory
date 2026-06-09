const fs = require("fs");

const files = [
  "e:\\acmeinventory\\src\\app\\(app)\\product-qr-print\\QRPrintClient.tsx",
  "e:\\acmeinventory\\src\\app\\(app)\\reports\\ReportsClient.tsx",
  "e:\\acmeinventory\\src\\app\\(app)\\sales\\SalesClient.tsx",
  "e:\\acmeinventory\\src\\app\\(app)\\stock-check\\StockCheckClient.tsx",
  "e:\\acmeinventory\\src\\app\\(app)\\stock-inward\\StockInwardClient.tsx",
  "e:\\acmeinventory\\src\\lib\\utils.ts"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, "utf8");

  // Fix Returns
  // Match `// some comment text ... return (` or `return () =>` etc
  // We can just replace `\/\/([^\n]*?)(return\s+.*)` with `\n/* $1 */\n$2`
  // Actually, wait, `[^\n]*?` is lazy. It might match `// text return` and turn it to `/* text */ return`.
  // Is it possible there are multiple returns on the squashed line?
  // Let's just do a naive split on `return ` inside the comment IF it is likely a squashed return.
  // Instead of risking a generic regex, I can run Prettier on them, but Prettier can't fix commented code.
  
  // Specific fixes based on manual inspection:
  
  // QRPrintClient.tsx
  content = content.replace(/\/\/ Generate QR data URLs on the client side using the qrcode library const generateQRDataUrl(.*?)/, "/* Generate QR data URLs on the client side using the qrcode library */\nconst generateQRDataUrl$1");
  content = content.replace(/\/\/ Generate all QR codes on mount useEffect\(/, "/* Generate all QR codes on mount */\nuseEffect(");
  content = content.replace(/\} catch \{ \/\/ Skip failed generations \} \} setQrDataUrls/, "} catch { /* Skip failed generations */ }\n}\nsetQrDataUrls");

  // ReportsClient.tsx
  content = content.replace(/showAlert\("([^"]+)", "([^"]+)"\)/g, 'showAlert({ title: "$1", message: "$2", type: "error" })');
  content = content.replace(/showAlert\("Error", (err\.message \|\| "[^"]+")\)/g, 'showAlert({ title: "Error", message: $1, type: "error" })');

  // SalesClient.tsx
  content = content.replace(/\/\/ --- Customer State --- const \[/, "/* --- Customer State --- */\nconst [");
  content = content.replace(/\/\/ --- Product Search State --- const \[/, "/* --- Product Search State --- */\nconst [");
  content = content.replace(/\/\/ --- QR Scanner State --- const \[/, "/* --- QR Scanner State --- */\nconst [");
  content = content.replace(/\/\/ ignore continuous scanning errors \}\); \} return \(/, "/* ignore continuous scanning errors */\n});\n}\nreturn (");
  content = content.replace(/\/\/ text should be like "SKU:DRILL-001" const sku = /, "/* text should be like \"SKU:DRILL-001\" */\nconst sku = ");

  // StockCheckClient.tsx
  content = content.replace(/\/\/ QR Scanner State const \[/, "/* QR Scanner State */\nconst [");
  content = content.replace(/\/\/ Auto search when query changes \(debounced\) useEffect/, "/* Auto search when query changes (debounced) */\nuseEffect");
  content = content.replace(/\/\/ QR Scanner Effect useEffect/, "/* QR Scanner Effect */\nuseEffect");
  content = content.replace(/\/\/ ignore errors \} \); \} return \(/, "/* ignore errors */\n}\n);\n}\nreturn (");

  // StockInwardClient.tsx
  content = content.replace(/\/\/ --- Calculations --- const totalCost/, "/* --- Calculations --- */\nconst totalCost");

  // utils.ts
  content = content.replace(/\/\/ Replace spaces, non-word characters, and underscores with a hyphen \.replace/, "/* Replace spaces, non-word characters, and underscores with a hyphen */\n.replace");
  content = content.replace(/\/\/ Remove all non-word chars \.replace/, "/* Remove all non-word chars */\n.replace");
  content = content.replace(/\/\/ Replace multiple hyphens with a single hyphen \.replace/, "/* Replace multiple hyphens with a single hyphen */\n.replace");
  content = content.replace(/\/\/ Remove trailing hyphens \.replace/, "/* Remove trailing hyphens */\n.replace");
  content = content.replace(/\/\/ Optional: add a short random string if we absolutely need uniqueness, \/\/ but per the user's request we avoid random IDs where possible\. \/\/ We'll rely on the schema unique constraints \(like SKU\) to prevent conflicts, \/\/ or append timestamps for events \(like sales\)\. return /, "/* Optional: add a short random string if we absolutely need uniqueness, but per the user's request we avoid random IDs where possible. We'll rely on the schema unique constraints (like SKU) to prevent conflicts, or append timestamps for events (like sales). */\nreturn ");

  fs.writeFileSync(file, content, "utf8");
}
console.log("Fixes applied successfully.");
