"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    toast.error(error?.message ? error?.message : "Something went wrong!");
  }, [error]);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="mx-auto max-w-screen-md border border-zinc-50 bg-white p-10">
        <h1 className="text-center text-2xl font-semibold mb-2">Error!</h1>
        <p className="text-lg">
          {error?.message
            ? error?.message.split(":")[1]
            : "Something went wrong!"}
        </p>
        <Button
          className="mx-auto mt-4 block"
          variant="secondary"
          onClick={() => router.push("/")}
        >
          Back
        </Button>
      </div>
      {/* <h2>Something went wrong!</h2>
      <p>Root error: {error.message}</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button> */}
      <Toaster />
    </div>
  );
}
