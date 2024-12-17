import { StrapiCurrentUserT } from "@/types/strapi/StrapiCurrentUserT";
import fetcher from "./fetcher";
import { StrapiUserT } from "@/types/strapi/User";

export async function getCurrentUser(token: string) {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["strapi-users-me"] },
  };
  const user: StrapiUserT = await fetcher("/auth/me", {}, options);
  return user;
}
