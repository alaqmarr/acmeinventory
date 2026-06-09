import React from "react";
import { getProductAnalytics } from "./actions";
import ProductAnalyticsClient from "./ProductAnalyticsClient";

export default async function ProductAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getProductAnalytics(resolvedParams.id);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <ProductAnalyticsClient data={data} />
    </div>
  );
}
