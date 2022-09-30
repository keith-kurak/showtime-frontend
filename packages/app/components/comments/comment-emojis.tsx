import React from "react";
import { Pressable } from "react-native";

import { Text } from "@showtime-xyz/universal.text";
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
          <Text tw="text-2xl">{emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
};
