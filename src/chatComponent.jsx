// src/ChatComponent.jsx
import React from "react";
import ChatBubble, { useConvaiClient } from "convai-chatui-sdk";

const ChatComponent = () => {
  const characterId = "b9b15750-4ba5-11f0-ad5c-42010a7be01f";
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
