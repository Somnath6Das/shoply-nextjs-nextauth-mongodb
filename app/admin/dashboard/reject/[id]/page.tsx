"use client";

import { FormState, RejectMessage } from "@/app/actions/admin";
import Form from "next/form";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

export default function Reject() {
  const params = useParams();
  const router = useRouter();
  const initialState: FormState = {
    errors: {},
  };
  const rejectMsgWIthId = RejectMessage.bind(null, Number(params.id ?? 0));

  const [state, formAction, isPending] = useActionState(
    rejectMsgWIthId,
    initialState
  );

  return (
    <Form action={formAction}>
      <div className="space-y-2.5 mb-2">
        <label className="block text-sm sm:text-base font-medium">
          Please give Reason
        </label>
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

      {state.success && (
        <p className="flex justify-center text-green-500 font-medium">
          {state.success}
        </p>
      )}
      {state.error && (
        <p className="flex justify-center text-red-500 font-medium">
          {state.error}
        </p>
      )}
    </Form>
  );
}
