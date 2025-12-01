"use client";

import Image from "next/image";

export default function CheckoutClient({ item }: { item: any }) {
  const qty = item.qty;

  const price = item.price * qty;
  const deliveryFee = 40;
  const payOnDeliveryFee = 7;
  const discount = -40;
  const total = price + deliveryFee + payOnDeliveryFee + discount;

  return (
    <div className="max-w-6xl mx-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT SIDE */}
      <div className="col-span-2 space-y-5">
        {/* ADDRESS */}
        <div className="p-5 border rounded bg-white">
          <h2 className="font-semibold text-lg">Delivering to Somnath Das</h2>
          <p className="text-gray-600 mt-1">
            South Garia, Netaji Sangha., Roybahadur Road., Kolkata, WEST BENGAL,
            743613, India
          </p>
          <button className="text-blue-600 mt-2">
            Add delivery instructions
          </button>
        </div>

        {/* PAYMENT */}
        <div className="p-5 border rounded bg-white">
          <h2 className="font-semibold text-lg">Pay on delivery (Cash/Card)</h2>
          <button className="text-blue-600 mt-2">
            Use a gift card, voucher or promo code
          </button>
        </div>

        {/* ITEM */}
        <div className="p-5 border rounded bg-white flex flex-col md:flex-row justify-between">
          <div className="flex gap-4">
            <Image
              src={item.images[0]}
              alt="product"
              width={120}
              height={120}
              className="object-contain"
            />
            <div>
              <h3 className="font-semibold text-md">{item.name}</h3>

              <p className="text-gray-700">₹{item.price}</p>
              <p className="text-gray-600 text-sm mt-1">Qty: {qty}</p>

              <p className="text-sm text-gray-600 mt-1">
                Sold by {item.sellerId}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {Object.entries(item.combination)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" / ")}
              </p>
            </div>
          </div>

          <div className="flex items-center mt-5 md:mt-0">
            <label className="flex items-center gap-2">
              <input type="radio" checked readOnly />
              <span>FREE Delivery</span>
            </label>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE SUMMARY */}
      <div className="p-5 border rounded bg-white h-fit">
        <button className="w-full bg-yellow-400 py-3 rounded text-lg font-semibold">
          Place your order
        </button>

        <p className="text-sm mt-3 text-gray-600">
          By placing your order, you agree to our terms and conditions.
        </p>

        <hr className="my-4" />

        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>₹{price}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="flex justify-between">
            <span>Cash on Delivery fee:</span>
            <span>₹{payOnDeliveryFee}</span>
          </div>

          <div className="flex justify-between text-green-700 font-semibold">
            <span>FREE Delivery</span>
            <span>{discount}</span>
          </div>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-bold">
          <span>Order Total:</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}
