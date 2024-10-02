import { GetMultiServicesDTO } from "@tanbel/homezz/types";
import { Button } from "@tanbel/react-ui";
import Image from "next/image";
import Link from "next/link";

const ServiceCard = ({ service }: { service: GetMultiServicesDTO }) => {
  const { title, description, cover } = service;

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg flex flex-col justify-between border">
      <Image
        className="w-full object-cover"
        width={480}
        height={200}
        src={cover}
        alt="service cover"
      />
      <div className="p-4 flex-grow">
        <h2 className="font-bold text-xl mb-2">{title}</h2>
        <p className="text-gray-700 text-base line-clamp-3">
          {description.slice(0, 220) + "..."}
        </p>
      </div>
      <div className="p-4">
        <Link href={`/services/${service._id}`}>
          <Button size="middle" block>
            Request for free quote
          </Button>
        </Link>
      </div>
    </div>
  );
};

const ServiceCardSkeleton = () => {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg flex flex-col justify-between border animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4 flex-grow">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

export { ServiceCard, ServiceCardSkeleton };
