import { RawUser } from "@/lib/types";
import MiniTitle from "./MiniTitle";

const ProfilePlayground = ({ user }: { user: RawUser }) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 px-6 w-full">
      <MiniTitle>ProfilePlayground</MiniTitle>
    </div>
  );
};

export default ProfilePlayground;
