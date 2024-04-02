const Conversation = require("../models/conversation");
const User = require("../models/user");
const Message = require("../models/message");
const mongoose = require("mongoose");

exports.post_conversation = async (req, res, next) => {
  try {
    // need to get both to populate the Schema.Types.ObjectId, string of the _id is not enough.
    const user = await User.findById(req.user.user._id);
    const participant = await User.findById(req.params.participant_id);

    // create an array with the two users _id
    const participants = [user._id, participant._id];

    if (!participant) {
      return res.status(404).json({ errors: "Participant user not found." });
    }

    // not allowing creation of a conversation that already exists between two users.
    const existsConversation = await Conversation.findOne({
      participants: {
        $all: [user._id, participant._id],
      },
    });

    if (existsConversation) {
      return res
        .status(409)
        .json({ errors: "You have a conversation with this person already." });
    }

    // not allowing creation of a conversation without any message.
    if (!req.body.content) {
      return res.status(404).json({
        errors:
          "Sending a message is the first step to starting a conversation.",
      });
    }

    // await the creation of a new conversation so we can pass it on property conversation_id of the Message Schema
    const conversation = new Conversation({
      participants: participants,
      creation: Date.now(),
      update: Date.now(),
    });

    await conversation.save();

    // having the conversation created, pass it as conversation_id
    const message = new Message({
      conversation_id: conversation._id,
      sender: user._id,
      recipient: participant._id,
      content: req.body.content,
      timestamp: Date.now(),
    });

    await message.save();

    return res.status(200).json({
      message: `You've created a conversation with ${participant._id}`,
      conversation_id: conversation._id,
    });
  } catch (err) {
    return next(err);
  }
};

exports.get_conversations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user._id);

    const conversations = await Conversation.find(
      {
        participants: { $all: [user._id] },
      },
      "update"
    )
      .populate({
        path: "participants",
        select: "username first_name profile_pic_src",
      })
      .sort({ update: -1 });
    // Only need to send the information of the other participant.
    // Filter through participants and send the information of the _id,
    // that doesn't match the user._id.
    const userIdString = user._id.toString();

    const allUserConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // Get the last message of each conversation.
        const getLastMessage = async () => {
          const lastMessage = await Message.find(
            {
              conversation_id: conversation._id,
            },
            "sender content timestamp isRead"
          ).populate({ path: "sender", select: "username" });
          return lastMessage[lastMessage.length - 1];
        };

        const lastMessage = await getLastMessage();
        // Filter out the current user's participant object
        const participantsExceptCurrentUser = conversation.participants.filter(
          (participant) => participant._id.toString() !== userIdString
        );

        return {
          conversation_id: conversation._id,
          participant: participantsExceptCurrentUser[0],
          lastMessage,
        };
      })
    );

    return res.json({ allUserConversations });
  } catch (err) {
    return next(err);
  }
};

exports.get_conversation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user._id);

    const conversation = await Conversation.findById(
      req.params.conversation_id
    ).populate({
      path: "participants",
      select: "username first_name profile_pic_src",
    });

    const participantExceptCurrentUser = conversation.participants.filter(
      (participant) => participant._id.toString() !== user._id.toString()
    );

    const isUserInConversation = conversation.participants.some(
      (participant) => participant._id.toString() === user._id.toString()
    );

    if (!isUserInConversation) {
      return res
        .status(401)
        .json({ errors: "Your are not in this conversation" });
    }

    return res.json({
      conversation_id: conversation._id,
      conversation_creation: conversation.utc_creation,
      participant: participantExceptCurrentUser,
    });
  } catch (err) {
    return next(err);
  }
};
