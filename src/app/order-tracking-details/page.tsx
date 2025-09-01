import React from "react";
import {
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderTrackingDetailsPage = () => {
  const timelineSteps = [
    {
      id: 1,
      title: "Order Complete",
      date: "Completed June 12, 2025",
      icon: <Check className="text-white" size={16} />,
      status: "completed",
    },
    {
      id: 2,
      title: "Picked Up By Rider",
      date: "In Transit - June 10, 2025",
      icon: <User className="text-white" size={16} />,
      status: "in-progress",
    },
    {
      id: 3,
      title: "Waiting For Pick Up",
      date: "In Transit - June 04, 2025",
      icon: <Clock className="text-white" size={16} />,
      status: "in-progress",
    },
    {
      id: 4,
      title: "Payment Confirmed",
      date: "In Transit - June 04, 2025",
      icon: <CreditCard className="text-white" size={16} />,
      status: "in-progress",
    },
  ];

  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5 border-b">
        <ArrowLeft className="text-gray-800" />
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          Order Tracking
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Map Section */}
        <div className="h-48 bg-gray-100 relative">
          {/* Placeholder for map */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Map View
          </div>
          {/* Red route line placeholder */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>

        {/* Delivery Person Card */}
        <div className="bg-validPurple/10 rounded-xl mx-5 my-4 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-gray-800 font-medium">Delivery Man 1</h3>
              <p className="text-gray-800 font-bold">$40</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-validPurple/20 rounded-full flex items-center justify-center">
              <Mail className="text-validPurple" size={20} />
            </button>
            <button className="w-10 h-10 bg-validPurple rounded-full flex items-center justify-center">
              <Phone className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-5 pb-4">
          <div className="space-y-4">
            {timelineSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-validPurple"
                        : "bg-validPurple/20"
                    }`}
                  >
                    {step.icon}
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-800 font-medium">{step.title}</h4>
                  <p className="text-gray-500 text-sm">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 border-t bg-white">
        <Button className="w-full bg-validPurple py-5 rounded-full text-lg text-white font-medium mb-3">
          Confirm Delivery
        </Button>
        <span className="text-validPurple underline text-center block cursor-pointer">
          Contact Vendor
        </span>
      </div>
    </div>
  );
};

export default OrderTrackingDetailsPage;
