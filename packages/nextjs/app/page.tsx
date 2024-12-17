"use client";

import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex items-center justify-center flex-col flex-grow pt-10 gap-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-4xl">Register your Business</h1>
        <span>And start receiving payments instantly!</span>
      </div>
      <Link href="/business" className="btn btn-primary">
        Register
      </Link>
    </div>
  );
};

export default Home;
