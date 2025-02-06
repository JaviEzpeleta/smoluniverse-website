import Title from "@/components/Title";
import { findUserByHandle, getSkillsHistoryByHandle } from "@/lib/postgres";
import SkillsHistoryViewer from "@/components/SkillsHistoryViewer";
import BigTitle from "@/components/BigTitle";
const SkillsHistoryPage = async ({
  params,
}: {
  params: Promise<{ handle: string }>;
}) => {
  const { handle } = await params;

  const events = await getSkillsHistoryByHandle(handle);

  if (!events) {
    return <div>No events found</div>;
  }

  const user = await findUserByHandle(handle);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <div className="py-6">
        <BigTitle>Skills History ({events.length})</BigTitle>
        <SkillsHistoryViewer events={events} user={user} />
      </div>
    </div>
  );
};

export default SkillsHistoryPage;
