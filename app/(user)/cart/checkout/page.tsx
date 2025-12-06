// app/cart/checkout/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCart } from "@/app/actions/cartActions";
import Address from "@/models/Address";
import { connectToDatabase } from "@/lib/db";
import CartCheckoutClient from "@/components/home/CartCheckoutClient";
import User from "@/models/User";

export default async function CartCheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const cartResult = await getCart();

  if (!cartResult.success || !cartResult.cart?.items?.length) {
    redirect("/cart");
  }

  let address = null;
  let sellerUsernames: Record<string, string> = {};

  try {
    await connectToDatabase();

    // Get address
    const addressDoc = await Address.findOne({
      userId: session.user.id,
    }).lean();

    if (addressDoc) {
      address = {
        ...addressDoc,
        _id: addressDoc._id.toString(),
        userId: addressDoc.userId.toString(),
      };
    }

    // Get unique seller IDs from cart items
    const sellerIds = Array.from(
      new Set(cartResult.cart.items.map((item) => item.sellerId))
    );

    // Fetch all seller usernames
    const sellers = await User.find({ _id: { $in: sellerIds } }).lean();

    sellerUsernames = sellers.reduce(
      (acc: Record<string, string>, seller: any) => {
        acc[seller._id.toString()] = seller.username;
        return acc;
      },
      {}
    );
  } catch (err) {
    console.error("Failed to load checkout data:", err);
  }

  return (
    <CartCheckoutClient
      cart={cartResult.cart}
      address={address}
      sellerUsernames={sellerUsernames}
    />
  );
}
