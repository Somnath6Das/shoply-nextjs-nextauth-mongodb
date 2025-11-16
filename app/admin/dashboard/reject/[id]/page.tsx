"use client";

import { FormState, RejectMessage } from "@/app/actions/admin";
import { useParams } from "next/navigation";
import { useActionState } from "react";

export default function Reject() {
  const initialState: FormState = {
    errors: {},
  };
  const [state, formAction, isPending] = useActionState(
    RejectMessage,
    initialState
  );
  const params = useParams();

  return <div>{params.id}</div>;
}
