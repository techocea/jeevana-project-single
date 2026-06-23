import AdminCreateAdForm from "@/components/forms/admin-create-ad-form";
import TitleHeader from "@/components/dashboard/title-header";
import { Input } from "@/components/ui/input";

const CreateAdPage = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <TitleHeader
            isGreeting={false}
            title="curate advertisement"
            description="Prepare and verify the editorial narrative for public distribution."
          />

          <AdminCreateAdForm />
        </div>
      </div>
    </div>
  );
};

export default CreateAdPage;
