// HungryDB — Bakery ontology + sample extracted data (English)
// Each row carries provenance: which source file + page/cell it came from

window.HUNGRYDB_DATA = (() => {
  const SOURCE_FILES = [
    { id: "f1", name: "customer_list_2024.xlsx",      kind: "excel",  size: "412 KB", icon: "xlsx", note: "Customer list — wholesale accounts" },
    { id: "f2", name: "invoice_2026-04-12.pdf",       kind: "pdf",    size: "186 KB", icon: "pdf",  note: "Invoice — Lindenhof Café" },
    { id: "f3", name: "order_millmann_supply.docx",   kind: "word",   size: "94 KB",  icon: "doc",  note: "Supplier order — flour, yeast" },
    { id: "f4", name: "price_list_Q2.xlsx",           kind: "excel",  size: "67 KB",  icon: "xlsx", note: "Price list — wholesale tier" },
    { id: "f5", name: "handwritten_receipt.jpg",      kind: "scan",   size: "1.2 MB", icon: "img",  note: "Handwritten receipt — scan" },
    { id: "f6", name: "legacy_erp_export_2023.csv",   kind: "csv",    size: "2.4 MB", icon: "csv",  note: "Legacy ERP export — bookings" },
  ];

  // Inferred ontology — appears after extraction
  const TABLES = {
    customers: {
      label: "Customers",
      english: "Customers",
      icon: "users",
      pos: { x: 60,  y: 80 },
      fields: [
        { name: "id",       type: "uuid",  pk: true },
        { name: "name",     type: "text" },
        { name: "type",     type: "enum",  values: ["Café", "Hotel", "Private", "Restaurant"] },
        { name: "address",  type: "text" },
        { name: "tax_id",   type: "text",  nullable: true },
        { name: "since",    type: "date" },
      ],
      rows: [
        { id: "C001", name: "Lindenhof Café",         type: "Café",       address: "Maximilian St 14, Munich",  tax_id: "DE298471028", since: "2019-03",
          _provenance: { name: "f1:B7", type: "f1:C7", address: "f1:D7", tax_id: "f1:F7", since: "f1:G7" } },
        { id: "C002", name: "Hotel Kronprinz",        type: "Hotel",      address: "Theresienhöhe 7, Munich",   tax_id: "DE194028371", since: "2017-09",
          _provenance: { name: "f1:B8", type: "f1:C8", address: "f1:D8", tax_id: "f1:F8", since: "f1:G8" } },
        { id: "C003", name: "Sonnenberg Restaurant",  type: "Restaurant", address: "Rosenkavalier Pl 3, Munich", tax_id: "DE847291038", since: "2021-06",
          _provenance: { name: "f1:B9", type: "f1:C9", address: "f1:D9", tax_id: "f1:F9", since: "f1:G9" } },
        { id: "C004", name: "Ms. Berger",             type: "Private",    address: "Leopold St 88, Munich",     tax_id: null,           since: "2024-01",
          _provenance: { name: "f5:p1", type: "inferred", address: "f5:p1", since: "f5:p1" } },
        { id: "C005", name: "Café Murnau",            type: "Café",       address: "Bahnhof St 2, Murnau",      tax_id: "DE572839104", since: "2020-11",
          _provenance: { name: "f1:B11", type: "f1:C11", address: "f1:D11", tax_id: "f1:F11", since: "f1:G11" } },
      ],
    },

    products: {
      label: "Products",
      english: "Products",
      icon: "box",
      pos: { x: 460, y: 80 },
      fields: [
        { name: "sku",        type: "text",    pk: true },
        { name: "name",       type: "text" },
        { name: "category",   type: "enum",    values: ["Bread", "Rolls", "Pastry", "Seasonal"] },
        { name: "unit_price", type: "money" },
        { name: "wholesale",  type: "money" },
        { name: "vat_rate",   type: "percent" },
      ],
      rows: [
        { sku: "BR-001", name: "Rye Mixed Loaf 1kg",  category: "Bread",    unit_price: "4.20", wholesale: "2.95", vat_rate: "7%",
          _provenance: { name: "f4:A4", category: "inferred", unit_price: "f4:C4", wholesale: "f4:D4", vat_rate: "f4:E4" } },
        { sku: "BR-002", name: "Wholegrain Loaf 750g", category: "Bread",   unit_price: "3.80", wholesale: "2.60", vat_rate: "7%",
          _provenance: { name: "f4:A5", category: "inferred", unit_price: "f4:C5", wholesale: "f4:D5", vat_rate: "f4:E5" } },
        { sku: "BT-014", name: "Butter Pretzel",       category: "Rolls",   unit_price: "1.40", wholesale: "0.85", vat_rate: "7%",
          _provenance: { name: "f4:A12", category: "inferred", unit_price: "f4:C12", wholesale: "f4:D12", vat_rate: "f4:E12" } },
        { sku: "PA-007", name: "Apple Strudel Slice",  category: "Pastry",  unit_price: "3.90", wholesale: "2.75", vat_rate: "7%",
          _provenance: { name: "f4:A18", category: "inferred", unit_price: "f4:C18", wholesale: "f4:D18", vat_rate: "f4:E18" } },
        { sku: "SE-022", name: "Stollen 500g",          category: "Seasonal", unit_price: "12.50", wholesale: "8.40", vat_rate: "7%",
          _provenance: { name: "f4:A24", category: "inferred", unit_price: "f4:C24", wholesale: "f4:D24", vat_rate: "f4:E24" } },
      ],
    },

    invoices: {
      label: "Invoices",
      english: "Invoices",
      icon: "receipt",
      pos: { x: 60,  y: 380 },
      fields: [
        { name: "number",      type: "text",  pk: true },
        { name: "customer_id", type: "fk",    ref: "customers" },
        { name: "date",        type: "date" },
        { name: "subtotal",    type: "money" },
        { name: "vat",         type: "money" },
        { name: "total",       type: "money" },
        { name: "status",      type: "enum",  values: ["paid", "open", "overdue"] },
      ],
      rows: [
        { number: "2026-0142", customer_id: "C001", date: "2026-04-12", subtotal: "284.50", vat: "19.92", total: "304.42", status: "paid",
          _provenance: { number: "f2:p1", customer_id: "f2:p1", date: "f2:p1", subtotal: "f2:p1", vat: "f2:p1", total: "f2:p1", status: "f6:r2104" } },
        { number: "2026-0141", customer_id: "C002", date: "2026-04-11", subtotal: "642.80", vat: "44.99", total: "687.79", status: "paid",
          _provenance: { number: "f6:r2103", customer_id: "f6:r2103", date: "f6:r2103", subtotal: "f6:r2103", vat: "f6:r2103", total: "f6:r2103", status: "f6:r2103" } },
        { number: "2026-0140", customer_id: "C003", date: "2026-04-09", subtotal: "198.40", vat: "13.89", total: "212.29", status: "open",
          _provenance: { number: "f6:r2102", customer_id: "f6:r2102", date: "f6:r2102", subtotal: "f6:r2102", vat: "f6:r2102", total: "f6:r2102", status: "f6:r2102" } },
        { number: "2026-0138", customer_id: "C005", date: "2026-04-04", subtotal: "421.20", vat: "29.48", total: "450.68", status: "overdue",
          _provenance: { number: "f6:r2100", customer_id: "f6:r2100", date: "f6:r2100", subtotal: "f6:r2100", vat: "f6:r2100", total: "f6:r2100", status: "f6:r2100" } },
        { number: "HW-0024",   customer_id: "C004", date: "2026-04-08", subtotal: "32.40",  vat: "2.27",  total: "34.67",  status: "paid",
          _provenance: { number: "f5:p1", customer_id: "f5:p1", date: "f5:p1", subtotal: "f5:p1", vat: "inferred", total: "f5:p1", status: "f5:p1" } },
      ],
    },

    suppliers: {
      label: "Suppliers",
      english: "Suppliers",
      icon: "truck",
      pos: { x: 460, y: 380 },
      fields: [
        { name: "id",       type: "uuid", pk: true },
        { name: "name",     type: "text" },
        { name: "category", type: "enum", values: ["Flour", "Yeast", "Dairy", "Packaging"] },
        { name: "contact",  type: "text" },
        { name: "terms",    type: "text" },
      ],
      rows: [
        { id: "S01", name: "Millmann Mills Ltd.",        category: "Flour",     contact: "sales@millmann.com",       terms: "Net 30",
          _provenance: { name: "f3:p1", category: "inferred", contact: "f3:p1", terms: "f3:p1" } },
        { id: "S02", name: "Wagner Yeast Co.",            category: "Yeast",     contact: "orders@wagner-yeast.com",  terms: "Net 14",
          _provenance: { name: "f6:r880", category: "inferred", contact: "f6:r880", terms: "f6:r880" } },
        { id: "S03", name: "Berchtesgaden Dairy",         category: "Dairy",     contact: "b2b@bgl-dairy.com",        terms: "Net 14",
          _provenance: { name: "f6:r881", category: "inferred", contact: "f6:r881", terms: "f6:r881" } },
        { id: "S04", name: "Schmidt Packaging",           category: "Packaging", contact: "info@schmidt-pack.com",    terms: "Net 30",
          _provenance: { name: "f6:r882", category: "inferred", contact: "f6:r882", terms: "f6:r882" } },
      ],
    },

    orders: {
      label: "Supplier Orders",
      english: "Supplier Orders",
      icon: "clipboard",
      pos: { x: 860, y: 380 },
      fields: [
        { name: "id",          type: "text",  pk: true },
        { name: "supplier_id", type: "fk",    ref: "suppliers" },
        { name: "date",        type: "date" },
        { name: "items",       type: "text" },
        { name: "amount",      type: "money" },
      ],
      rows: [
        { id: "O-2026-021", supplier_id: "S01", date: "2026-04-08", items: "Wheat flour 550 ×40, Rye flour 1150 ×20", amount: "892.40",
          _provenance: { id: "f3:p1", supplier_id: "f3:p1", date: "f3:p1", items: "f3:p1", amount: "f3:p1" } },
        { id: "O-2026-019", supplier_id: "S02", date: "2026-04-02", items: "Fresh yeast 42×500g",                     amount: "186.20",
          _provenance: { id: "f6:r1450", supplier_id: "f6:r1450", date: "f6:r1450", items: "f6:r1450", amount: "f6:r1450" } },
        { id: "O-2026-017", supplier_id: "S03", date: "2026-03-29", items: "Whole milk 80L, Cream 12L",                amount: "248.60",
          _provenance: { id: "f6:r1448", supplier_id: "f6:r1448", date: "f6:r1448", items: "f6:r1448", amount: "f6:r1448" } },
      ],
    },

    invoice_lines: {
      label: "Invoice Lines",
      english: "Invoice Lines",
      icon: "list",
      pos: { x: 860, y: 80 },
      fields: [
        { name: "id",         type: "uuid",  pk: true },
        { name: "invoice_id", type: "fk",    ref: "invoices" },
        { name: "sku",        type: "fk",    ref: "products" },
        { name: "qty",        type: "int" },
        { name: "line_total", type: "money" },
      ],
      rows: [
        { id: "L-9821", invoice_id: "2026-0142", sku: "BR-001", qty: 24, line_total: "70.80",
          _provenance: { invoice_id: "f2:p1", sku: "f2:p1", qty: "f2:p1", line_total: "f2:p1" } },
        { id: "L-9822", invoice_id: "2026-0142", sku: "BT-014", qty: 60, line_total: "51.00",
          _provenance: { invoice_id: "f2:p1", sku: "f2:p1", qty: "f2:p1", line_total: "f2:p1" } },
        { id: "L-9823", invoice_id: "2026-0142", sku: "PA-007", qty: 18, line_total: "49.50",
          _provenance: { invoice_id: "f2:p1", sku: "f2:p1", qty: "f2:p1", line_total: "f2:p1" } },
        { id: "L-9824", invoice_id: "2026-0142", sku: "BR-002", qty: 22, line_total: "57.20",
          _provenance: { invoice_id: "f2:p1", sku: "f2:p1", qty: "f2:p1", line_total: "f2:p1" } },
      ],
    },
  };

  // Foreign key edges for ERD
  const RELATIONS = [
    { from: "invoices",      fromField: "customer_id",  to: "customers" },
    { from: "invoice_lines", fromField: "invoice_id",   to: "invoices"  },
    { from: "invoice_lines", fromField: "sku",          to: "products"  },
    { from: "orders",        fromField: "supplier_id",  to: "suppliers" },
  ];

  // What the AI inferred about the business
  const INFERENCE_NOTES = [
    { label: "Sector",       value: "Bakery / Pastry",                                            confidence: 0.97 },
    { label: "Region",       value: "Bavaria, DE",                                                confidence: 0.94 },
    { label: "VAT regime",   value: "Standard scheme · 7% reduced rate (baked goods, §12 UStG)", confidence: 0.91 },
    { label: "Customer mix", value: "Wholesale (B2B) 80% · Private 20%",                          confidence: 0.88 },
    { label: "Fiscal year",  value: "Calendar year",                                              confidence: 0.99 },
  ];

  // Sidebar intelligence — pre-canned questions
  const INTELLIGENCE = {
    suggestions: [
      "Which customers are overdue on payment?",
      "Revenue by product category, last 30 days",
      "Prepare DATEV export for March 2026",
      "List all invoices over €500",
      "Which supplier has gotten more expensive?",
    ],
    exports: [
      { id: "datev", name: "DATEV Export",            period: "March 2026", lines: 142,  format: "ASCII (Pro)" },
      { id: "xrech", name: "XRechnung Batch",         period: "Q1 2026",    lines: 38,   format: "XML / ZUGFeRD" },
      { id: "ust",   name: "VAT Pre-filing (UStVA)",  period: "March 2026", lines: 1,    format: "ELSTER XML" },
      { id: "gobd",  name: "GoBD Audit Pack",         period: "FY 2025",    lines: 1812, format: "ZIP + Index" },
    ],
    summaries: [
      { title: "Revenue April (MTD)",  value: "€12,482", delta: "+8.4%", deltaDir: "up" },
      { title: "Open Receivables",     value: "€1,094",  delta: "−12%",  deltaDir: "down" },
      { title: "Cost of Goods (Apr)",  value: "€4,218",  delta: "+3.1%", deltaDir: "up" },
      { title: "Avg. Daily Revenue",   value: "€541",    delta: "+6.0%", deltaDir: "up" },
    ],
  };

  return { SOURCE_FILES, TABLES, RELATIONS, INFERENCE_NOTES, INTELLIGENCE };
})();
