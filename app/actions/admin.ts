"use server";

import axios from "axios";
import { redirect } from "next/navigation";

export type Errors = {
  reason?: string;
};

export type FormState = {
  errors: Errors;
  success?: string;
  error?: string;
};

export async function RejectMessage(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const reason = formData.get("reason") as string;

  const errors: Errors = {};
  if (!reason) {
    errors.reason = "Reason is required!";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller-msg/reject`,
      { id, reason },
      { validateStatus: () => true } // don’t throw on 400+
    );
    if (res.status === 201) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (err) {
    console.error("Server Action Error:", err);
    return { errors: {}, error: "Server error. Try later." };
  }
}
export async function AcceptMessage(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller-msg/accept`,
      { id },
      { validateStatus: () => true } // don’t throw on 400+
    );
    if (res.status === 201) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (err) {
    console.error("Server Action Error:", err);
    return { errors: {}, error: "Server error. Try later." };
  }
}
export async function DeleteMessage(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller-msg/delete`,
      { id },
      { validateStatus: () => true } // don’t throw on 400+
    );
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

export async function DeleteSeller(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/delete-seller`,
      { id },
      { validateStatus: () => true } // don’t throw on 400+
    );

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
