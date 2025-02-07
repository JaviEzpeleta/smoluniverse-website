import { ACTIONS_OBJECT } from "@/lib/actions-catalog";
import { timeSince } from "@/lib/time";
import { RawUser } from "@/lib/types";

const EventCard = ({ event, user }: { event: any; user: RawUser }) => {
  const action = ACTIONS_OBJECT.find(
    (action: {
      code: string;
      name: string;
      asAction: string;
      emoji: string;
      color: string;
    }) => action.code === event.action_type
  );

  if (!action) {
    return <div>ACTION NOT FOUND: {event.action_type}</div>;
  }

  return (
    <div className="">
      <div className="flex items-center justify-between gap-2 w-full">
        <div>{action.asAction}</div>
        <div>{timeSince(event.created_at)}</div>
      </div>
      {/* <pre>{JSON.stringify(event, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </div>
  );
};

export default EventCard;
