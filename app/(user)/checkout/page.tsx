import CheckoutClient from "@/components/home/CheckoutClient";
import axios from "axios";

export default async function CheckoutPage(props: any) {
  const searchParams = await props.searchParams;
  const variantId = searchParams.variantId;
  const qty = Number(searchParams.qty || 1);

  if (!variantId) {
    return <div className="p-10 text-center">Variant ID missing</div>;
  }

  // Fetch variant + product from API
  let item: any = null;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/variant?id=${variantId}`
    );

    item = {
      name: data.product.name,
      sellerId: data.product.sellerId,
      description: data.product.description,
      deliveryInDays: data.product.deliveryInDays,
      combination: data.variant.combination,
      images: data.variant.images,
      price: Number(data.variant.price),
      stock: Number(data.variant.stock),
      qty,
      productId: data.product._id,
      variantId: data.variant._id,
    };
  } catch (err) {
    console.error(err);
    return <div className="p-10 text-center">Failed to load checkout</div>;
  }

  return <CheckoutClient item={item} />;
}
