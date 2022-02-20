import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import truncateEthAddress from "truncate-eth-address";

interface Props {
  userAddress: string;
}

export const NavBar = ({ userAddress }: Props) => {
  return (
    <Container maxW={"110ch"}>
      <Flex
        mt="1.5rem"
        flexDirection="row"
        justifyContent="space-between"
        alignItems={"center"}
      >
        <Box
          alignSelf={"center"}
          rounded="lg"
          bg="green.400"
          py="0.5rem"
          px="1rem"
          color="white"
          fontFamily={"DM Sans"}
          fontWeight={"bold"}
        >
          <Text>{truncateEthAddress(userAddress)}</Text>
        </Box>

        <Heading fontSize={"5xl"} display={{ base: "none", md: "block" }}>
          SuperX
        </Heading>

        <Box
          display={{ base: "block", md: "none" }}
          alignSelf={"center"}
          bg="purple.500"
          py="0.5rem"
          px="1rem"
          color="white"
          fontFamily={"DM Sans"}
          fontWeight="bold"
          rounded="lg"
        >
          <Text>Polygon Mumbai</Text>
        </Box>

        <Box
          display={{ base: "none", md: "block" }}
          alignSelf={"center"}
          bg="purple.500"
          py="0.5rem"
          px="1rem"
          color="white"
          fontFamily={"DM Sans"}
          fontWeight="bold"
          rounded="lg"
        >
          <Text>Polygon Mumbai</Text>
        </Box>
      </Flex>
    </Container>
  );
};
