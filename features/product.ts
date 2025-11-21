import { capitalizeWords } from "@/utils/capitalizeWords";
import axios from "axios";

export async function createProductAction(formData: {
  name: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  options: { name: string; values: string[] }[];
  variants: {
    combination: any;
    price: string;
    stock: string;
    images: string[];
  }[];
  allImages: string[];
}) {
  const {
    name,
    description,
    mainCategory,
    subCategory,
    options,
    variants,
    allImages,
  } = formData;

  const formattedMain = capitalizeWords(mainCategory);
  const formattedSub = capitalizeWords(subCategory);

  try {
    const res = await axios.post(
      `/api/products/create`,
      {
        name,
        description,
        category: { main: formattedMain, sub: formattedSub },
        options,
        variants,
        allImages,
      },
      { withCredentials: true }
    );

    return res.data;
  } catch (error: any) {
    console.error("Create product error:", error);
    throw new Error(error.response?.data?.error || "Failed to create product");
  }
}
