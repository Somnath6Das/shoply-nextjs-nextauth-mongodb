"use server";

import axios from "axios";

export type Errors = {
  email?: string;
  sellerName?: string;
  message?: string;
};

export type FormState = {
  errors: Errors;
  success?: string;
  error?: string;
};

export async function sellerMsg(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;
  const sellerName = formData.get("sellerName") as string;
  const message = formData.get("message") as string;

  const errors: Errors = {};
  if (!email) {
    errors.email = "Email is required!";
  }
  if (!sellerName) {
    errors.sellerName = "Seller name is required!";
  }
  if (!message) {
    errors.message = "Message is required!";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller-msg`,
      { email, sellerName, message },
      { validateStatus: () => true } // don’t throw on 400+
    );

    if (res.status === 201) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (err: unknown) {
    console.error("Server Action Error:", err);
    return { errors: {}, error: "Server error. Try later." };
  }
}
export type PasswordErrors = {
  password?: string;
  confirmPassword?: string;
  metchPassword?: string;
};
export type PasswordState = {
  errors: PasswordErrors;
  success?: string;
  error?: string;
};

//seller set password
export async function SetPassword(
  id: string,
  prevState: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: PasswordErrors = {};
  if (!password) {
    errors.password = "Password is required!";
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Password is required!";
  }
  if (password !== confirmPassword) {
    errors.metchPassword = "Password did not match!";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller-verified`,
      { id, password },
      { validateStatus: () => true } // don’t throw on 400+
    );
    console.log("API Response:", res.status, res.data);
    if (res.status === 200) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (err) {
    console.error("Server Action Error:", err);
    return { errors: {}, error: "Server error. Try later." };
  }
}
