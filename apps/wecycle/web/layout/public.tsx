import React from "react";
import Header from "../components/Header";
import { Footer } from "../components/shared/Footer";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="max-w-7xl mx-auto sm:px-20">
      <Header />
      <section className="min-h-screen px-5">{children}</section>
      <Footer />
    </main>
  );
};

export default PublicLayout;
