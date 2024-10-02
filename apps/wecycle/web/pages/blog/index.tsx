import React from "react";
import { BlogCardGridLayout } from "../../components/pages/blog";

const BlogPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-2">
      <h2 className="text-3xl text-gray-700 my-4 border-b-2 text-center mb-10">
        Featured Blogs
      </h2>
      <BlogCardGridLayout limit={10} />
    </div>
  );
};

export default BlogPage;
