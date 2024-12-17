import Link from "next/link";
import GoogleSignInButton from "./GoogleSignInButton";
import { getServerSession } from "next-auth";
import GoogleSignInError from "./GoogleSignInError";
import SignInForm from "./SignInForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import Hero from "./Hero";

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <div className="">
      {session ? (
        <p className="text-center">You are already signed in.</p>
      ) : (
        <div className=" ">
          <Hero />
          <div className="">
            <div className="container">
              <h2 className="text-center  text-3xl">Objectives</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-center">
                <div className="bg-white rounded-md hover:shadow-lg hover:shadow-red-100 transition-all duration-300">
                  <div className="p-10 py-14 ">
                    Strengthen conservation efforts in Al-Shumari and Al-Dahek
                    reserves to preserve biodiversity and protect natural
                    ecosystems.
                  </div>
                </div>
                <div className="bg-white rounded-md hover:shadow-lg hover:shadow-green-100 transition-all duration-300">
                  <div className="p-10 py-14 ">
                    Improve the visitor experience and boost the tourism
                    potential of Al-Shumari and Al-Dahek reserves, making them
                    attractive and sustainable ecotourism locations.
                  </div>
                </div>
                <div className="bg-white rounded-md hover:shadow-lg 1hover:shadow-black-100 transition-all duration-300">
                  <div className="p-10 py-14 ">
                    Build the capacity of local communities to actively protect
                    the reserves and develop sustainable livelihood
                    opportunities.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
