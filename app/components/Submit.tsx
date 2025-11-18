"use client";

import { useFormStatus } from "react-dom";

export const Submit = ({ styles }: { styles: string }) => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={styles}>
      Submit
    </button>
  );
};
