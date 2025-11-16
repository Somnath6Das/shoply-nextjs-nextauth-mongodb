"use client";

import { FormState, RejectMessage } from "@/app/actions/admin";
import Form from "next/form";
import { useParams, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Reject() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialState: FormState = {
    errors: {},
  };
  const rejectMsgWIthId = RejectMessage.bind(null, params.id as string);

  const [state, formAction, isPending] = useActionState(
    rejectMsgWIthId,
    initialState
  );

  return (
    <Form action={formAction}>
      <div className="flex items-center mb-3.5 space-x-2">
        <Link href="/admin/dashboard" className="bg-gray-200 rounded-full p-1">
          <ArrowLeft />
        </Link>
        <label className="flex text-sm sm:text-base font-medium">
          Please give Reason of rejecting
        </label>
        <div className="text-blue-500 font-bold">
          {searchParams.get("seller")}
        </div>
      </div>
      <div className="ml-10">
        <div className="space-y-2.5 mb-2">
          <textarea
            name="reason"
            placeholder="Enter the reason"
            rows={2}
            className="w-2xl border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5472f7] resize-none"
          />
          {state.errors.reason && (
            <p className="text-red-500 text-sm">{state.errors.reason}</p>
          )}
        </div>
        <div className="flex w-2xl space-x-2">
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
        <div className="flex w-2xl justify-center mt-2">
          {state.success && (
            <p className="flex justify-center items-center text-green-500 font-medium">
              {state.success}
            </p>
          )}
          {state.error && (
            <p className="flex justify-center items-center text-red-500 font-medium">
              {state.error}
            </p>
          )}
        </div>
      </div>
    </Form>
  );
}
