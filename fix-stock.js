const fs = require("fs");
const file = "e:\\acmeinventory\\src\\app\\(app)\\stock-inward\\StockInwardClient.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/\/\/ Price History State (const \[priceHistory.*?)/, "/* Price History State */\n$1");
content = content.replace(/\/\/ Close dropdown when clicking outside (useEffect.*?)/, "/* Close dropdown when clicking outside */\n$1");
content = content.replace(/\/\/ Fetch History whenever a product is selected (useEffect.*?)/, "/* Fetch History whenever a product is selected */\n$1");
content = content.replace(/\/\/ ignore errors \}\); \} return \(\) => \{/, "/* ignore errors */\n});\n}\nreturn () => {");
content = content.replace(/\/\/ Update local products state with new default prices (setProducts.*?)/, "/* Update local products state with new default prices */\n$1");
content = content.replace(/\/\/ Refresh recent batches (const updatedBatches.*?)/, "/* Refresh recent batches */\n$1");

fs.writeFileSync(file, content, "utf8");
console.log("StockInwardClient fixed!");
