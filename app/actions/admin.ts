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
  id: number,
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
  } catch (error) {}
}
