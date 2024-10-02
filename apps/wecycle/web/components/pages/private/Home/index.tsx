import { Button } from "@tanbel/react-ui";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BlogCardGridLayout } from "../../blog";
import { ServiceCardGridLayout } from "../../services";

const limit = 3;

export default function PrivateHome() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col px-2">
      <section className="">
        <h2 className="font-bold my-6 text-3xl">Trending Services</h2>
        <ServiceCardGridLayout limit={limit} />
        <div className="mt-6 w-full flex items-center justify-center">
          <Link href="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </section>
      <section className="blog-section my-10">
        <h2 className="text-4xl mb-6 mt-16 font-bold text-center mx-auto">
          Our Blogs
        </h2>
        <BlogCardGridLayout limit={limit} />
        <div className="my-6 text-center">
          <Link href="/blog">
            <Button>See More</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
