"use client";

import Image from "next/image";
import { useState } from "react";

interface OrderItem {
  productId: string;
  variantId: string;
  ItemName: string;
  image: string;
  deliveryInDays: number;
  quantity: number;
  price: number;
  combination: Record<string, string>;
  _id: string;
}

interface OrderAddress {
  name: string;
  location: string;
  pin: string;
  phone: string;
  _id: string;
}

interface Order {
  _id: string;
  userId: string;
  sellerId: string;
  items: OrderItem[];
  address: OrderAddress[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDeliveryDate = (orderDate: string, deliveryInDays: number) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + deliveryInDays);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const address = order.address[0];
  // Get the max delivery days from all items
  const maxDeliveryDays = Math.max(
    ...order.items.map((item) => item.deliveryInDays)
  );

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-gray-600">Order Placed</p>
              <p className="font-semibold">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-600">Delivery By</p>
              <p className="font-semibold text-green-700">
                {calculateDeliveryDate(order.createdAt, maxDeliveryDays)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-semibold">
                ₹{order.totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Ship To</p>
              <p className="font-semibold">{address?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <p className="text-sm text-gray-600">
              Order #{order._id.slice(-8)}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-6">
        {order.items.map((item, index) => (
          <div key={item._id} className={index > 0 ? "mt-6 pt-6 border-t" : ""}>
            <div className="flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.ItemName}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{item.ItemName}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                  {Object.entries(item.combination).map(([key, value]) => (
                    <span key={key} className="bg-gray-100 px-2 py-1 rounded">
                      {key}: {value}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">Qty: {item.quantity}</span>
                  <span className="font-semibold text-lg">
                    ₹{item.price.toLocaleString()}
                  </span>
                </div>
                {item.deliveryInDays > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Delivery in {item.deliveryInDays}{" "}
                    {item.deliveryInDays === 1 ? "day" : "days"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Delivery Address - Expandable */}
        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-semibold text-gray-700">Delivery Address</h4>
            <svg
              className={`w-5 h-5 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {expanded && address && (
            <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-4 rounded">
              <p className="font-semibold text-gray-900">{address.name}</p>
              <p className="mt-1">{address.location}</p>
              <p>{address.pin}</p>
              <p className="mt-2">Phone: {address.phone}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
            Track Package
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
