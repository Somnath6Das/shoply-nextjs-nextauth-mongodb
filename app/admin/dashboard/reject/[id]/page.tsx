"use client";

import { useParams } from "next/navigation";

export default function Reject() {
  const params = useParams();
  console.log(params.id);
  return <div>{params.id}</div>;
}
