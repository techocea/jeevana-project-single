import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/forms/contact-form";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const ContactPage = () => {
  return (
    <main className="w-full">
      <section className="mt-12 py-10 px-6 lg:py-20 lg:px-0 bg-foreground">
        <div className="md:max-w-5xl mx-auto flex flex-col items-center justify-center gap-4">
          <span className="tagline">Get In Touch</span>

          <div className="w-full h-full">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
