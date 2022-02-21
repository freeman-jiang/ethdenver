import {
  Alert,
  AlertIcon,
  Button,
  Code,
  Divider,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import { getStreamData, getStreamerContract } from "@services";
import { Card } from "./Card";
import { ADDRESS_RESOLVER } from "src/constants/mumbai";

interface Props {
  address: string;
  onClick: () => void;
}

interface StreamData {
  _active: boolean;
  _balance: ethers.BigNumber;
  _eta: ethers.BigNumber;
  _flowRate: ethers.BigNumber;
  _name: string;
  _receiver: string;
  _token: string;
}

export const InfoButton = ({ address, onClick }: Props) => {
  const streamerDisplayAddress = useBreakpointValue({
    base: (address: string) => truncateEthAddress(address),
    xl: (address: string) => address,
  });

  const formatAddress = useBreakpointValue({
    base: (address: string) => truncateEthAddress(address),
    md: (address: string) => address,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stream, setStream] = useState<ethers.Contract>();
  const [streamData, setStreamData] = useState<StreamData>();
  const [deposit, setDeposit] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const contract = await getStreamerContract(address);
      setStream(contract);
      setStreamData(await getStreamData(contract));
    };
    init();
  }, []);

  console.log(stream);
  console.log(streamData);

  return (
    <>
      {streamData && stream && (
        <>
          <Button
            my={"0.2rem"}
            onClick={() => {
              onClick();
              onOpen();
            }}
          >
            {streamData._name}
          </Button>
          <Modal onClose={onClose} isOpen={isOpen} isCentered size="2xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Stream Information:</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {streamData._eta.lt(172800) ? (
                  <Alert my="0.5rem" status="warning" rounded="md">
                    <AlertIcon />
                    <Text fontSize={"sm"}>
                      Your balance is running out! Top up or close the stream to
                      avoid losing your{" "}
                      <Link
                        isExternal
                        href="https://docs.superfluid.finance/superfluid/sentinels/liquidations-and-toga"
                        fontWeight={"bold"}
                      >
                        security deposit.
                      </Link>
                    </Text>
                  </Alert>
                ) : null}
                <Grid
                  mt="1rem"
                  templateColumns={{ base: "1", md: "1fr 2fr" }}
                  templateRows="repeat(auto, 1fr)"
                >
                  <GridItem>Stream name:</GridItem>
                  <GridItem>
                    <Code>{streamData._name}</Code>
                  </GridItem>
                  <GridItem>Supertoken: </GridItem>
                  <GridItem>
                    <Code>{ADDRESS_RESOLVER.get(streamData._token)}</Code>
                  </GridItem>
                  <GridItem>Recipient address:</GridItem>
                  <GridItem>
                    <Code>{formatAddress!(streamData._receiver)}</Code>
                  </GridItem>
                  <GridItem>Stream balance:</GridItem>
                  <GridItem>
                    <Code>
                      {BigNumber.from(streamData._balance)
                        .div("1000000000000000000")
                        .toNumber()
                        .toFixed(6)}
                    </Code>
                  </GridItem>
                  <GridItem>Flow rate:</GridItem>
                  <GridItem>
                    <Code>
                      {streamData._flowRate.toString()} wei per second
                    </Code>
                  </GridItem>
                  <GridItem>Estimated time:</GridItem>
                  <GridItem>
                    <Code>{streamData._eta.toString()} seconds</Code>
                  </GridItem>
                  <GridItem>Active stream:</GridItem>
                  <GridItem>
                    <Code>{streamData._active.toString()}</Code>
                  </GridItem>
                </Grid>

                <Divider my="1rem" />
                <Text fontWeight="medium" fontSize="xl" mb="1rem">
                  Initialize Stream
                </Text>
                <VStack w="100%">
                  <Input
                    placeholder="Deposit Amount"
                    // value={depositAmount}
                    // onChange={(e) => setDeposit(parseFloat(e.target.value))}
                  />
                  <NumberInput
                    min={0}
                    maxW="8rem"
                    mr="2rem"
                    precision={3}
                    step={0.001}
                    value={deposit}
                    // onChange={(value) => setDeposit(parseInt(value))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </VStack>
                <Button
                  onClick={() => {
                    // if (depositAmount !== undefined && depositAmount > 0) {
                    //   approveToken(
                    //     depositAmount!,
                    //     TOKEN_CONTRACT_ADDRESS.MATICx,
                    //     stream.address
                    //   );
                    // }
                  }}
                  mt="0.75rem"
                  colorScheme={"teal"}
                >
                  1. Approve MATICx
                </Button>

                <Button
                  mt="0.75rem"
                  colorScheme={"teal"}
                  // onClick={() => {
                  //   stream.deposit(depositAmount);
                  // }}
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
                    stream.withdraw(streamData._balance);
                  }}
                >
                  Withdraw All Funds
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

{
  /* <GridItem>
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
        stream.withdraw(streamData![4]);
      }}
    >
      Withdraw All Funds
    </Button>
  </Card>
</GridItem>; */
}
