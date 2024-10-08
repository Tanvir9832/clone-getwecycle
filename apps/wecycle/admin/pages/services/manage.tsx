import { message } from "../../utils/message";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/dashbaord";
import { Button, PageTitle, Space, Text, TextArea } from "@tanbel/react-ui";
import { Input } from "@tanbel/react-ui";
import { Select } from "@tanbel/react-ui";
import { useHttp } from "../../hook/useHttp";
import {
  create_service,
  edit_service,
  get_categories,
  get_service,
} from "@tanbel/homezz/http-client";
import { useRouter } from "next/router";
import {
  CreateServiceDTO,
  GetCategoryDTO,
  GetSingleServiceDTO,
  UserType,
} from "@tanbel/homezz/types";
import { theme } from "@tanbel/homezz/utils";
import { v4 as uuid } from "uuid";
import Private from "../../components/Private";
import { CustomInput } from "../../components/services/CustomInput";
import { toast } from "react-toastify";

interface formInterface {
  priceInputs: {
    inputType: string;
    label: string;
    name: string;
    unite?: string;
    defaultValue?: number | string;
    options?: { label: string; value: string }[];
  }[];
  title: string;
  description: string;
  cover?: File | string;
  category: string[];
}

const Index = () => {
  const router = useRouter();
  const serviceId = router.query.id;
  const [formData, setFormData] = useState<formInterface>({
    title: "",
    description: "",
    cover: undefined,
    priceInputs: [
      {
        inputType: "text",
        label: "",
        name: uuid(),
        unite: "",
        defaultValue: 0,
      },
    ],
    category: [],
  });

  const { error, loading, request } = useHttp<null, CreateServiceDTO>(() => {
    const form = {
      title: formData.title,
      description: formData.description,
      cover: formData.cover as Blob,
      category: JSON.stringify(formData.category),
      priceInputs: JSON.stringify(formData.priceInputs),
    };
    if (serviceId) {
      return edit_service(serviceId as string, form);
    } else {
      return create_service(form);
    }
  });

  const { request: getService } = useHttp<GetSingleServiceDTO>(() => {
    return get_service(serviceId as string);
  });

  const { data: categories, request: getCategory } = useHttp<GetCategoryDTO[]>(
    () => {
      return get_categories();
    }
  );

  useEffect(() => {
    getCategory();
    if (serviceId) {
      getService().then((res) => {
        setFormData({
          title: res.title,
          description: res.description,
          cover: res.cover,
          priceInputs: res.priceInputs,
          category: res.category.map((cat) => cat._id),
        });
        setCoverUrl(res.cover);
      });
    }
  }, [router.isReady]);

  const [coverUrl, setCoverUrl] = useState<string | ArrayBuffer | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    inputIndex: number
  ) => {
    const name = e.target.name as keyof formInterface["priceInputs"][0];
    const value = e.target.value;
    setFormData((prevData) => {
      const updatedInputs = [...prevData.priceInputs];
      if (name !== "options") {
        updatedInputs[inputIndex][name] = value;
      }
      return { ...prevData, priceInputs: updatedInputs };
    });
  };

  const handleOptionChange = (
    inputIndex: number,
    options: { label: string; value: string }[]
  ) => {
    setFormData((prevData) => {
      const updatedInputs = [...prevData.priceInputs];
      updatedInputs[inputIndex].options = options;
      return { ...prevData, priceInputs: updatedInputs };
    });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prevData) => ({ ...prevData, cover: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (value: string[]) => {
    setFormData((prevData) => ({ ...prevData, category: value }));
  };

  const handleAddInput = () => {
    setFormData((prevData) => {
      const newInput = {
        inputType: "text",
        label: "",
        name: uuid(),
        unite: "",
        defaultValue: 0,
      };
      const updatedInputs = [...prevData.priceInputs, newInput];
      return { ...prevData, priceInputs: updatedInputs };
    });
  };

  const handleRemoveInput = (inputIndex: number) => {
    setFormData((prevData) => {
      const updatedInputs = prevData.priceInputs.filter(
        (_, index) => index !== inputIndex
      );
      return { ...prevData, priceInputs: updatedInputs };
    });
  };

  const handleSubmit = () => {
    request()
      .then(() => {
        if (serviceId) {
          message.success("Service has been updated successfully!");
        } else {
          message.success("Service has been created successfully!");
        }
        router.back();
      })
      .catch((err) => {
        toast.error(
          "Somethng went wrong! Please fill all the required fields."
        );
      });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* <h2 className="text-2xl mb-6">Create new service</h2> */}
        <PageTitle>
          {serviceId ? "Edit Service" : "Create new service"}
        </PageTitle>
        {/* <hr className='mb-5 mt-3'/> */}
        <div className="mt-6 mb-2">
          <div className="relative">
            <div className="h-80 rounded-lg bg-gray-200 overflow-hidden">
              {coverUrl && (
                <img
                  src={coverUrl as string}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <label
                htmlFor="cover"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
              >
                <span className="ml-2 text-white">Upload Cover</span>
              </label>
              <input
                type="file"
                accept="image/*"
                id="cover"
                name="cover"
                onChange={handleCoverChange}
                className="sr-only"
              />
            </div>
          </div>
          <Space height={5} />
          <Text color={theme.danger}>{error?.cover}</Text>
        </div>
        <div className="gap-5 flex flex-col mt-10">
          <Input
            name="title"
            error={error?.title}
            label="Title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <TextArea
            name="description"
            error={error?.description}
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          />
          <div>
            <div className="flex justify-between items-center mb-2">
              <p>Price Inputs</p>
              <Button size="small" onClick={handleAddInput}>
                + Add new Input
              </Button>
            </div>
            <div className="gap-3 flex flex-col">
              {formData.priceInputs?.map((input, i) => (
                <CustomInput
                  key={input.name}
                  index={i}
                  input={input}
                  error={error}
                  handleInputChange={handlePriceInputChange}
                  handleOptionChange={handleOptionChange}
                  handleRemoveInput={handleRemoveInput}
                />
              ))}
            </div>
          </div>
          <div className="mb-6">
            <Select
              label="Category"
              mode="multiple"
              value={formData.category}
              onChange={handleCategoryChange}
              options={
                categories?.map((category) => ({
                  label: category.name,
                  value: category._id,
                })) || []
              }
            />
          </div>
        </div>
        <Button
          loading={loading}
          type="primary"
          onClick={handleSubmit}
          className="w-full"
        >
          {serviceId ? "Update" : "Submit"}
        </Button>
      </div>
      {/* </div> */}
    </DashboardLayout>
  );
};

const PrivatePage = () => {
  return (
    <Private access={[UserType.SUPER_ADMIN, UserType.ADMIN]}>
      <Index />
    </Private>
  );
};

export default PrivatePage;
