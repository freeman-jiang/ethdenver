import {
  Flex,
  Spinner,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { deployNewController, getControllerAddress } from "@services";
import { useEffect, useState } from "react";

export const Step0 = () => {
  return (
    <Flex w="100%" justifyContent={"center"} mt="5rem">
      <Spinner />
    </Flex>
  );
};

export const Step1 = () => {
  const [controllerAddress, setControllerAddress] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const Overlay = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
  );

  useEffect(() => {
    const init = async () => {
      const res = await getControllerAddress();
      console.log(res);
      setControllerAddress(res);
    };
    init();
  }, []);

  const handleClick = async () => {
    deployNewController(setControllerAddress);
  };

  return (
    <>
      {controllerAddress === "0x0000000000000000000000000000000000000000" ? (
        <Modal
          isCentered
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
          size={"md"}
        >
          <Overlay />
          <ModalContent py="1.5rem">
            <ModalHeader textAlign={"center"}>
              <Heading fontSize={"1.7rem"}>Connect Your Wallet</Heading>
            </ModalHeader>

            <ModalBody textAlign={"center"}>
              <Flex w="100%" direction="column" alignItems={"center"} mt="5rem">
                <Button onClick={handleClick}>Deploy Controller</Button>
              </Flex>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <Flex w="100%" justifyContent={"center"} mt="5rem">
          {controllerAddress}
        </Flex>
      )}
    </>
  );
};
