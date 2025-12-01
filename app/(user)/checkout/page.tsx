import CheckoutClient from "@/components/home/CheckoutClient";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import Address from "@/models/Address";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";
import User from "@/models/User";

// Types for the data structures
interface Variant {
  _id: Types.ObjectId;
  combination: Record<string, string>;
  images: string[];
  price: number;
  stock: number;
}

interface ProductDocument {
  _id: Types.ObjectId;
  name: string;
  sellerId: Types.ObjectId;
  description: string;
  deliveryInDays: number;
  variants: Variant[];
}

interface AddressDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  [key: string]: any; // for any additional address fields
}

interface CheckoutItem {
  name: string;
  sellerId: string;
  description: string;
  deliveryInDays: number;
  combination: Record<string, string>;
  images: string[];
  price: number;
  stock: number;
  qty: number;
  productId: string;
  variantId: string;
}

interface SerializedAddress {
  _id: string;
  userId: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  [key: string]: any;
}

interface CheckoutPageProps {
  searchParams: Promise<{
    variantId?: string;
    qty?: string;
  }>;
}
interface Sellername {
  username: string | undefined;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const variantId = params.variantId;
  const qty = Number(params.qty || 1);

  if (!variantId) {
    return <div className="p-10 text-center">Variant ID missing</div>;
  }

  let item: CheckoutItem | null = null;
  let address: SerializedAddress | null = null;
  let seller: Sellername | null = null;
  try {
    await connectToDatabase();

    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return <div className="p-10 text-center">Please sign in to checkout</div>;
    }

    // Find product with variant
    const product = await Product.findOne({
      "variants._id": variantId,
    }).lean<ProductDocument>();

    if (!product) {
      return <div className="p-10 text-center">Product not found</div>;
    }
    seller =
      (await User.findOne({ _id: product.sellerId }).lean<Sellername>()) ??
      null;

    const variant = product.variants.find(
      (v: Variant) => String(v._id) === String(variantId)
    );

    if (!variant) {
      return <div className="p-10 text-center">Variant not found</div>;
    }

    // Get address
    const addressDoc = await Address.findOne({
      userId: session.user.id,
    }).lean<AddressDocument>();

    // Convert to plain objects with string IDs
    item = {
      name: product.name,
      sellerId: String(product.sellerId),
      description: product.description,
      deliveryInDays: product.deliveryInDays,
      combination: variant.combination,
      images: variant.images,
      price: Number(variant.price),
      stock: Number(variant.stock),
      qty,
      productId: String(product._id),
      variantId: String(variant._id),
    };

    // Serialize address if it exists
    if (addressDoc) {
      address = {
        ...addressDoc,
        _id: String(addressDoc._id),
        userId: String(addressDoc.userId),
      };
    }
  } catch (err) {
    console.error(err);
    return <div className="p-10 text-center">Failed to load checkout</div>;
  }

  return (
    <CheckoutClient
      item={item}
      address={address}
      sellerUsername={seller?.username}
    />
  );
}
