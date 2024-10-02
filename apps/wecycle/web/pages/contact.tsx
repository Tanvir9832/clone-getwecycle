/* eslint-disable react-hooks/rules-of-hooks */
import { send_support_email } from "@tanbel/homezz/http-client";
import { Button, Input, Text, TextArea } from "@tanbel/react-ui";
import Image from "next/image";
import React, { useState } from "react";
import contact from "../assets/contact.png";
import Follow from "../components/pages/contact/Follow";
import { useHttp } from "../hook/useHttp";
import { message } from "../utils/message";

const initialEmail = {
  name: "",
  email: "",
  message: "",
};

const ContactPage = () => {
  const [form, setForm] = useState(initialEmail);
  const { loading, request } = useHttp(() => {
    return send_support_email({
      name: form.name,
      email: form.email,
      message: form.message,
    });
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async () => {
    if (form.name === "" || form.email === "" || form.message === "") {
      message.error("Please fill all fields");
      return;
    }
    request().then(() => {
      setForm(initialEmail);
      message.success("Message send successfully");
    });
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-2">
      <div className="mt-10 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-gray-100 flex flex-col justify-center p-4 lg:px-10">
          <h3 className="text-2xl lg:text-4xl font-bold">Contact</h3>
          <p className="my-2 ">Get in touch and let us know how we can help.</p>
          <hr className="mt-1 w-[90%] lg:w-full lg:mt-2 mb-5 lg:mb-10" />
          <div className="mt-2 w-[90%] lg:w-full lg:mt-3 ">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>
          <div className="mt-2 w-[90%] lg:w-full lg:mt-3">
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
          <div className="mt-2 w-[90%] lg:w-full lg:mt-3">
            <TextArea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
            />
          </div>
          <div className="flex mt-5  lg:mt-10">
            <Button loading={loading} onClick={handleSubmit}>
              Send
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center bg-gray-800 p-4 lg:p-10">
          <div className="block lg:hidden mx-auto mb-5">
            <Image
              src={contact}
              className="object-cover"
              width={300}
              height={225}
              alt="image"
            />
          </div>
          <div className="hidden text-center lg:block">
            <Image
              src={contact}
              className="object-cover"
              width={400}
              height={300}
              alt="image"
            />
          </div>
          <div className="lg:col-span-2">
            <div className=" w-[90%] lg:w-full mt-2 mx-auto text-gray-500 lg:mt-4">
              <p className="text-lg">
                Feel free to contact us for inquiries about our services,
                pricing, scheduling, or any other related queries. We value your
                time and trust, and we&apos;re dedicated to ensuring that your
                home is taken care of to the highest standards. Let us partner
                with you to create a cleaner, more comfortable living
                environment.
              </p>
            </div>
            <Follow className="mt-5 lg:mt-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
