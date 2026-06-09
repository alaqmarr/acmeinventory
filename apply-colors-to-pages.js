const fs = require('fs');

function injectColorfulDashboard() {
  const file = 'e:\\acmeinventory\\src\\app\\(app)\\page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Total Products Card
  content = content.replace(
    /<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200\/50">[\s\S]*?<h3 className="font-semibold text-slate-600 ">Total Products<\/h3>[\s\S]*?<div className="w-10 h-10 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-\[1rem\] flex items-center justify-center shadow-md shadow-slate-200\/40">[\s\S]*?<Package className="w-5 h-5" \/>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<p className="text-4xl font-bold text-slate-900 ">{productsCount}<\/p>[\s\S]*?<\/div>/,
    `<div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-[1.5rem] shadow-xl shadow-indigo-200 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white/80">Total Products</h3>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white">{productsCount}</p>
        </div>`
  );

  // Today's Revenue Card
  content = content.replace(
    /<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200\/50">[\s\S]*?<h3 className="font-semibold text-slate-600 ">\s*Today&apos;s Revenue\s*<\/h3>[\s\S]*?<div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-\[1rem\] flex items-center justify-center shadow-md shadow-slate-200\/40">[\s\S]*?<TrendingUp className="w-5 h-5" \/>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<p className="text-4xl font-bold text-slate-900 ">[\s\S]*?<\/p>[\s\S]*?<p className="text-sm text-slate-500 leading-relaxed mt-2">[\s\S]*?<\/p>[\s\S]*?<\/div>/,
    `<div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-[1.5rem] shadow-xl shadow-emerald-200 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white/80">Today's Revenue</h3>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white">
            ₹{todaySales._sum.totalAmount?.toLocaleString() || "0"}
          </p>
          <p className="text-sm text-white/80 mt-2">
            {todaySales._count.id} sales today
          </p>
        </div>`
  );

  // Low Stock Alerts Card
  content = content.replace(
    /<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200\/50">[\s\S]*?<h3 className="font-semibold text-slate-600 ">Low Stock Alerts<\/h3>[\s\S]*?<div className="w-10 h-10 bg-rose-50 text-rose-600 border border-rose-100 rounded-\[1rem\] flex items-center justify-center shadow-md shadow-slate-200\/40">[\s\S]*?<AlertTriangle className="w-5 h-5" \/>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<p className="text-4xl font-bold text-slate-900 ">[\s\S]*?<\/p>[\s\S]*?<p className="text-sm text-slate-500 leading-relaxed mt-2">Products below 10 units<\/p>[\s\S]*?<\/div>/,
    `<div className="bg-gradient-to-br from-rose-500 to-red-600 p-6 rounded-[1.5rem] shadow-xl shadow-rose-200 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white/80">Low Stock Alerts</h3>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white">
            {lowStockProducts.length}
          </p>
          <p className="text-sm text-white/80 mt-2">Products below 10 units</p>
        </div>`
  );

  fs.writeFileSync(file, content, 'utf8');
}

function injectColorfulReports() {
  const file = 'e:\\acmeinventory\\src\\app\\(app)\\reports\\ReportsClient.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Change generic summary cards to colorful
  content = content.replace(
    /<div className="bg-white p-6 rounded-\[1\.5rem\] border border-slate-200 shadow-xl shadow-slate-200\/50">[\s\S]*?<div className="flex justify-between items-start mb-4">[\s\S]*?<div>[\s\S]*?<p className="text-sm font-medium text-slate-500 leading-relaxed">Total Revenue<\/p>[\s\S]*?<h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 ">₹{reportData.totalRevenue.toLocaleString\(\)}<\/h3>[\s\S]*?<\/div>[\s\S]*?<div className="p-3 bg-blue-50 rounded-\[1rem\]">[\s\S]*?<DollarSign className="w-6 h-6 text-blue-600" \/>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/,
    `<div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-[1.5rem] shadow-xl shadow-indigo-200 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-white/80">Total Revenue</p>
              <h3 className="text-3xl font-extrabold tracking-tight text-white mt-1">₹{reportData.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>`
  );

  content = content.replace(
    /<div className="bg-white p-6 rounded-\[1\.5rem\] border border-slate-200 shadow-xl shadow-slate-200\/50">[\s\S]*?<div className="flex justify-between items-start mb-4">[\s\S]*?<div>[\s\S]*?<p className="text-sm font-medium text-slate-500 leading-relaxed">Total Profit<\/p>[\s\S]*?<h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-emerald-600 font-semibold ">₹{reportData.totalProfit.toLocaleString\(\)}<\/h3>[\s\S]*?<\/div>[\s\S]*?<div className="p-3 bg-emerald-50 rounded-\[1rem\]">[\s\S]*?<TrendingUp className="w-6 h-6 text-emerald-600 font-semibold" \/>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/,
    `<div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-[1.5rem] shadow-xl shadow-emerald-200 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-white/80">Total Profit</p>
              <h3 className="text-3xl font-extrabold tracking-tight text-white mt-1">₹{reportData.totalProfit.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>`
  );

  fs.writeFileSync(file, content, 'utf8');
}

function injectColorfulHeaders() {
  // Let's add a colorful header background block to the other pages
  const files = [
    'e:\\acmeinventory\\src\\app\\(app)\\sales\\SalesClient.tsx',
    'e:\\acmeinventory\\src\\app\\(app)\\stock-inward\\StockInwardClient.tsx',
    'e:\\acmeinventory\\src\\app\\(app)\\products\\ProductClient.tsx',
    'e:\\acmeinventory\\src\\app\\(app)\\ledger\\LedgerClient.tsx',
    'e:\\acmeinventory\\src\\app\\(app)\\stock-check\\StockCheckClient.tsx',
    'e:\\acmeinventory\\src\\app\\(app)\\product-qr-print\\QRPrintClient.tsx',
  ];

  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      
      // Inject a colorful div behind the main header
      // Wait, it's easier to just change the header text area into a gradient card!
      // Look for:
      // <div>
      //   <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter leading-tight text-slate-900 ">...</h1>
      //   <p className="text-slate-500 leading-relaxed mt-1">...</p>
      // </div>
      
      content = content.replace(
        /<div>\s*<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter leading-tight text-slate-900 ">([\s\S]*?)<\/h1>\s*<p className="text-slate-500 leading-relaxed mt-1">\s*([\s\S]*?)\s*<\/p>\s*<\/div>/,
        `<div className="bg-gradient-to-r from-indigo-900 to-slate-800 p-8 rounded-[2rem] shadow-xl w-full text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">$1</h1>
            <p className="text-indigo-100 text-sm sm:text-base font-medium max-w-xl">$2</p>
          </div>
        </div>`
      );

      fs.writeFileSync(file, content, 'utf8');
    } catch (e) {
      console.error(e);
    }
  });
}

try {
  injectColorfulDashboard();
  injectColorfulReports();
  injectColorfulHeaders();
} catch (e) {
  console.log(e);
}

console.log('Massive colorful page headers and gradient cards applied.');
