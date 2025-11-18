import User from "@/models/User";
import { CheckCircle, Info, Trash2 } from "lucide-react";

export default async function SellerAccount() {
  const sellers = await User.find({ role: "seller" }).sort({ createdAt: -1 });
  // console.log(sellers);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Sellers</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Seller Name</th>
              <th className="py-3 px-4 text-center">Verified</th>
              <th className="py-3 px-4 text-center">Created At</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {sellers.length > 0 ? (
              sellers.map((seller) => (
                <tr key={seller._id} className="border-t">
                  <td className="py-3 px-4">{seller.email}</td>
                  <td className="py-3 px-4">{seller.username}</td>
                  <td className="py-3 px-4 text-center">
                    {seller.verified ? (
                      <CheckCircle className="text-green-500 inline" />
                    ) : (
                      <Info className="text-gray-400 inline" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {new Date(seller.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      // onClick={() => confirmDelete(seller._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-gray-500">
                  <div className="flex items-center justify-center h-24">
                    No sellers found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
