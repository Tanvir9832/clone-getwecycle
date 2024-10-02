import { DeleteOutlined } from "@ant-design/icons";
import { book_service } from "@tanbel/homezz/http-client";
import type { IBooking, IPriceInputs } from "@tanbel/homezz/types";
import { BookingType, type IBookingModel } from "@tanbel/homezz/types";
import {
  Button,
  Input,
  PlaceAutocompleteInput,
  Select,
} from "@tanbel/react-ui";
import {
  base64ToFile,
  fileToBase64,
  resizeAndCompressImage,
} from "@tanbel/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHttp } from "../../../hook/useHttp";
import { useAuthStore } from "../../../store/authStore";

type Props = {
  className?: string;
  _id: string;
  customInputs: IPriceInputs[];
};

const BookingModes = [
  {
    label: "One Time",
    value: BookingType.ONE_TIME,
  },
  {
    label: "Bi Weekly",
    value: BookingType.BI_WEEKLY,
  },
  {
    label: "Weekly",
    value: BookingType.WEEKLY,
  },
  {
    label: "Monthly",
    value: BookingType.MONTHLY,
  },
];

export const RequestQuoteForm: React.FC<Props> = ({
  className,
  _id,
  customInputs,
}) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [priceInputs, setPriceInputs] = useState<IBooking["priceInputs"]>([]);
  const [date, setDate] = useState<IBookingModel["date"]>({
    start: new Date(),
    end: new Date(),
    mode: BookingType.ONE_TIME,
  });
  const [location, setLocation] = useState<IBooking["location"]>({
    name: "",
    lat: 0,
    lng: 0,
  });
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const { loading, request } = useHttp(() => {
    return book_service(_id, {
      date: JSON.stringify({
        start:
          date.start instanceof Date ? date.start.toISOString() : date.start,
        end: date.end instanceof Date ? date.end.toISOString() : date.end,
        mode: date.mode,
      }),
      location: JSON.stringify(location),
      images: images.filter((i): i is File => i !== null),
      priceInputs: JSON.stringify(priceInputs),
    });
  });

  const handleInputChange = (key: string, value: string) => {
    setPriceInputs((prev) => {
      const newInputs = [...prev];
      const index = newInputs.findIndex((input) => input.name === key);
      if (index === -1) {
        newInputs.push({
          name: key,
          value,
        });
      } else {
        newInputs[index].value = value;
      }
      return newInputs;
    });
  };

  const getEstimatedCost = () => {
    let cost = 0;
    if (priceInputs?.length) {
      priceInputs?.forEach((input, index) => {
        const inputValue = isNaN(+input.value) ? 0 : +input.value;
        cost += inputValue * +customInputs[index].defaultValue;
      });
    }
    return cost;
  };

  const handleImageChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const resizedAndCompressedFilesPromises = Array.from(files).map((file) =>
        resizeAndCompressImage(file, 800, 800, 0.7)
      );

      try {
        const resizedAndCompressedFiles = await Promise.all(
          resizedAndCompressedFilesPromises
        );
        resizedAndCompressedFiles.forEach((file, i) => {
          if (file) {
            setImages((prevImages) => {
              const updatedImages = [...prevImages];
              updatedImages[index + i] = file;
              return updatedImages;
            });
          }
        });
      } catch (error) {
        console.error("Error resizing and compressing images:", error);
      }
    }
  };

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = null;
      return updatedImages;
    });
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      // Convert image files to base64 strings
      const imagesBase64 = await Promise.all(
        images
          .filter((i): i is File => i !== null)
          .map((file) => fileToBase64(file))
      );

      // Store form data in localStorage
      const formData = {
        date,
        location,
        priceInputs,
        images: imagesBase64,
      };
      localStorage.setItem(`servicequoteform-${_id}`, JSON.stringify(formData));

      toast("Please login first", { type: "warning", autoClose: 2000 });
      const redirect = new URLSearchParams({
        redirect: router.asPath,
      }).toString();
      router.push(`/auth/register?${redirect}`);
      return;
    }

    let isOk = true;
    if (!date.start) {
      toast("Please select a date", { type: "error" });
      isOk = false;
    } else if (!location.name) {
      toast("Please select location", { type: "error" });
      isOk = false;
    } else if (customInputs?.length) {
      customInputs?.forEach((input) => {
        const val = priceInputs.find((i) => i.name === input.name)?.value;
        if (!val) {
          isOk = false;
          toast(`Please input ${input.label}`, { type: "error" });
          return;
        }
      });
    }
    if (isOk) {
      request()
        .then((res: any) => {
          toast("Your request has been sent to the author!", {
            type: "success",
          });
          // Clear form data from localStorage after successful submission
          localStorage.removeItem(`servicequoteform-${_id}`);
          router.push("/");
        })
        .catch((err) => {
          toast("Something wrong!", { type: "error" });
        });
    }
  };

  // Retrieve form data from localStorage when the component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem(`servicequoteform-${_id}`);
    if (savedFormData) {
      const { date, location, priceInputs, images } = JSON.parse(savedFormData);
      setDate(date);
      setLocation(location);
      setPriceInputs(priceInputs);
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        images.forEach((base64: string, index: number) => {
          updatedImages[index] = base64ToFile(base64);
        });
        return updatedImages;
      });
    }
  }, []);

  return (
    <div
      className={`w-full mx-auto bg-white p-4 md:pt-0 shadow-md rounded-md ${className}`}
    >
      <div className="bg-green-100 text-green-600 p-3 rounded-md mb-4 text-center">
        Estimated Cost: ${getEstimatedCost()}
      </div>
      {/* Image Upload Section */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {images.map((img, index) => (
          <div key={index} className="relative">
            {img ? (
              <button
                onClick={() => handleImageRemove(index)}
                className="absolute right-0 top-0 p-1 bg-transparent outline-none border-none text-red-500 hover:bg-red-500 hover:text-white cursor-pointer rounded-md"
              >
                <DeleteOutlined className="text-lg" />
              </button>
            ) : null}
            <label
              htmlFor={`image-upload-${index}`}
              className="border-2 border-dashed border-gray-300 h-24 flex items-center justify-center cursor-pointer"
            >
              {img ? (
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              )}
            </label>
            <input
              id={`image-upload-${index}`}
              type="file"
              className="hidden"
              multiple
              onChange={(e) => handleImageChange(index, e)}
            />
          </div>
        ))}
      </div>

      {/* Date and Time Picker */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date and Time</label>
        <Input
          type="datetime-local"
          value={
            date.start ? new Date(date.start).toISOString().slice(0, 16) : ""
          }
          onChange={(e) => {
            setDate((prev) => ({
              ...prev,
              start: e.target.value ? new Date(e.target.value) : ("" as any),
            }));
          }}
        />
      </div>

      {/* Request Mode */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Request Mode</label>
        <Select
          options={BookingModes}
          defaultValue={BookingModes[0].value}
          value={date.mode}
          onSelect={(mode) => setDate((prev) => ({ ...prev, mode }))}
        />
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Location</label>
        {/* <Input type="text" placeholder="Select Location" /> */}
        <PlaceAutocompleteInput
          defaultValue={location.name}
          placeholder="Select Location"
          onPlaceSelect={(name, lat, lng) => {
            setLocation({ name, lat, lng });
          }}
        />
      </div>

      {/* Custom Field */}
      {customInputs && customInputs.length
        ? customInputs.map((input, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {`${input.label} ${input.unite ? `(${input.unite})` : ""}`}
              </label>
              {input?.inputType === "select" ? (
                <Select
                  options={input.options}
                  defaultValue={input.options[0].value}
                  value={
                    priceInputs.find((i) => i.name === input.name)?.value || ""
                  }
                  onSelect={(value) => handleInputChange(input.name, value)}
                />
              ) : (
                <Input
                  value={
                    priceInputs.find((i) => i.name === input.name)?.value || ""
                  }
                  inputMode="decimal"
                  placeholder={"0 " + input.unite}
                  onChange={(e) =>
                    handleInputChange(input.name, e.target.value)
                  }
                />
              )}
            </div>
          ))
        : null}

      {/* Submit Button */}
      <Button block loading={loading} onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};
