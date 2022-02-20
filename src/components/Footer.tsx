import {
  Box,
  ButtonGroup,
  Container,
  IconButton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Logo } from "./Logo";

export const Footer = () => (
  <Box
    bg="green.500"
    color="white"
    position="fixed"
    left="0"
    bottom="0"
    right="0"
  >
    <Container as="footer" role="contentinfo" py={{ base: "12", md: "10" }}>
      <Stack spacing={{ base: "4", md: "5" }}>
        <Stack direction="row" align="center" spacing={4}>
          <Logo w="2rem" />
          <Text fontSize="sm" color="on-accent-subtle">
            {"Built with ❤️ at ETHDenver 2022."}
          </Text>
          <Spacer />
          <ButtonGroup variant="ghost-on-accent">
            <IconButton
              as="a"
              href="#"
              aria-label="LinkedIn"
              icon={<FaLinkedin fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="GitHub"
              icon={<FaGithub fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Twitter"
              icon={<FaTwitter fontSize="1.25rem" />}
            />
          </ButtonGroup>
        </Stack>
      </Stack>
    </Container>
  </Box>
);
