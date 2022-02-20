import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Code,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Text,
  VStack,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavBar } from "@components/NavBar";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  approveToken,
  createNewStream,
  deactivateController,
  deployNewController,
  getControllerAddress,
  getControllerContract,
  getStreamerContract,
} from "@services";
import { Card } from "@components/Card";
import { FaChevronDown } from "react-icons/fa";
import truncateEthAddress from "truncate-eth-address";
import { TOKEN_CONTRACT_ADDRESS } from "src/constants/mumbai";
import { InfoButton } from "@components/InfoButton";

interface MetaMaskWindow extends Window {
  ethereum: any;
}
declare var window: MetaMaskWindow;

interface StreamData {
  _active: boolean;
  _balance: ethers.BigNumber;
  _eta: ethers.BigNumber;
  _flowRate: ethers.BigNumber;
  _name: string;
  _receiver: string;
  _token: string;
}

const Dashboard = () => {
  const Overlay = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState(
    "0x6D04df042bd59a027e1025771629E6Fd512f5b39"
  );

  const [network, setNetwork] = useState({} as any);
  const [step, setStep] = useState(0);
  const [controller, setController] = useState<ethers.Contract>();

  const [streamName, setStreamName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [flowRate, setFlowRate] = useState("");

  const [streamers, setStreamers] = useState<string[]>();
  const [streamData, setStreamData] = useState<StreamData>();
  const [stream, setStream] = useState<ethers.Contract>();
  const [depositAmount, setDeposit] = useState(0);

  const toast = useToast();

  const Step0 = () => (
    <Box>
      <ModalHeader textAlign={"center"}>
        <Heading fontSize={"1.7rem"}>Connect your wallet</Heading>
      </ModalHeader>
      <ModalBody textAlign={"center"}>
        <Flex
          rounded="md"
          px="2rem"
          py="0.75rem"
          justifyContent={isLoading ? "center" : "space-between"}
          alignItems={"center"}
          w="100%"
          cursor={"pointer"}
          border="1px"
          borderColor="gray.200"
          _hover={{
            borderColor: "gray.500",
          }}
          onClick={initialize}
          h="3.8rem"
        >
          {isLoading ? (
            <Spinner color="green" />
          ) : (
            <>
              <Text fontWeight={"bold"} fontSize="1.1rem">
                Metamask
              </Text>
              <Image alt="MetaMask logo" src="/metamask-fox.svg" w="2rem" />
            </>
          )}
        </Flex>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Box>
  );

  const Step1 = () => (
    <Box>
      <ModalHeader textAlign={"center"}>
        <Heading fontSize={"1.7rem"} lineHeight="130%">
          {"Looks like you're new! Start by creating a SuperController."}
        </Heading>
      </ModalHeader>
      <ModalBody textAlign={"center"}>
        <Text>SuperX will use it to create proxy wallets for you.</Text>
        <Button
          mt="1.5rem"
          colorScheme={"green"}
          onClick={async () => {
            setIsLoading(true);
            try {
              await deployNewController(setController);
              onClose();
              setStep(2);
            } catch (err) {
              console.error(err);
              toast({
                title: "Something went wrong!",
                description: "Please try again.",
                status: "error",
                duration: 8000,
                isClosable: true,
                position: "top",
              });
            } finally {
              setIsLoading(false);
            }
          }}
          w="17ch"
        >
          {isLoading ? <Spinner /> : "Deploy Controller"}
        </Button>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Box>
  );

  const initialize = async () => {
    if (typeof window.ethereum !== "undefined") {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setUserAddress(await signer.getAddress());
      const address = await getControllerAddress();

      if (address !== "0x0000000000000000000000000000000000000000") {
        setController(await getControllerContract());
        const controller2 = await getControllerContract();
        setStreamers(await controller2.getAllStreamers());
        setStep(2);
        onClose();
      } else {
        setStep(1);
      }
      setIsLoading(false);
    } else {
      toast({
        title: "No Web 3.0 Provider Found!",
        description: "Please install Metamask and try again.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    if (controller) {
      controller
        .getAllStreamers()
        .then((streamers: string[]) => setStreamers(streamers));
    }
  }, [stream, controller]);

  const getModalContent = () => {
    switch (step) {
      case 0:
        return <Step0 />;
      case 1:
        return <Step1 />;
      default:
        return <Step0 />;
    }
  };

  const modalSize = useBreakpointValue({ base: "xs", sm: "sm", md: "lg" });

  return (
    <>
      <NavBar userAddress={userAddress} />
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size={modalSize}
      >
        <Overlay />
        <ModalContent py="1.5rem">{getModalContent()}</ModalContent>
      </Modal>

      <Grid
        mt="4rem"
        templateColumns={{ base: "1", md: "repeat(2, 1fr)" }}
        templateRows="1"
        columnGap="2rem"
        mx={{ base: "2vw", md: "5vw", xl: "12rem" }}
        mb={{ base: "5rem", md: "0" }}
      >
        <GridItem>
          <Card mx="auto" p={"2rem"} h="37rem">
            <Heading alignSelf="center" fontSize="3xl">
              View streams
            </Heading>
            {streamers &&
              streamers.map((address: string, index: number) => {
                return (
                  // <Button
                  //   key={index}
                  //   onClick={async () => {
                  //     const contract = await getStreamerContract(address);
                  //     setStream(contract);
                  //     setStreamData(await contract.getStreamData());
                  //   }}
                  // >
                  //   <Code bg="transparent">
                  //     {streamerDisplayAddress!(address)}
                  //   </Code>
                  // </Button>

                  <InfoButton
                    key={index}
                    address={address}
                    onClick={async () => {
                      const contract = await getStreamerContract(address);
                      setStream(contract);
                      setStreamData(await contract.getStreamData());
                    }}
                  />
                );
              })}
            <Button
              mt="0.75rem"
              colorScheme={"red"}
              onClick={() => {
                try {
                  deactivateController().then(() => {
                    setStep(0);
                    onOpen();
                  });
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              Deactivate controller
            </Button>
          </Card>
        </GridItem>
        <GridItem>
          <Card mx="auto" p={"2rem"} h="37rem">
            <Heading alignSelf="center" fontSize="3xl">
              Manage streams
            </Heading>
            <Text fontWeight="medium" fontSize="xl" mb="1rem">
              Create new stream
            </Text>
            <VStack w="100%">
              <Input
                placeholder="Name"
                value={streamName}
                onChange={(e) => setStreamName(e.target.value)}
              />
              <Input
                type="text"
                value={recipientAddress}
                placeholder="Recipient address"
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
              <Input
                type="text"
                value={flowRate}
                placeholder="Flow rate"
                onChange={(e) => setFlowRate(e.target.value)}
              />
            </VStack>
            <Button
              mt="1rem"
              colorScheme={"green"}
              onClick={() => {
                createNewStream(
                  recipientAddress,
                  parseFloat(flowRate),
                  streamName,
                  controller!,
                  setStream
                ).then(() => {
                  controller!
                    .getAllStreamers()
                    .then((list: string[]) => console.log(list));
                });
              }}
            >
              Create stream
            </Button>
            <Text mt="1.5rem" fontWeight="medium" fontSize="xl" mb="1rem">
              Edit an existing stream
            </Text>

            <Button colorScheme={"teal"}>Change recipient</Button>
            <Button mt="0.75rem" colorScheme={"teal"}>
              Change flow rate
            </Button>
            <Button colorScheme="teal" mt="0.75rem">
              Change token
            </Button>
          </Card>
        </GridItem>

        {stream ? (
          <GridItem>
            <Card mx="auto" p={"2rem"} h="37rem">
              <Heading alignSelf="center" fontSize="3xl">
                {truncateEthAddress(stream.address)}
              </Heading>
              <Text fontWeight="medium" fontSize="xl" mb="1rem">
                Deposit
              </Text>
              <VStack w="100%">
                <Input
                  placeholder="Deposit Amount"
                  value={depositAmount}
                  onChange={(e) => setDeposit(parseFloat(e.target.value))}
                />
              </VStack>
              <Button
                onClick={() => {
                  if (depositAmount !== undefined && depositAmount > 0) {
                    approveToken(
                      depositAmount!,
                      TOKEN_CONTRACT_ADDRESS.MATICx,
                      stream.address
                    );
                  }
                }}
                mt="0.75rem"
                colorScheme={"teal"}
              >
                1. Approve MATICx
              </Button>

              <Button
                mt="0.75rem"
                colorScheme={"teal"}
                onClick={() => {
                  stream.deposit(depositAmount);
                }}
              >
                2. Deposit MATICx
              </Button>

              <Button
                mt="0.75rem"
                colorScheme={"teal"}
                onClick={() => {
                  stream.openStream();
                }}
              >
                3. Open Stream
              </Button>

              <Button
                mt="0.75rem"
                colorScheme={"red"}
                onClick={() => {
                  stream.closeStream();
                }}
              >
                Close Stream
              </Button>

              <Button
                mt="0.75rem"
                colorScheme={"red"}
                onClick={() => {
                  stream.withdraw(streamData!._balance);
                }}
              >
                Withdraw All Funds
              </Button>
            </Card>
          </GridItem>
        ) : null}
      </Grid>
    </>
  );
};

export default Dashboard;
