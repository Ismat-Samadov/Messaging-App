import axios from "axios";
import { API_DOMAIN } from "../utils/API_DOMAIN";
import { useState } from "react";

export default function EditProfileBio({ user, setIsEditBioOpen }) {
  const [bio, setBio] = useState(user.bio || "");

  async function handleEdit(e) {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_DOMAIN}/users/bio`, { bio: bio });
      window.location.reload();
      return;
    } catch (err) {
      return;
    }
  }
  return (
    <form className="flex flex-row gap-2" onSubmit={handleEdit}>
      <input
        type="text"
        name="bio"
        className="rounded-md border-2 border-gray-600 bg-transparent p-1"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <button className="submit">Edit</button>
    </form>
  );
}
