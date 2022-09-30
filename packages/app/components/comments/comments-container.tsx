import { useEffect } from "react";
import { ViewProps } from "react-native";

import { AvoidSoftInput } from "react-native-avoid-softinput";

export function CommentsContainer({ children }: ViewProps) {
  // we're handling keyboard here with a keyboardavoidingview.
  // TODO: Refactor, replace keyboard avoid view
  useEffect(() => {
    AvoidSoftInput.setEnabled(false);

    return () => {
      AvoidSoftInput.setEnabled(true);
    };
  }, []);

  return children;
}
