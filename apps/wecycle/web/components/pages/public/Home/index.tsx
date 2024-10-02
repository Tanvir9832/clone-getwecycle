/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { Player as LottiePlayer } from "@lottiefiles/react-lottie-player";
import { BlogCard } from "@tanbel/homezz/components";
import { get_all_blog, get_services } from "@tanbel/homezz/http-client";
import { GetBlogDTO, GetMultiServicesDTO } from "@tanbel/homezz/types";
import { Button } from "@tanbel/react-ui";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import stepOne from "../../../../assets/lotties/step-one.json";
import stepThree from "../../../../assets/lotties/step-three.json";
import stepTwo from "../../../../assets/lotties/step-two.json";
import servicePng from "../../../../assets/Services.png";
import { useHttp } from "../../../../hook/useHttp";
import HeroSection from "../../Home/Hero";
import { ServiceCard, ServiceCardSkeleton } from "../../Home/Services";

const PublicHome = () => {
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [services, setServices] = useState<GetMultiServicesDTO[]>([]);
  const { request: serviceRequest } = useHttp<GetMultiServicesDTO[]>(() => {
    return get_services();
  });

  useEffect(() => {
    serviceRequest().then((data: GetMultiServicesDTO[]) => {
      setServices(data);
    });
  }, []);
  const router = useRouter();
  const limit = 3;
  const { data: blogs, request } = useHttp<GetBlogDTO[]>(() =>
    get_all_blog(limit)
  );

  useEffect(() => {
    request();
  }, []);

  const gotoBlogsPage = () => {
    router.push(`/blog/`);
  };

  return (
    <>
      <section className="Hero_section min-h-[calc(100vh-100px)] flex justify-center items-center">
        <HeroSection />
      </section>
      <section className="Service_section my-24 lg:my-20">
        <h2 className="font-bold my-9 text-3xl">Trending Services</h2>
        <Swiper
          onSwiper={setSwiper}
          loop={true}
          slidesPerView={1}
          spaceBetween={10}
          navigation={true}
          // centeredSlides={true}
          // pagination={{
          //   type: "fraction",
          // }}
          breakpoints={{
            540: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {services.length
            ? services?.map((service) => (
                <SwiperSlide key={service?._id}>
                  <ServiceCard service={service} />
                </SwiperSlide>
              ))
            : Array.from(Array(9).keys()).map((i) => (
                <SwiperSlide key={i}>
                  <ServiceCardSkeleton />
                </SwiperSlide>
              ))}
        </Swiper>
        <div className="mt-6 w-full flex items-center justify-center">
          <Link href="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </section>
      <section className="why_homezz_section mb-10 mt-20  md:mb-16">
        <div className="service_section mx-auto text-center">
          <p className="text-primary my-3 ">AT A GLANCE</p>
          <h2 className="font-bold text-4xl">
            Why{" "}
            <span className="font-sans">
              We<span className="text-primary">Cycle</span>
            </span>
          </h2>
          <p className=" text-xl text-gray-500 w-full md:w-1/2 my-3 mx-auto">
            Save precious time for what truly matters. Whether it's spending
            quality moments with loved ones or pursuing personal hobbies, our
            website gives you the gift of time. Embrace a clutter-free,
            immaculate home without lifting a finger.
          </p>
        </div>
        <div className="service_section my-10 md:my-16 flex flex-col md:flex-row justify-between gap-8 md:gap-20 items-center">
          <div className=" w-full md:w-1/2 lg:w-6/12">
            <Image
              className="h-auto w-full "
              src={servicePng}
              alt="banner"
              height={600}
            />
          </div>
          <div className="w-full md:ms-28 md:w-1/2 lg:w-6/12">
            <h2 className="text-bold">Junk Removal Rethinked</h2>
            <div className="flex gap-7 my-7 items-center">
              <p className="bg-[#6BC787] p-3 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="w-6 h-6 text-white text-3xl font-bold"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                  />
                </svg>
              </p>
              <h3>Convenient</h3>
            </div>
            <div className="flex gap-7 my-7 items-center">
              <p className="bg-[#6BC787] p-3 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="w-6 h-6 text-white text-3xl font-bold"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </p>
              <h3>Safe</h3>
            </div>
            <div className="flex gap-7 my-7 items-center">
              <p className="bg-[#6BC787] p-3 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="w-6 h-6 text-white text-3xl font-bold"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                  />
                </svg>
              </p>
              <h3>Budget friendly</h3>
            </div>
          </div>
        </div>
        {/* <div className="benefit_section my-10 md:my-16 flex flex-col md:flex-row justify-between gap-8 md:gap-20 items-center">
            <div className="text_benefit w-full md:w-1/2 lg:w-7/12">
              <h2 className="font-bold text-4xl">Benefits you will get</h2>
              <div className="flex items-center my-7  gap-5">
                <span className="bg-[#6BC787] p-3 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    fill="none"
                    className="w-6 h-6 text-white text-3xl font-bold"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                </span>

                <div>
                  <h3>Single Hub: Track progress from anywhere</h3>
                  <p className="text-gray-500">
                    Your Gateway to Effortless Home transformation and
                    maintenance from a single place
                  </p>
                </div>
              </div>
              <div className="flex items-center my-7  gap-5">
                <span className="bg-[#6BC787] p-3 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="w-6 h-6 text-white text-3xl font-bold"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                </span>
                <div>
                  <h3>
                    HomeCare Hub: Your Gateway to Effortless Home Cleaning
                  </h3>
                  <p className="text-gray-500">
                    Experience the joy of a spotless home through HomeCare Hub's
                    seamless booking system, where expert cleaning professionals
                    ensure your comfort and well-being.
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-7  gap-5">
                <span className="bg-[#6BC787] p-3 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    fill="none"
                    className="w-6 h-6 text-white text-3xl font-bold"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                </span>
                <div>
                  <h3>PureHouse: Where Cleanliness Meets Convenience</h3>
                  <p className="text-gray-500">
                    PureHouse simplifies your life by offering convenient access
                    to impeccable home cleaning services, allowing you to revel
                    in a sanitized and organized living space.
                  </p>
                </div>
              </div>
            </div>
            <div className=" w-full md:w-1/2 lg:w-5/12">
              <Image
                className="h-auto w-full "
                src={nurturePng}
                alt="banner"
                height={600}
              />
            </div>
          </div> */}
      </section>
      <section className="work_section mb-16">
        <h2 className="text-4xl font-bold text-center mx-auto">How It Works</h2>

        <div className="my-10 md:my-16 flex flex-col md:flex-row justify-between gap-8 md:gap-20 items-center">
          <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col md:flex-row items-center md:items-start">
            {/* <Image
                className="h-full w-[500px] mb-6 md:mb-0 md:mr-6"
                src={s1}
                height={120}
                alt="step"
                /> */}
            <div className="w-full text-start">
              <h2 className="text-bold text-4xl my-2 md:my-6">
                Request a Free Quote
              </h2>
              <p className="text-xl opacity-50">
                Send us a request for a free quote, including pictures of the
                items you need removed.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-5/12">
            <LottiePlayer
              className="h-auto w-full"
              loop
              autoplay
              src={stepOne}
            />
          </div>
        </div>

        <div className="my-10 md:my-16 flex flex-col-reverse md:flex-row justify-between gap-8 md:gap-20 items-center">
          <div className="w-full md:w-1/2 lg:w-5/12">
            <LottiePlayer
              className="h-auto w-full"
              loop
              autoplay
              src={stepTwo}
            />
          </div>
          <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col md:flex-row-reverse items-center md:items-start">
            {/* <Image
                className="h-full w-[500px] mb-6 md:mb-0 md:ml-6"
                src={s2}
                height={120}
                alt="step"
              /> */}
            <div className="w-full text-start md:text-end">
              <h2 className="text-bold text-4xl my-2 md:my-6">
                Receive Your Final Quote
              </h2>
              <p className="text-xl opacity-50">
                After reviewing your request, we'll send you a final invoice—no
                hidden fees. If you're satisfied with the quote, simply approve
                it.
              </p>
            </div>
          </div>
        </div>

        <div className="my-10 md:my-16 flex flex-col md:flex-row justify-between gap-8 md:gap-20 items-center">
          <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col md:flex-row items-center md:items-start">
            {/* <Image
                className="h-full w-[500px] mb-6 md:mb-0 md:mr-6"
                src={s3}
                height={120}
                alt="step"
              /> */}
            <div className="w-full text-start">
              <h2 className="text-bold text-4xl my-2 md:my-6">
                We Do the Rest
              </h2>
              <p className="text-xl opacity-50">
                Buckle up once you accept the quote—we'll handle everything from
                there!
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-5/12">
            <LottiePlayer
              className="h-auto w-full"
              loop
              autoplay
              src={stepThree}
            />
          </div>
        </div>
      </section>
      <section className="blog-section mb-16">
        <h2 className="text-4xl my-12 font-bold text-center mx-auto">
          Our Blogs
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {blogs?.map((data) => (
            <BlogCard noActions key={data._id} data={data} />
          ))}
        </div>
        <div className="my-10 text-center">
          <Button onClick={gotoBlogsPage}>See More</Button>
        </div>
      </section>
    </>
  );
};

export default PublicHome;
