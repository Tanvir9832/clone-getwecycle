import React from "react";
import Image from "next/image";
import banner from "../../../assets/banner.png";
import playstore from "../../../assets/playstore.png";
import appstore from "../../../assets/appstore.png";
import qrcode from "../../../assets/qrcode.png";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Player } from "@lottiefiles/react-lottie-player";
import wecycleLottie from "../../../assets/lotties/wecycle-hero.json";

const HeroSection = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5 justify-between lg:grid-flow-row-dense">
        {/* <div className="sm:mt-20 mt-10 mb-5 -mr-4 flex items-center justify-center sm:justify-start gap-2">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Image
                className="sm:w-[200px] sm:h-[60px] w-[150px] h-[45px] opacity-75"
                src={playstore}
                alt={"play-store"}
              />
              <div className="absolute top-0 left-0 sm:w-[200px] sm:h-[60px] w-[150px] h-[45px] flex items-center justify-center text-white font-semibold bg-black bg-opacity-50 rounded-md">
                Coming soon...
              </div>
            </div>
            <div className="relative">
              <Image
                className="sm:w-[200px] sm:h-[60px] w-[150px] h-[45px] opacity-75"
                src={appstore}
                alt={"app-store"}
              />
              <div className="absolute top-0 left-0 sm:w-[200px] sm:h-[60px] w-[150px] h-[45px] flex items-center justify-center text-white font-semibold bg-black bg-opacity-50 rounded-md">
                Coming soon...
              </div>
            </div>
          </div>
          <Image
              className="sm:w-[175px] sm:h-[175px] w-[130px] h-[130px]"
              src={qrcode}
              alt={""}
            />
        </div> */}
        <div className="w-full flex justify-center mx-auto lg:order-2">
          <Player
            className="h-auto rounded-tl-[50px] rounded-br-[50px] overflow-hidden hidden lg:block"
            autoplay
            loop
            src={wecycleLottie}
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-6 lg:gap-0 lg:items-start lg:order-1">
          <h2 className="sm:text-7xl text-5xl mb-5 font-bold font-sans hidden lg:block">
            We<span className="text-primary">Cycle</span>
          </h2>
          <div className="">
            <p className="text-xl w-full text-center mb-5">
              Premium On-Demand Junk Removal Service
            </p>
          </div>
          {/* the video will be here on smaller screen less than lg */}
          <div className="my-6">
            <Player
              className="w-full h-auto mb-4 rounded-tl-[50px] rounded-br-[50px] md:max-w-lg overflow-hidden block lg:hidden"
              autoplay
              loop
              src={wecycleLottie}
            />
          </div>

          <Link href="/services" className="inline-block">
            <button className="group relative overflow-hidden rounded-full bg-primary px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <span className="relative z-10 flex items-center">
                Get Free Quote
                <ArrowRightOutlined className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
