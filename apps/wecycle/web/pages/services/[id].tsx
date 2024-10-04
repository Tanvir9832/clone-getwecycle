import { get_service, get_services } from "@tanbel/homezz/http-client";
import { type GetMultiServicesDTO } from "@tanbel/homezz/types";
import Image from "next/image";
import dynamic from "next/dynamic";
const RequestQuoteForm = dynamic(
  () =>
    import("../../components/pages/services/RequestQuoteForm").then(
      (mod) => mod.RequestQuoteForm
    ),
  { ssr: false }
);

const BookService = ({ service }: { service: GetMultiServicesDTO }) => {
  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-5 h-[calc(100vh-200px)] flex justify-center items-center">
        <p className="text-4xl text-center my-10">Service not found</p>
      </div>
    );
  }

  const { _id, title, description, cover, priceInputs: customInputs } = service;

  return (
    <div className="max-w-7xl mb-10 mx-auto sm:px-5 px-4">
      <section className="px-2">
        <p className="my-6 font-bold text-4xl text-center">{title}</p>
        <div className="p-2 grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="col-span-2">
            <Image
              width={680}
              height={400}
              className="object-cover w-full"
              src={cover}
              alt="service"
            />

            <p className="text-xl my-12">{description}</p>
          </div>
          <div className="col-span-1">
            <RequestQuoteForm _id={_id} customInputs={customInputs} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookService;

export async function getServerSideProps(context: any) {
  const { query } = context;
  const serviceId = query.id;
  if (serviceId) {
    try {
      const res = await get_service(serviceId);
      return {
        props: {
          service: res,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        props: {
          service: null,
        },
      };
    }
  } else {
    return {
      props: {
        service: null,
      },
    };
  }
}
