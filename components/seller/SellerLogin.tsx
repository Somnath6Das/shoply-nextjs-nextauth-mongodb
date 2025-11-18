import Link from "next/link";

export default function SellerLogin() {
  return (
    <form className="space-y-4 w-full">
      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base
                                        focus:outline-none focus:ring-2 focus:ring-[#5e3e89]"
        />
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base
                                        focus:outline-none focus:ring-2 focus:ring-[#5e3e89]"
        />
      </div>
      {/* <button
          type="submit"
          //   disabled={isPenging}
          className={`w-full flex justify-center items-center gap-2 bg-[#5e3e89] text-white py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium ${
            isPenging ? "opacity-60 cursor-not-allowed" : "hover:bg-[#392655]"
          }`}
        >
          {isPenging ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button> */}

      <div className="text-center">
        <Link
          href="/seller/forget-password"
          className="text-sm sm:text-base text-[#5e3e89] hover:underline hover:text-[#392655] transition"
        >
          Forgot Password?
        </Link>
      </div>
    </form>
  );
}
