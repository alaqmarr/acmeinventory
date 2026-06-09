"use server";

import { prisma } from "@/lib/prisma";

export async function getAllClients() {
  const clients = await prisma.customer.findMany({
    include: {
      sales: {
        select: {
          totalAmount: true,
        },
      },
    },
  });

  const clientsWithStats = clients.map((client) => {
    const totalOrders = client.sales.length;
    const ltv = client.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    return {
      id: client.id,
      name: client.name,
      phone: client.phone,
      createdAt: client.createdAt,
      totalOrders,
      ltv,
    };
  });

  clientsWithStats.sort((a, b) => b.ltv - a.ltv);

  return clientsWithStats;
}

export async function getClientDetails(customerId: string) {
  const client = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      sales: {
        orderBy: { date: "desc" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return client;
}
