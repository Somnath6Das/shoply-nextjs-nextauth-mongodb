// app/cart/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCart } from "@/app/actions/cartActions";
import CartClient from "@/components/home/CartClient";

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const result = await getCart();

  if (!result.success || !result.cart) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600">{result.error || "Failed to load cart"}</p>
      </div>
    );
  }

  return <CartClient cart={result.cart} />;
}
