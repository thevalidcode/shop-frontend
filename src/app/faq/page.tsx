"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const FAQPage = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(2);

  const faqItems = [
    {
      id: 1,
      question: "How can I contact a vendor",
      answer:
        "How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor",
    },
    {
      id: 2,
      question: "How can I contact a vendor",
      answer:
        "How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor",
    },
    {
      id: 3,
      question: "How can I contact a vendor",
      answer:
        "How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor How can I contact a vendor",
    },
    {
      id: 4,
      question: "How do I open a Store",
      answer:
        "How do I open a Store How do I open a Store How do I open a Store How do I open a Store How do I open a Store How do I open a Store",
    },
  ];

  const toggleItem = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5 border-b">
        <ArrowLeft className="text-gray-800" />
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          FAQ's
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* FAQ Items */}
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div key={item.id} className="bg-validPurple/10 rounded-xl">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-gray-800 font-medium">
                  {item.question}
                </span>
                {expandedItem === item.id ? (
                  <ChevronUp className="text-gray-600" size={20} />
                ) : (
                  <ChevronDown className="text-gray-600" size={20} />
                )}
              </button>

              {expandedItem === item.id && (
                <div className="px-4 pb-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="flex items-center justify-end gap-2 mt-6">
          <span className="text-validPurple underline cursor-pointer">
            view more
          </span>
          <ExternalLink className="text-validPurple" size={16} />
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
