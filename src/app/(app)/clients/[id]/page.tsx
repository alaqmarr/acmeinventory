import React from "react";
import { getClientDetails } from "../actions";
import ClientDetailsClient from "./ClientDetailsClient";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const clientData = await getClientDetails(resolvedParams.id);

  if (!clientData) {
    return (
      <div className="p-8 text-center text-slate-500">
        <h1 className="text-2xl font-bold">Client not found</h1>
        <p className="mt-2">The client you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <ClientDetailsClient client={clientData} />
    </div>
  );
}
