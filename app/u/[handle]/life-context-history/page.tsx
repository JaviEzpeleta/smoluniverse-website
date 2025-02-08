import {
  findUserByHandle,
  getLifeContextHistoryByHandle,
} from "@/lib/postgres";
import SkillsHistoryViewer from "@/components/LifeContextHistoryViewer";
import BigTitle from "@/components/BigTitle";
const SkillsHistoryPage = async ({
  params,
}: {
  params: Promise<{ handle: string }>;
}) => {
  const { handle } = await params;

  const events = await getLifeContextHistoryByHandle(handle);

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
        <BigTitle>
          Life Context History for @{user.handle} ({events.length})
        </BigTitle>
        <SkillsHistoryViewer events={events} user={user} />
      </div>
    </div>
  );
};

export default SkillsHistoryPage;
