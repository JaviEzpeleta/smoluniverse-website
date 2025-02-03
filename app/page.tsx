import CreateANewCloneForm from "@/components/CreateANewCloneForm";
import IntroBanner from "@/components/IntroBanner";
import RecentClones from "@/components/RecentClones";
import EventsList from "@/components/EventsList";
export default function Home() {
  return (
    <div className="p-4 py-6">
      <div className="space-y-8">
        <IntroBanner />
        <CreateANewCloneForm />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <RecentClones />
        </div>
        <div className="w-full md:w-1/2">
          <EventsList />
        </div>
      </div>
    </div>
  );
}
