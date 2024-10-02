import React from "react";
import { ServiceCardGridLayout } from "../../components/pages/services";

const ServicePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-2">
      <h2 className="text-3xl text-gray-700 my-4 border-b-2 text-center mb-10 border-gray-600">
        Services
      </h2>
      <ServiceCardGridLayout />
    </div>
  );
};

export default ServicePage;
