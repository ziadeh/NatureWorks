"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function RefetchPage() {
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return <div></div>;
}

export default RefetchPage;
