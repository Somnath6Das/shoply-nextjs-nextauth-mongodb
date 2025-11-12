"use server";

import axios from "axios";

export async function msgAction(formData: FormData) {
  const email = formData.get("email") as string;
  const sellerName = formData.get("sellerName") as string;
  const message = formData.get("message") as string;

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller-msg`,
      { email, sellerName, message },
      { validateStatus: () => true } // don’t throw on 400+
    );

    if (res.status === 201) {
      return { success: res.data.message };
    } else {
      return { error: res.data.error || "Something went wrong" };
    }
  } catch (err: any) {
    console.error("Server Action Error:", err.message);
    return { error: "Server error, please try again later" };
  }
}
