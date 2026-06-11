"use server";
import { prisma } from "@/lib/prisma";
export async function checkProductStock(query: string) {
  if (!query || query.trim() === "") {
    return { success: false, error: "Search query is required." };
  }
  try {
    const words = query.toUpperCase().split(' ').filter(w => w.length > 0);
    const products = await prisma.product.findMany({
      where: {
        AND: words.map(word => ({
          OR: [
            { name: { contains: word } },
            { sku: { contains: word } },
            { make: { contains: word } },
            { size: { contains: word } }
          ]
        }))
      },
      select: {
        id: true,
        name: true,
        sku: true,
        make: true,
        size: true,
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
