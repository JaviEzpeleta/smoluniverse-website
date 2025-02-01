import CreateANewCloneForm from "@/components/CreateANewCloneForm";
import { getUsers } from "@/lib/postgres";

const NewClonePage = async () => {
  const users = await getUsers();
  //   console.log(" 💚 💚 💚 💚 💚 💚 💚 USERS: ", users);

  return (
    <div className="p-6 space-y-6">
      <CreateANewCloneForm />
      <div>Hello!</div>
    </div>
  );
};

export default NewClonePage;
