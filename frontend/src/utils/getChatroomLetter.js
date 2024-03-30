export default (chatroom, user) => {
  if (!chatroom) return null;
  if (chatroom.title) return chatroom.title.at(0);
  return chatroom.participants
    .filter((e) => e._id !== user._id)[0]
    .username.at(0)
    .toUpperCase();
};
