import { useSafeAreaInsets } from "react-native-safe-area-context";

// The pieces InkTabBar actually renders with — exported so its stylesheet
// reads from here instead of duplicating the numbers, and so screens that
// need to clear the absolutely-positioned tab bar use the same total it
// actually renders at, instead of an independently-guessed constant.
export const TAB_BAR_PADDING_TOP = 8;
export const TAB_BAR_BORDER_WIDTH = 1.5;
// paddingVertical 4*2 + icon 22 + gap 3 + caption lineHeight 16
const TAB_ITEM_HEIGHT = 49;

export const TAB_BAR_CONTENT_HEIGHT = TAB_BAR_PADDING_TOP + TAB_ITEM_HEIGHT + TAB_BAR_BORDER_WIDTH;

export function useTabBarHeight(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_CONTENT_HEIGHT + Math.max(insets.bottom, 10);
}
