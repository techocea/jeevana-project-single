import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <Card className="max-w-6xl lg:rounded-[3rem] rounded-3xl shadow-md bg-black py-10 px-6 lg:py-20 lg:px-16 flex items-center justify-center">
      <CardContent className="flex flex-col lg:flex-row items-center text-center lg:text-left lg:justify-between ">
        <div className="lg:flex-2 flex flex-col">
          <h3 className="text-white">
            The Finest Way to Present{" "}
            <span className="text-primary italic">Your Narrative.</span>
          </h3>
          <p>
            Jeevana.lk is not just a portal; it is an editorial platform. We
            craft profiles into compelling stories that resonate with discerning
            families.
          </p>
        </div>
        <div className="lg:flex-1 flex items-center justify-center">
          <Button className="uppercase p-6">
            post advertisement{" "}
            <span>
              <ArrowRight size={18} />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CTA;
