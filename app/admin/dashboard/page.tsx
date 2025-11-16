// app/admin/messages/page.tsx (server component)
import SellerMsg from "@/models/SellerMsg";
import { connectToDatabase } from "@/lib/db";
import { Loader2, Trash2, UserRoundCheck, UserRoundX } from "lucide-react";

export default async function MessagesPage() {
  await connectToDatabase();

  const messages = await SellerMsg.find().sort({ createdAt: -1 });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Messages</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Seller Name</th>
              <th className="p-3 border">Message</th>
              <th className="p-3 border text-center">Accept</th>
              <th className="p-3 border text-center">Reject</th>
              <th className="p-3 border text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {!messages ? (
              <tr>
                <td colSpan={4} className="text-center p-6">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin text-blue-500" />
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="flex p-4 text-gray-500">
                  No messages found
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{msg.email}</td>
                  <td className="p-3 border">{msg.sellerName}</td>
                  <td className="p-3 border">{msg.message}</td>
                  <td className="p-3 border text-center">
                    <button
                      //    onClick={() => handleAccept(msg._id)}
                      className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
                      title="Accept"
                    >
                      <UserRoundCheck className="text-green-600 w-5 h-5" />
                    </button>
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      // onClick={() => handleRejectClick(msg._id)}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                      title="Reject"
                    >
                      <UserRoundX className="text-red-600 w-5 h-5" />
                    </button>
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      //  onClick={() => handleDelete(msg._id)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                      title="Delete"
                    >
                      <Trash2 className="text-gray-700 w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {/* {showRejectModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Reject Seller
            </h2>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-red-300 outline-none"
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={handleRejectSubmit}
                disabled={loading || !rejectReason.trim()}
                className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 transition ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </button>

              <button
                onClick={() => setShowRejectModal(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
      {/* Delete Confirmation Modal */}
      {/* {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Delete Message
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 transition ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
