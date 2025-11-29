"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AddressSelector() {
  const addresses = [
    {
      id: 1,
      name: "Somnath Das",
      details:
        "South Garia, Netaji Sangha. Roybahadur Road., Kolkata WEST BENGAL 743613",
      default: true,
    },
    {
      id: 2,
      name: "Prasanjit Mitra",
      details:
        "P.O.+Vill :- Malancha mahinagar (pande lane) Kolkata, West 700145, RAJPUR SONARPUR WEST BENGAL 700145",
      default: false,
    },
  ];

  const [selected, setSelected] = useState(addresses[0].id); // default selected

  const handleSelect = (id: number) => {
    setSelected(id);
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-2">Choose your location</h2>
      <p className="text-sm text-gray-600 mb-4">
        Select a delivery location to see product availability and delivery
        options
      </p>

      {addresses.map((a) => {
        const isSelected = selected === a.id;

        return (
          <Card
            key={a.id}
            onClick={() => handleSelect(a.id)}
            className={`rounded-xl cursor-pointer border-2 transition-all ${
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <CardContent className="p-4 space-y-1">
              <p className="font-semibold">{a.name}</p>
              <p className="text-sm text-gray-700 leading-snug">{a.details}</p>
              {a.default && (
                <p className="text-sm font-medium text-gray-600">
                  Default address
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}

      <button className="text-blue-600 text-sm font-medium">
        Add an address or pick-up point
      </button>
    </div>
  );
}
