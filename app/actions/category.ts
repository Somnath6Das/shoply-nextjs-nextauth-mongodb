"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { capitalizeWords } from "@/utils/capitalizeWords";

// ⭐ ADD MAIN CATEGORY
export async function addMainCategory(formData: FormData) {
  const main = formData.get("main") as string;
  if (!main) return;

  const formatted = capitalizeWords(main);

  await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,
    { main: formatted }
  );

  revalidatePath("/seller/dashboard/categories");
}

// ⭐ DELETE MAIN CATEGORY
export async function deleteMainCategory(formData: FormData) {
  const main = formData.get("main") as string;
  if (!main) return;

  await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,
    { data: { main } }
  );

  revalidatePath("/seller/dashboard/categories");
}

// ⭐ ADD SUB
export async function handleAddSub(main: string, sub: string) {
  const formattedMain = capitalizeWords(main);
  const formattedSub = capitalizeWords(sub);

  await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,
    { main: formattedMain, sub: formattedSub }
  );

  revalidatePath("/seller/dashboard/categories");
}

// ⭐ DELETE SUB
export async function handleDeleteSub(main: string, sub: string) {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,
    { data: { main, sub } }
  );

  revalidatePath("/seller/dashboard/categories");
}
