"use server";
import { revalidatePath } from "next/cache";
import { capitalizeWords } from "@/utils/capitalizeWords";
import axios from "axios";

export async function addMainCategory(formData: FormData) {
  const mainCategory = formData.get("main") as string;
  if (!mainCategory) return;
  const formattedMain = capitalizeWords(mainCategory);
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories/add-main`,
      {
        main: formattedMain,
      },
      { validateStatus: () => true }
    );
    revalidatePath("/seller/dashboard/categories");
  } catch (err) {
    console.log(err);
  }
}

export async function deleteMainCategory(formData: FormData) {
  const catId = formData.get("catId") as string;
  if (!catId) return;

  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories/delete`,
      {
        data: { catId }, // 👈 DELETE requires data inside "data"
        validateStatus: () => true,
      }
    );

    revalidatePath("/seller/dashboard/categories");
  } catch (err) {
    console.log(err);
  }
}
