import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONBOARDING_HIGHLIGHTS } from "@/lib/constants";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";

interface AuthPageProps {
  searchParams: Promise<{ mode?: string }>;
}

const AuthPage = async ({ searchParams }: AuthPageProps) => {
  const params = await searchParams;
  const mode = params.mode === "login" ? "login" : "register";

  return (
    <main className="w-full">
      <section className="py-10 px-6 lg:py-20 lg:px-0">
        <div className="md:max-w-5xl mx-auto flex flex-col items-start gap-8">
          <div>
            <Button
              variant="link"
              className="uppercase text-lg font-regular flex items-center justify-center gap-2"
              asChild
            >
              <Link href="/" className="flex items-center gap-2">
                <span>
                  <ArrowLeft />
                </span>
                Back
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row bg-white shadow-2xl w-full gap-10">
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-0 ">
              {mode === "login" ? <LoginForm /> : <RegisterForm />}
              <div className="mt-4 text-center">
                {mode === "login" ? (
                  <Link
                    href="/auth?mode=register"
                    className="text-primary hover:text-secondary transition-colors "
                  >
                    Don't have an account? Sign up
                  </Link>
                ) : (
                  <Link
                    href="/auth?mode=login"
                    className="text-primary hover:text-secondary transition-colors "
                  >
                    Already have an account? Log in
                  </Link>
                )}
              </div>
            </div>

            <div className="flex-1 bg-linear-to-tr from-primary/10 to-primary/20">
              {ONBOARDING_HIGHLIGHTS.map((highlight) => (
                <div
                  key={highlight.title}
                  className="p-3 md:p-5 flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 min-w-12 items-center justify-center rounded-full bg-white text-primary overflow-hidden">
                    <highlight.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-muted">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
