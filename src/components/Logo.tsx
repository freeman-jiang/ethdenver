import { forwardRef, Image, ImageProps } from "@chakra-ui/react";

export const Logo = forwardRef<ImageProps, "div">((props, ref) => {
  return <Image alt="logo" src="/logo.svg" ref={ref} {...props} />;
});
