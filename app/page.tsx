import CreateANewCloneForm from "@/components/CreateANewCloneForm";
import RecentClones from "@/components/RecentClones";

export default function Home() {
  return (
    <div className="p-4 py-6">
      <CreateANewCloneForm />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <RecentClones />
        </div>
        <div className="w-full md:w-1/2">
          <RecentClones />
        </div>
      </div>
    </div>
  );
}
