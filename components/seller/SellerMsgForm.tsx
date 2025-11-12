import { msgAction } from "@/app/functions/seller";

export default function SellerMsgForm() {
  return (
    <form action={msgAction} className="space-y-4 w-full max-w-md mx-auto p-4">
      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5cca01]"
          required
        />
      </div>

      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Seller Name
        </label>
        <input
          name="sellerName"
          type="text"
          placeholder="Enter your seller name"
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5cca01]"
          required
        />
      </div>

      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Message
        </label>
        <textarea
          name="message"
          placeholder="Enter your message"
          rows={2}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5cca01] resize-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#5cca01] text-white py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium hover:bg-green-700"
      >
        Send a Message
      </button>
    </form>
  );
}
