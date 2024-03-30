export default (chatroom, user) => {
  if (!chatroom) return null;
  if (chatroom.title) return chatroom.title;

  const participantsWithoutUser = chatroom.participants.filter((e) => e._id !== user._id);

  if (chatroom.participants.length === 2) return participantsWithoutUser[0].username;

  const usernamesList = participantsWithoutUser.reduce((acc, val, i) => {
    if (i !== participantsWithoutUser.length - 1) return acc.concat(`${val.username}, `);
    return acc.concat(val.username);
  }, '');

  return `Group Chat with ${usernamesList}`;
};
