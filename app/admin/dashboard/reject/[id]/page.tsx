"use client";

import { FormState, RejectMessage } from "@/app/actions/admin";
import { useParams } from "next/navigation";
import { useActionState } from "react";

export default function Reject() {
  const params = useParams();
  const initialState: FormState = {
    errors: {},
  };
  const rejectMsgWIthId = RejectMessage.bind(null, Number(params.id ?? 0));

  const [state, formAction, isPending] = useActionState(
    rejectMsgWIthId,
    initialState
  );

  return <div>{params.id}</div>;
}
