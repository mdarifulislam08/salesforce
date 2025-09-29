import React from "react";

const PurchaseOrderPrint = ({ po, poDetails, organizations, purchaseOrders, products }) => {
  // Helper to format dates
  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A");

  // Get vendor, store, and parent PO
  const vendor = organizations.find((org) => org.id === po.vendor_id)?.name || "N/A";
  const store = organizations.find((org) => org.id === po.store_id)?.name || "N/A";
  const parentPo = po.po_id ? purchaseOrders.find((p) => p.id === po.po_id)?.po_no || "N/A" : "N/A";

  // Get current timestamp for footer
  const now = new Date();
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <div className="bg-white p-5 font-arial text-gray-800 leading-6 print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-5">
          <h1 className="text-xl font-bold mb-1">Purchase Order: {po.po_no}</h1>
          <div className="text-sm">Date: {formatDate(po.po_date)}</div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-2.5 mb-8">
          {[
            { label: "PO Type", value: po.po_type || "N/A" },
            { label: "Pay Mode", value: po.pay_mode || "N/A" },
            { label: "Vendor", value: vendor },
            { label: "Store", value: store },
            { label: "Currency", value: po.currency || "N/A" },
            { label: "Subtotal", value: po.sub_total || "N/A" },
            { label: "Grand Total", value: po.grand_total || "N/A" },
            { label: "Discount", value: po.discount || "N/A" },
            { label: "VDS Total", value: po.vds_total || "N/A" },
            { label: "TDS Total", value: po.tds_total || "N/A" },
            { label: "Subject", value: po.subject || "N/A" },
            { label: "Remarks", value: po.remarks || "N/A" },
            { label: "Company Code", value: po.company_code || "N/A" },
            { label: "Parent PO", value: parentPo },
            { label: "Created", value: formatDate(po.created) },
            { label: "Created By", value: po.created_by || "N/A" },
            { label: "Modified", value: formatDate(po.modified) },
            { label: "Modified By", value: po.modified_by || "N/A" },
          ].map(({ label, value }) => (
            <div key={label} className="flex">
              <div className="font-bold w-32 pr-2.5">{label}:</div>
              <div>{value}</div>
            </div>
          ))}
        </div>

        {/* Order Details */}
        <h2 className="text-lg font-semibold mt-5 mb-4 border-b border-gray-300 pb-1.5">Order Details</h2>
        {poDetails.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No product details found for this purchase order (PO ID: {po.po_id || po.id}).
          </p>
        ) : (
          <table className="w-full border-collapse mb-5 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left font-bold">Line</th>
                <th className="border border-gray-300 p-2 text-left font-bold">Product</th>
                <th className="border border-gray-300 p-2 text-center font-bold">Quantity</th>
                <th className="border border-gray-300 p-2 text-right font-bold">Unit Price</th>
                <th className="border border-gray-300 p-2 text-right font-bold">Discount</th>
                <th className="border border-gray-300 p-2 text-center font-bold">Discount %</th>
                <th className="border border-gray-300 p-2 text-right font-bold">Total Price</th>
                <th className="border border-gray-300 p-2 text-center font-bold">VDS %</th>
                <th className="border border-gray-300 p-2 text-right font-bold">VDS</th>
                <th className="border border-gray-300 p-2 text-center font-bold">TDS %</th>
                <th className="border border-gray-300 p-2 text-right font-bold">TDS</th>
              </tr>
            </thead>
            <tbody>
              {poDetails.map((detail, index) => (
                <tr key={detail.line_no || index}>
                  <td className="border border-gray-300 p-2 text-center">{detail.line_no || "N/A"}</td>
                  <td className="border border-gray-300 p-2">
                    {products.find((p) => p.id === detail.inv_product_id)?.name || "N/A"} (
                    {products.find((p) => p.id === detail.inv_product_id)?.code || "N/A"})
                  </td>
                  <td className="border border-gray-300 p-2 text-center">{detail.quantity || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-right">{detail.unit_price || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-right">{detail.discount || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-center">{detail.discount_pct || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-right">{detail.total_price || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-center">{detail.vds_pct || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-right">{detail.vds || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-center">{detail.tds_pct || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-right">{detail.tds || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="text-center mt-5 text-sm print:hidden">1 of 1</div>

        {/* Footer */}
        <div className="mt-8 border-t border-gray-300 pt-2.5 text-xs text-gray-600 text-center">
          Purchase Order {po.po_no} | Generated on {timestamp}
        </div>
      </div>

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
              font-size: 10pt;
            }
            .print\\:hidden {
              display: none;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PurchaseOrderPrint;