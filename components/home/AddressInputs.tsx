"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveAddress } from "@/app/actions/address";

export default function AddressInputs({ address }: { address: any }) {
  const [editing, setEditing] = useState(!address); // show form if no address
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: address?.name || "",
    location: address?.location || "",
    pin: address?.pin || "",
    phone: address?.phone || "",
  });

  const submitForm = (e: any) => {
    e.preventDefault();

    startTransition(() => {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("location", form.location);
      fd.append("pin", form.pin);
      fd.append("phone", form.phone);

      saveAddress(fd);
    });

    setEditing(false);
  };

  const deleteAddress = async () => {
    await fetch("/api/address/delete", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="flex flex-col p-4 w-full max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-semibold">Your Delivery Address</h2>

      {/* Show Form */}
      {editing && (
        <form
          onSubmit={submitForm}
          className="space-y-3 border rounded-xl p-4 bg-gray-50"
        >
          <input
            className="w-full p-2 border rounded"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            className="w-full p-2 border rounded"
            placeholder="Address / Location"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            className="w-full p-2 border rounded"
            placeholder="Pincode"
            required
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value })}
          />

          <input
            className="w-full p-2 border rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Address"}
          </Button>

          {address && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          )}
        </form>
      )}

      {/* Show Saved Address */}
      {!editing && address && (
        <Card className="flex justify-center items-center rounded-xl border pl-5">
          <CardContent className="p-4 space-y-2 ">
            <p className="font-semibold">{address.name}</p>
            <p className="text-sm text-gray-700">{address.location}</p>
            <p className="text-sm">{address.pin}</p>
            <p className="text-sm">📞 {address.phone}</p>

            <div className="flex  gap-3 mt-3 items-center">
              <Button className="bg-green-500" onClick={() => setEditing(true)}>
                Edit
              </Button>

              <Button className="bg-red-400" onClick={deleteAddress}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!address && !editing && (
        <button
          className="text-blue-600 font-medium"
          onClick={() => setEditing(true)}
        >
          Add address
        </button>
      )}
    </div>
  );
}
