import { Flex, FlexProps } from "@chakra-ui/react";

interface CardProps extends FlexProps {}

export const Card = (props: CardProps) => {
  const { children, ...rest } = props;
  return (
    <Flex rounded="lg" boxShadow="md" direction="column" {...rest}>
      {children}
    </Flex>
  );
};
