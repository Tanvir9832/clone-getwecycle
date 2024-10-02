import { BlogCard, BlogCardSkeleton } from "@tanbel/homezz/components";
import { get_all_blog } from "@tanbel/homezz/http-client";
import { GetBlogDTO } from "@tanbel/homezz/types";
import React, { useEffect } from "react";

export interface BlogData {
  id: number;
  title: string;
  description: string;
  photo: string;
  author: {
    name: string;
    image: string;
  };
  post_date: string;
}

type Props = {
  limit?: number;
};

const BlogCardGridLayout: React.FC<Props> = ({ limit }) => {
  const [blogs, setBlogs] = React.useState<GetBlogDTO[]>([]);

  useEffect(() => {
    get_all_blog(limit || 3).then((data) => {
      setBlogs(data);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 pb-11 gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
      {blogs.length > 0
        ? blogs.map((data) => <BlogCard noActions key={data._id} data={data} />)
        : Array.from(Array(limit || 9).keys()).map((i) => (
            <BlogCardSkeleton key={i} />
          ))}
    </div>
  );
};

export { BlogCardGridLayout };
