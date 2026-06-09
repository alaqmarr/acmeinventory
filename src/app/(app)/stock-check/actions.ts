"use server";
import { prisma } from "@/lib/prisma";
export async function checkProductStock(query: string) {
  if (!query || query.trim() === "") {
    return { success: false, error: "Search query is required." };
  }
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [{ name: { contains: query } }, { sku: { contains: query } }],
      },
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        stockQuantity: true,
        defaultSellingPrice: true,
      },
      take: 10,
    });
    if (products.length === 0) {
      return {
        success: false,
        error: "No products found matching that query.",
      };
    }
    return { success: true, data: products };
  } catch (error: any) {
    console.error("Error checking product stock:", error);
    return { success: false, error: "Failed to query database." };
  }
}
