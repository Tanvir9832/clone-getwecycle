import React from "react";
import Header from "../../components/Header";
import { GetBlogDTO } from "@tanbel/homezz/types";
import { MarkdownPreview } from "@tanbel/react-ui";
import { get_single_blog } from "@tanbel/homezz/http-client";

const DynamicBlog = ({ blog }: { blog: GetBlogDTO }) => {
  const { title, cover, content } = blog;
  return (
    <div className="max-w-7xl mb-10 mx-auto sm:px-5 px-4">
      <section className="px-2">
        <div className="text-center mt-5">
          <span className="bg-orange-400 px-2 py-1 rounded-md font-bold text-2xl w-[80px]">
            Blog
          </span>
        </div>

        <p className="my-6 font-bold text-4xl text-center">{title}</p>

        <img
          className="w-full h-auto md:h-96 my-3"
          src={cover}
          alt="photo"
          style={{ objectFit: "cover" }}
        />

        <MarkdownPreview content={content} />

        {/* <p className="text-gray-500 text-xl">{}</p> */}
        {/* <p className="text-center font-bold text-3xl my-12">Related Articles</p> */}
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
          {blogs.slice(0, 4).map((data) => (
            <BlogCard key={data.id} data={data} />
          ))}
        </div> */}
      </section>
    </div>
  );
};

export default DynamicBlog;

export async function getServerSideProps(context: any) {
  const { query } = context;
  const blogId = query.id;
  if (blogId) {
    const res = await get_single_blog(blogId);
    return {
      props: {
        blog: res,
      },
    };
  } else {
    return {
      props: {
        blog: null,
      },
    };
  }
}
