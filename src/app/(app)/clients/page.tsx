import { getAllClients } from "./actions";
import ClientsClient from "./ClientsClient";

export const metadata = {
  title: "Clients Management | Acme Inventory",
};

export default async function ClientsPage() {
  const clients = await getAllClients();
  
  return <ClientsClient initialClients={clients} />;
}
