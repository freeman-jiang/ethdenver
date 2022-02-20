import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import * as React from "react";
import { Footer } from "./Footer";

export const Hero = () => {
  return (
    <>
      <Box as="section" py="7.5rem">
        <Box
          mt="2rem"
          maxW={{ base: "xl", md: "5xl" }}
          mx="auto"
          px={{ base: "6", md: "8" }}
        >
          <Box textAlign="center">
            <Heading
              as="h1"
              size="3xl"
              fontWeight="extrabold"
              maxW="48rem"
              mx="auto"
              lineHeight="1.2"
              letterSpacing="tight"
            >
              Create proxy wallets for your{" "}
              <Text
                as="span"
                bgGradient="linear(to-bl, green.400, #10bb35)"
                bgClip="text"
                fontWeight="extrabold"
              >
                Superfluid
              </Text>{" "}
              payments.
            </Heading>
            <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
              Have piece of mind knowing your streams are sandboxed and isolated
              in dedicated environments.
            </Text>
          </Box>

          <Stack
            justify="center"
            direction={{ base: "column", md: "row" }}
            mt="10"
            mb="20"
            spacing="4"
          >
            <Button
              as="a"
              href="/dashboard"
              size="lg"
              colorScheme="green"
              px="8"
              fontWeight="bold"
              fontSize="md"
            >
              Get started
            </Button>
            <Button
              as="a"
              href="/debug"
              size="lg"
              colorScheme="gray"
              px="8"
              fontWeight="bold"
              fontSize="md"
            >
              Dev mode
            </Button>
          </Stack>
        </Box>
      </Box>
      <Footer />
    </>
  );
};
