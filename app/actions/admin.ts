"use server";

import axios from "axios";

export type Errors = {
  reason?: string;
};

export type FormState = {
  errors: Errors;
  success?: string;
  error?: string;
};

export async function RejectMessage(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {}
