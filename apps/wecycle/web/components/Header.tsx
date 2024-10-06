import { ICON } from "@tanbel/react-icons";
import { Drawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "../assets/logo.png";

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="homezz-web-header text-center bg-white py-5 px-3 lg:px-0 lg:mt-5 sticky top-0 flex gap-4 items-center justify-between z-50">
      <Link href={"/"}>
        <Image
          src={logo}
          alt={""}
          className="lg:w-full lg:h-auto min-w-[90%]"
        />
      </Link>
      <div className="flex gap-3 items-center">
        <ul className="list-none font-bold hidden lg:flex items-center gap-5">
          {/* <li>
          <a className="no-underline text-black" href="https://tanbel.com/">
            About
          </a>
          </li> */}
          <li>
            <Link
              className="no-underline py-2 px-4 bg-green-400 rounded-md text-white"
              href="tel:+1-866-278-0866"
              aria-label="Call us"
              title="Call us"
            >
              <ICON.PHONE className="" />
            </Link>
          </li>
          <li>
            <Link
              className="no-underline text-black hover:text-green-400"
              href={"/"}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="no-underline text-black hover:text-green-400"
              href={"/services"}
            >
              Service
            </Link>
          </li>
          <li>
            <Link
              className="no-underline text-black hover:text-green-400"
              href="/contact"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              className="no-underline text-black hover:text-green-400"
              href={"/blog"}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              className="no-underline text-black hover:text-green-400 whitespace-nowrap"
              href={"/onboarding"}
            >
              Become Hauler
            </Link>
          </li>
        </ul>
        <div className="hidden lg:block">
          <Link
            className="no-underline text-black px-2 py-1 border !border-black rounded-md hover:!border-green-400 hover:text-white hover:bg-green-400"
            href={"/auth/login"}
          >
            Login
          </Link>
        </div>
        <div className="flex lg:hidden gap-3 items-center">
          <Link
            className="no-underline py-2 px-4 bg-green-400 rounded-md text-white"
            href="tel:+1-866-278-0866"
            aria-label="Call us"
            title="Call us"
          >
            <ICON.PHONE className="" />
          </Link>
          <button
            onClick={showDrawer}
            className="border rounded-md py-2 px-3 bg-transparent"
          >
            <ICON.MENU className="text-lg" />
          </button>
        </div>
      </div>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-6 lg:hidden h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
        />
      </svg> */}
      <Drawer placement="right" onClose={onClose} open={openDrawer}>
        <ul className="list-none gap-8 font-bold flex flex-col items-center">
          <li onClick={onClose}>
            <Link
              className="no-underline text-black hover:text-green-400"
              href={"/"}
            >
              Home
            </Link>
          </li>
          <li onClick={onClose}>
            <Link
              className="no-underline text-black hover:text-green-400"
              href={"/services"}
            >
              Service
            </Link>
          </li>
          <li onClick={onClose}>
            <Link
              className="no-underline text-black hover:text-green-400"
              href={"/contact"}
            >
              Contact
            </Link>
          </li>
          <li onClick={onClose}>
            <Link
              className="no-underline text-black hover:text-green-400"
              href={"/blog"}
            >
              Blog
            </Link>
          </li>
          <li onClick={onClose}>
            <Link
              className="no-underline text-black hover:text-green-400"
              href={"/contact"}
            >
              Become Hauler
            </Link>
          </li>
          <li onClick={onClose}>
            <Link
              className="no-underline text-black px-2 py-1 border !border-black rounded-md hover:!border-green-400 hover:text-white hover:bg-green-400"
              href={"/auth/login"}
            >
              Login
            </Link>
          </li>
        </ul>
      </Drawer>
    </div>
  );
};

export default Header;
