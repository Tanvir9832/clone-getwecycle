import React from "react";
import Link from "next/link";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Card } from "@tanbel/react-ui";
import { useRouter } from "next/router";
import { GetBlogDTO } from "@tanbel/homezz/types";
import { formatDate } from "@tanbel/utils";
import Image from "next/image";

export interface BlogCardProps {
  data: GetBlogDTO;
  openDeleteModal?: (id: string) => void;
  noActions?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
  data,
  openDeleteModal,
  noActions,
}) => {
  const handleDelete = (id: string) => {
    openDeleteModal && openDeleteModal(id);
  };

  const router = useRouter();

  const openCreator = () => {
    router.push(`/blog/manage?id=${data._id}`);
  };

  return (
    <Card className="rounded-lg flex flex-col w-full overflow-hidden">
      <Link href={`blog/${data._id}`} target="_blank">
        <Image
          className="w-full object-cover"
          width={480}
          height={200}
          src={data.cover}
          alt="service cover"
        />
      </Link>
      <div
        style={{ padding: "20px" }}
        className="flex flex-col justify-between gap-4"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-xl">{data.title}</h3>
        </div>
        <div className="flex mt-4 items-center justify-between">
          <p className="opacity-50 italic text-sm">
            {formatDate(data.createdAt)}
          </p>
          {!noActions && (
            <div className="flex gap-5">
              <EditTwoTone onClick={openCreator} style={{ fontSize: "20px" }} />
              <DeleteTwoTone
                onClick={() => handleDelete(data._id)}
                style={{ fontSize: "20px", color: "red" }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const BlogCardSkeleton = () => {
  return (
    <Card className="rounded-lg flex flex-col overflow-hidden animate-pulse w-full">
      <div className="w-full h-48 bg-gray-200"></div>
      <div
        style={{ padding: "20px" }}
        className="flex flex-col justify-between gap-4"
      >
        <div className="flex flex-col">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
        </div>
        <div>
          <div
            style={{ width: "40%" }}
            className="h-4 bg-gray-200 rounded my-2"
          ></div>
        </div>
      </div>
    </Card>
  );
};

export { BlogCard, BlogCardSkeleton };
