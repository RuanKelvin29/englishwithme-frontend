"use client";

import React from "react";
import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

export default function VocabularyPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center transform transition-all hover:scale-[1.01]">
        
        <div className="mx-auto w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
          <Construction className="text-orange-500 w-12 h-12" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Coming Soon
        </h1>

        <p className="text-gray-500 mb-8 text-lg leading-relaxed">
          Chức năng này đang trong quá trình thực hiện, bạn hãy đợi nhé! 
          <br />
          <span className="text-sm text-gray-400 mt-2 block">
            (We are working hard to bring this feature to life)
          </span>
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-1 transition-all duration-200"
        >
          <ArrowLeft size={20} />
          Return
        </Link>

      </div>
    </section>
  );
}