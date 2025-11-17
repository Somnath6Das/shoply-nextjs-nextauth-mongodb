"use client";

import { FormState, AcceptMessage } from "@/app/actions/admin";
import Form from "next/form";
import { useParams, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Accept() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialState: FormState = {
    errors: {},
  };
  const acceptMsgWIthId = AcceptMessage.bind(null, params.id as string);

  const [state, formAction, isPending] = useActionState(
    acceptMsgWIthId,
    initialState
  );

  return (
    <Form action={formAction}>
      <div className="flex items-center mb-3.5">
        <Link
          href="/admin/dashboard"
          className="bg-gray-200 rounded-full p-1 mr-2"
        >
          <ArrowLeft />
        </Link>
        <label className="flex font-medium gap-2 text-[20px]">
          Do you want to add
          <div className="text-blue-500 font-bold">
            {searchParams.get("seller")}
          </div>
          as a seller?
        </label>
      </div>
      <div className="ml-10 mt-8">
        <div className="flex w-80 h-12 space-x-2">
          <button
            onClick={() => router.back()}
            disabled={isPending}
            className="w-full  text-black py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium hover:bg-[#efefef] border-2 border-[#d4d3d3] hover:border-[#efefef]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#3b5ae4] text-white py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium hover:bg-[#1033cf]"
          >
            Submit
          </button>
        </div>
        <div className="flex w-2xl justify-start items-center mt-2">
          {state.success && (
            <p className="flex  text-green-500 font-medium">{state.success}</p>
          )}
          {state.error && (
            <p className="flex  text-red-500 font-medium">{state.error}</p>
          )}
        </div>
      </div>
    </Form>
  );
}
