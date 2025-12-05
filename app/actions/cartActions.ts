"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

interface AddToCartInput {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  combination: Record<string, string>;
  itemName: string;
  image: string;
  sellerId: string;
  deliveryInDays: number;
  stock: number;
}

export async function addToCart(data: AddToCartInput) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: session.user.id,
        items: [],
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => String(item.variantId) === String(data.variantId)
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += data.quantity;

      // Ensure quantity doesn't exceed stock
      if (cart.items[existingItemIndex].quantity > data.stock) {
        cart.items[existingItemIndex].quantity = data.stock;
      }
    } else {
      // Add new item to cart
      cart.items.push({
        productId: data.productId,
        variantId: data.variantId,
        quantity: data.quantity,
        price: data.price,
        combination: data.combination,
        itemName: data.itemName,
        image: data.image,
        sellerId: data.sellerId,
        deliveryInDays: data.deliveryInDays,
        stock: data.stock,
      });
    }

    await cart.save();
    revalidatePath("/cart");

    return { success: true, message: "Item added to cart" };
  } catch (err: any) {
    console.error("Add to cart error:", err);
    return { success: false, error: err.message || "Failed to add to cart" };
  }
}

export async function updateCartItemQuantity(
  variantId: string,
  quantity: number
) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart) {
      return { success: false, error: "Cart not found" };
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => String(item.variantId) === String(variantId)
    );

    if (itemIndex === -1) {
      return { success: false, error: "Item not found in cart" };
    }

    // Check stock availability
    if (quantity > cart.items[itemIndex].stock) {
      return { success: false, error: "Quantity exceeds available stock" };
    }

    if (quantity <= 0) {
      return { success: false, error: "Invalid quantity" };
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    revalidatePath("/cart");

    return { success: true };
  } catch (err: any) {
    console.error("Update quantity error:", err);
    return {
      success: false,
      error: err.message || "Failed to update quantity",
    };
  }
}

export async function removeFromCart(variantId: string) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart) {
      return { success: false, error: "Cart not found" };
    }

    cart.items = cart.items.filter(
      (item: any) => String(item.variantId) !== String(variantId)
    );

    await cart.save();
    revalidatePath("/cart");

    return { success: true };
  } catch (err: any) {
    console.error("Remove from cart error:", err);
    return { success: false, error: err.message || "Failed to remove item" };
  }
}

export async function getCart() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const cart = await Cart.findOne({ userId: session.user.id }).lean();

    if (!cart) {
      return { success: true, cart: { items: [] } };
    }

    // Convert to plain object
    const plainCart = {
      _id: cart._id.toString(),
      userId: cart.userId.toString(),
      items: cart.items.map((item: any) => ({
        productId: item.productId.toString(),
        variantId: item.variantId.toString(),
        quantity: item.quantity,
        price: item.price,
        combination: Object.fromEntries(item.combination),
        itemName: item.itemName,
        image: item.image,
        sellerId: item.sellerId.toString(),
        deliveryInDays: item.deliveryInDays,
        stock: item.stock,
      })),
    };

    return { success: true, cart: plainCart };
  } catch (err: any) {
    console.error("Get cart error:", err);
    return { success: false, error: err.message || "Failed to get cart" };
  }
}

export async function clearCart() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    await Cart.findOneAndUpdate({ userId: session.user.id }, { items: [] });

    revalidatePath("/cart");

    return { success: true };
  } catch (err: any) {
    console.error("Clear cart error:", err);
    return { success: false, error: err.message || "Failed to clear cart" };
  }
}
