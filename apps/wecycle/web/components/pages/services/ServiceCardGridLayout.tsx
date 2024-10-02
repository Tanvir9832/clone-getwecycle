import { get_services } from "@tanbel/homezz/http-client";
import { GetMultiServicesDTO } from "@tanbel/homezz/types";
import { useHttp } from "../../../hook/useHttp";
import React, { useEffect, useState } from "react";
import { ServiceCard, ServiceCardSkeleton } from "../Home/Services";

export function ServiceCardGridLayout({ limit }: { limit?: number }) {
  const [services, setServices] = useState<GetMultiServicesDTO[]>([]);
  const { request: serviceRequest } = useHttp<GetMultiServicesDTO[]>(() => {
    return get_services(limit ? { limit } : {});
  });

  useEffect(() => {
    serviceRequest().then((data: GetMultiServicesDTO[]) => {
      setServices(data);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 pb-11 gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
      {services.length
        ? services.map((data) => <ServiceCard service={data} key={data._id} />)
        : Array.from(Array(limit || 9).keys()).map((i) => (
            <ServiceCardSkeleton key={i} />
          ))}
    </div>
  );
}
