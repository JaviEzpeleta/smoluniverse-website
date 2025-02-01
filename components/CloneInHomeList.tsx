import { RawUser } from "@/lib/types";

const CloneInHomeList = ({
  clone,
  index,
}: {
  clone: RawUser;
  index: number;
}) => {
  return <div className="hello p-4 rounded-lg">{clone.handle}</div>;
};

export default CloneInHomeList;
