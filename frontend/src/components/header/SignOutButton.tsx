"use client";

import { IconLogout2 } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      className="w-full text-left py-2 px-2 flex items-center gap-2"
      onClick={() => signOut()}
    >
      <IconLogout2 size={18} />
      Sign out
    </button>
  );
}
