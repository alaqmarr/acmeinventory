"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
export async function getProducts() {
  return await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}
export async function createProduct(data: {
  name: string;
  sku: string;
  category?: string;
  defaultSellingPrice: number;
  defaultCostPrice?: number;
  defaultGst?: number;
}) {
  try {
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });
    if (existingSku) {
      return { success: false, error: "Product with this SKU already exists" };
    }
    const product = await prisma.product.create({
      data: {
        id: generateId("prd", data.sku || data.name),
        name: data.name,
        sku: data.sku,
        category: data.category,
        defaultSellingPrice: data.defaultSellingPrice,
        defaultCostPrice: data.defaultCostPrice,
        defaultGst: data.defaultGst ?? 18.0,
        stockQuantity: 0,
      },
    });
    revalidatePath("/products");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export async function updateProduct(
  id: string,
  data: {
    name: string;
    sku: string;
    category?: string;
    defaultSellingPrice: number;
    defaultCostPrice?: number;
    defaultGst?: number;
  },
) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        category: data.category,
        defaultSellingPrice: data.defaultSellingPrice,
        defaultCostPrice: data.defaultCostPrice,
        defaultGst: data.defaultGst,
      },
    });
    revalidatePath("/products");
    return { success: true, product };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Product with this SKU already exists" };
    }
    return { success: false, error: error.message };
  }
}
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error:
        "Cannot delete product because it may have associated sales or stock records.",
    };
  }
}
