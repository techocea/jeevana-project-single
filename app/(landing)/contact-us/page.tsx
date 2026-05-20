import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SERVICE_PROMISES } from "@/lib/constants";
import CTA from "@/components/landing/call-to-action";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/forms/contact-form";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const ContactPage = () => {
  const contactCards = [
    {
      id: 1,
      title: "quality service",
      description:
        "For our high-profile clients requiring absolute discretion and bespoke matching",
      email: "contact@jeevana.com",
    },
    {
      id: 2,
      country: "Sri Lanka",
      address: "12 Heritage Square, Galle Road, Colombo 00300, Sri Lanka",
      telephone: "+94 11 234 5678",
    },
    {
      id: 3,
      title: "Connect with us",
      social: [
        { name: "Facebook", icon: FaFacebookF, url: "https://webizera.com" },
        { name: "Instagram", icon: FaInstagram, url: "https://webizera.com" },
        // { name: "TikTok", icon: FaTiktok, url: "https://webizera.com" },
      ],
    },
  ];

  return (
    <main className="w-full">
      <section className="py-24 md:py-28 px-6 bg-foreground">
        <div className="md:max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 flex flex-col gap-4 md:max-w-xl w-full">
            <span className="tagline">personal connection</span>
            <h3 className="text-black capitalize italic">
              The art of matchmaking begins with a{" "}
              <span className="text-primary italic">Conversation.</span>
            </h3>
            <p className="text-justify">
              Whether you are beginning your journey or seeking a more bespoke
              concierge experience, our team is here to guide you through every
              step of your union.
            </p>
          </div>

          <div className="flex-2 flex relative md:max-w-sm w-full min-h-64 md:min-h-80">
            <Image
              src="/images/contact-img.png"
              alt="Pricing"
              fill
              className="object-cover object-center rounded-3xl"
            />
          </div>
        </div>
      </section>

      <section className="pb-24 md:py-28 px-6 md:px-20 md:pt-0 bg-foreground">
        <div className="md:max-w-5xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-10">
          <div className="flex-2 h-full">
            <ContactForm />
          </div>

          <div className="flex-1 w-full h-full grid gap-7">
            {contactCards.map((card) => (
              <Card
                key={card.id}
                className={`${card.id === 1 ? "bg-primary text-secondary" : "bg-white text-muted"} rounded-3xl min-h-1/3`}
              >
                <CardContent className="space-y-1">
                  <h4 className="text-xl font-newsreader capitalize font-semibold">
                    {card.title}
                  </h4>
                  <p className="text-sm text-secondary font-regular">
                    {card.description}
                  </p>

                  {card.email ? (
                    <p className="text-sm text-secondary font-medium underline">
                      {card.email}
                    </p>
                  ) : null}

                  {card.country ? (
                    <div className="space-y-2">
                      <h4 className="text-xl font-newsreader capitalize font-semibold">
                        {card.country}
                      </h4>
                      <p className="text-sm text-muted">{card.address}</p>
                      <p className="text-sm text-muted">{card.telephone}</p>
                    </div>
                  ) : null}

                  {card.social ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {card.social.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.url}
                            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm transition hover:bg-primary/10"
                          >
                            <Icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
