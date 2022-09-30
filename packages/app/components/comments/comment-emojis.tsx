import React from "react";
import { Pressable, Text } from "react-native";

import { View } from "@showtime-xyz/universal.view";

export const CommentEmojis = ({
  onEmojiSelect,
}: {
  onEmojiSelect: (v: string) => void;
}) => {
  return (
    <View tw="flex-row justify-evenly">
      {["❤️", "😂", "🎉", "😢", "😮", "😅", "😊"].map((emoji) => (
        <Pressable
          key={emoji}
          style={{ padding: 16 }}
          onPress={() => onEmojiSelect(emoji)}
        >
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
};
