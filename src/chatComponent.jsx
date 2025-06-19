// src/ChatComponent.jsx
import React from "react";
import ChatBubble, { useConvaiClient } from "convai-chatui-sdk";

const ChatComponent = () => {
  const characterId = "c2df0b48-252a-11f0-bf51-42010a7be01a";
  const apiKey      = "d7edfc1b440dac9a71b601ecc251e450";
  const { client }  = useConvaiClient(characterId, apiKey);

  return (
    <div id="convai-root">
      <div className="convai-chatui-container">
        <ChatBubble
          client={client}
          chatHistory="Show"
          chatUiVariant="Sequential Line Chat"
          //openOnInit={false}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
