"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";

 
export default function HomePage() {
  const router = useRouter();
  const [active, setActive] = useState(0);

 
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6  md:grid-cols-[1.05fr_0.95fr] md:py-24">
        {/* Left: copy + CTA */}
        <div>
          <h1
            className={`mb-6 text-5xl font-extrabold leading-[0.98] tracking-tight text-[#2D5CAB] sm:text-6xl lg:text-7xl`}
          >
            Your event deserves a poster people stop for.
          </h1>
 
          <p className="mb-8 max-w-md text-lg text-slate-600">
            Tell PosterLab what you&apos;re planning. Get a finished poster in
            seconds, ready to print or post.
          </p>
 
          <div
            role="group"
            aria-label="Choose an event type"
            className="mb-8 flex flex-wrap gap-2"
          >
           
          </div>
 
          <button
            type="button"
            onClick={() => router.push("/account")}
            className="rounded-xl bg-[#2D5CAB] px-8 py-4 text-lg font-bold text-white shadow-[5px_5px_0_#10244A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#274f94] hover:shadow-[3px_3px_0_#10244A] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5CAB] motion-reduce:transition-none"
          >
            Generate poster
          </button>
          <p className="mt-4 text-sm text-slate-500">
            Free to start. No design skills needed.
          </p>
        </div>
 
        {/* Right: poster stack */}
        <div
          aria-hidden="true"
          className="relative mx-auto h-[500px] w-full max-w-[420px] md:h-[560px] md:max-w-none"
        >
          {/* Back left */}
          <div className="absolute left-0 top-12 flex h-[330px] w-[230px] -rotate-[9deg] flex-col justify-between overflow-hidden rounded-md border-[3px] border-[#10244A] bg-[#FFC93C] p-5 shadow-[8px_8px_0_#10244A] md:h-[420px] md:w-[300px]">
            <span className={`text-4xl font-extrabold leading-[0.95] tracking-tight text-[#10244A]`}>
              Bake
              <br />
              Sale
            </span>
            <div className="h-16 bg-[repeating-linear-gradient(90deg,#10244A_0_10px,transparent_10px_20px)]" />
            <span className="text-sm font-bold text-[#10244A]">Sat · Town Hall</span>
          </div>
 
          {/* Back right */}
          <div className="absolute right-0 top-0 flex h-[330px] w-[230px] rotate-[7deg] flex-col justify-between overflow-hidden rounded-md border-[3px] border-[#10244A] bg-[#DCE6F7] p-5 shadow-[8px_8px_0_#10244A] md:h-[420px] md:w-[300px]">
            <span className={` text-4xl font-extrabold leading-[0.95] tracking-tight text-[#2D5CAB]`}>
              Jazz
              <br />
              in the
              <br />
              Park
            </span>
            <div className="relative h-28 w-28 self-end rounded-full bg-[#2D5CAB]">
              <div className="absolute inset-9 rounded-full bg-[#FFC93C]" />
            </div>
            <span className="text-sm font-bold text-[#2D5CAB]">Free entry</span>
          </div>
 
         
        </div>
      </section>
    </main>
  );
}
 