"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProductsForQR() {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      make: true,
      size: true,
      qrCode: true,
      category: true,
      defaultSellingPrice: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function generateQRForProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return { success: false, error: "Product not found" };
    }
    // The QR content encodes the SKU
    const qrContent = `SKU:${product.sku}`;
    // Save the QR content string to the product record
    await prisma.product.update({
      where: { id: productId },
      data: { qrCode: qrContent },
    });
    revalidatePath("/product-qr-print");
    return { success: true, qrCode: qrContent };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
