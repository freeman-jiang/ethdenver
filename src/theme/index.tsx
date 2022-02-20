import { extendTheme } from "@chakra-ui/react";
import { theme } from "@chakra-ui/pro-theme";

const customTheme = extendTheme(
  {
    // colors: { ...theme.colors, green: theme.colors.purple },
  },
  theme
);

export default customTheme;
