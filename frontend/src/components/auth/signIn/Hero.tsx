import Image from "next/image";
import Link from "next/link";
import React from "react";
import SignInForm from "./SignInForm";

function Hero() {
  return (
    <section className=" dark:bg-gray-900">
      <div className="bg-white py-3">
        <div className="container">
          <div className="grid grid-cols-3 items-center">
            <div>
              <Image
                src="/images/Kingdom-of-the-Netherlands.png"
                width={200}
                height={100}
                alt=""
                className="mx-auto"
              />
            </div>
            <div>
              <Image
                src="/images/leaders_international_logo.jpg"
                width={200}
                height={100}
                alt=""
                className="mx-auto"
              />
            </div>
            <div className="h-24">
              <Image
                src="/images/rscn-logo.png"
                width={200}
                height={100}
                alt=""
                className="mx-auto object-contain h-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
        <div className="col-span-12">
          <h1 className="bg-gradient-to-r from-orange-600 via-blue-500 to-yellow-400 inline-block text-transparent bg-clip-text max-w-screen-xl mx-auto text-center pb-2 mb-20 text-4xl font-extrabold leading-none tracking-tight md:text-5xl dark:text-white">
            <small className="block mb-4">NatureWorks:</small>
            Promoting Sustainable Development in Jordan’s Eastern Badia Region
          </h1>
        </div>
        <div className="mr-auto place-self-center col-span-12 mx-auto lg:col-span-7 flex-1 px-0 lg:px-20">
          <p className="max-w-2xl mb-6 font-light text-black text-justify lg:mb-8  dark:text-gray-400">
            The "NatureWorks" project is aimed at enhancing sustainable
            development in Jordan's Eastern Badia region. Focused on
            conservation, tourism, and community empowerment, the project
            strengthens efforts to preserve biodiversity in the Al-Shumari and
            Al-Dahek reserves. By addressing ecological challenges and promoting
            sustainable tourism, it ensures lasting positive impacts on the
            environment and local economies. The project also empowers local
            communities, creating new opportunities for economic growth and job
            creation. Ultimately, "NatureWorks" positions Jordan as a leading
            ecotourism destination while protecting the region’s natural
            heritage for future generations.
          </p>
          <div>
            <SignInForm />
          </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex shadow-2xl shadow-black/5 bg-white rounded overflow-hidden">
          <Image
            src="/images/banner-2.jpg"
            width={808}
            height={675}
            className=" object-cover rounded "
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
