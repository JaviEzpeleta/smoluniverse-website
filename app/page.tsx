import CreateANewCloneForm from "@/components/CreateANewCloneForm";
import ExploreLauncher from "@/components/ExploreLauncher";
import IntroBanner from "@/components/IntroBanner";
import RecentClones from "@/components/RecentClones";
import EventsList from "@/components/EventsList";

export const generateMetadata = async () => {
  const ogImage = `https://smoluniverse.com/thumbnail.png`;

  const images = [ogImage];

  const appName = "smoluniverse";
  const theTitle = `Smol Universe`;
  const theDescription = "an experiment on ai agents + onchain culture";

  return {
    title: theTitle,
    description: theDescription,
    applicationName: appName,
    referrer: "origin-when-cross-origin",
    keywords: ["ai", "agents", "onchain", "culture"],
    authors: [{ name: "Javi", url: "https://javitoshi.com" }],
    creator: "@javitoshi",
    publisher: "@javitoshi",
    metadataBase: new URL("https://smoluniverse.com"),
    openGraph: {
      images: images,
      title: theTitle,
      description: theDescription,
      url: `https://smoluniverse.com`,
      siteName: appName,
      locale: "en_US",
      type: "website",
    },
  };
};

export default function Home() {
  return (
    <div className="p-4 py-6">
      <div className="space-y-8">
        <IntroBanner />
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 xl:gap-12">
        <div className="w-full md:w-5/12">
          <div className="flex flex-col gap-4 py-12 sticky top-0">
            <RecentClones />
            <ExploreLauncher />
            <CreateANewCloneForm />
          </div>
        </div>
        <div className="w-full md:w-7/12">
          <EventsList />
        </div>
      </div>
    </div>
  );
}
