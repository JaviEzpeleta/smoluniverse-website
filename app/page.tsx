import CreateANewCloneForm from "@/components/CreateANewCloneForm";
import RecentClones from "@/components/RecentClones";

export default function Home() {
  return (
    <div className="p-4 py-6">
      <CreateANewCloneForm />
      <RecentClones />
    </div>
  );
}
