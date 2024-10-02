import React from "react";
import Image from "next/image";

interface ServiceData {
  service: {
    cover: string;
    title: string;
  };
  date: {
    mode: string;
    start: string;
  };
  status: string;
  provider?: {
    _id: string;
    avatar: string;
    firstName: string;
    lastName: string;
  };
}

const ServiceStatusCard = ({ serviceData }: { serviceData: ServiceData }) => {
  return (
    <div className="w-full bg-white shadow rounded-lg overflow-hidden border">
      <div className="flex">
        <div className="w-1/4">
          <Image
            src={serviceData.service.cover}
            alt={serviceData.service.title}
            width={640}
            height={640}
            className="rounded-l-lg w-full h-full object-cover"
          />
        </div>
        <div className="p-3 w-2/4">
          <h3 className="text-xl font-semibold">{serviceData.service.title}</h3>
          <div className="mt-1 text-sm text-gray-500">
            <span className="inline-block bg-gray-200 px-2 py-1 rounded">
              {serviceData.date.mode.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center mt-1 text-gray-600">
            <span className="mr-2 text-sm">
              <i className="fas fa-clock"></i>{" "}
              {new Date(serviceData.date.start).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="w-1/4 p-4 flex flex-col justify-between items-end">
          <div>
            <span
              className={`px-3 py-1 rounded-full ${
                serviceData.status === "REJECTED"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {serviceData.status}
            </span>
          </div>
          <div>
            {serviceData.provider?.firstName && (
              <div className="flex items-center">
                {serviceData.provider?.avatar ? (
                  <Image
                    src={serviceData.provider.avatar}
                    alt={serviceData.provider.firstName}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : null}
                <span className="ml-2 text-sm">
                  {serviceData.provider.firstName}{" "}
                  {serviceData.provider?.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonServiceStatusCard = () => {
  return (
    <div className="w-full bg-white shadow rounded-lg overflow-hidden border animate-pulse">
      <div className="flex">
        {/* Skeleton for Image */}
        <div className="w-1/4 bg-gray-200 h-32"></div>

        {/* Skeleton for Details */}
        <div className="p-3 w-2/4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="flex items-center mt-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        {/* Skeleton for Status and Provider */}
        <div className="w-1/4 p-4 flex flex-col justify-between items-end">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex items-center">
            <div className="rounded-full bg-gray-200 h-6 w-6"></div>
            <div className="ml-2 h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ServiceStatusCard, SkeletonServiceStatusCard };
