import React, { useState } from "react";
import { searchUsers } from "@/services/apiClient";

interface TagUserProps {
  postId: number;
  onTagAdded: () => void;
}

const TagUser: React.FC<TagUserProps> = ({ postId, onTagAdded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const results = await searchUsers({ name: searchTerm });
      setUsers(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setLoading(false);
  };

  const handleTagUser = async (userId: number) => {
    try {
      await fetch(`http://localhost:3000/api/posts/${postId}/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      onTagAdded();
    } catch (error) {
      console.error("Error tagging user:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h3 className="text-lg font-bold mb-2">Tag User</h3>
      <input
        type="text"
        placeholder="Search user by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 w-full border rounded bg-gray-700 text-white"
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-blue-500 p-2 rounded w-full hover:bg-blue-600"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {users.length > 0 && (
        <ul className="mt-3">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between p-2 border-b">
              <span>
                {user.name} {user.surname}
              </span>
              <button
                onClick={() => handleTagUser(user.id)}
                className="bg-green-500 px-2 py-1 rounded text-white"
              >
                Tag
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagUser;
