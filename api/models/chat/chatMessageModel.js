const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../utils/sequelize");
const Chat = require("./chatModel");

class ChatMessage extends Model {
  static async findLatestByChatId(chatId) {
    return this.findOne({
      where: { chatid: chatId },
      order: [['createdat', 'DESC']],
    });
  }
}

ChatMessage.init(
  {
    messageid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chatid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chats',
        key: 'chatid',
      },
    },
    senderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ChatMessage",
    timestamps: false,
    tableName: "chatmessage",
    indexes: [
      {
        fields: ['chatid'],
      },
      {
        fields: ['createdat'],
      },
      {
        fields: ['chatid', 'createdat'],
      },
    ],
    hooks: {
      afterCreate: (message, options) => {
        console.log('New message created:', message.messageid, 'in chat:', message.chatid);
      },
    },
  }
);

ChatMessage.belongsTo(Chat, {
  foreignKey: "chatid",
  as: "Chat",
});

Chat.hasMany(ChatMessage, {
  foreignKey: "chatid",
  as: "Messages",
});

module.exports = ChatMessage;