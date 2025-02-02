import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddFriendButton from "@/components/AddFriendButton";

const Profile = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:3000/api/profile/${params.id}`
      );
      const data = await response.json();
      setUser(data);
    };
    fetchUser();
  }, [params.id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        {user.first_name} {user.last_name}
      </h1>
      <p className="text-gray-600">{user.city}</p>
      <AddFriendButton receiverId={user.id} />
    </div>
  );
};

export default Profile;
