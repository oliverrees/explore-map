import { Container } from "@/app/components/Container";
import { Header } from "@/app/components/Header";
import React from "react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <Container customPadding="py-6 font-light">
        <h1 className="text-3xl font-bold mb-6">Contact us</h1>
        <p className="mb-4">
          If you have any questions or feedback, email us at
          hello@or-innovation.com
        </p>
      </Container>
    </>
  );
}
