import {
  Input,
  Text,
  Button,
  Container,
  Flex,
  Heading,
  Code,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import BiChevronDown from "react-icons";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  deployNewController,
  getControllerAddress,
  getControllerContract,
  getStreamerContract,
  getStreamData,
  deactivateController,
  createNewStream,
} from "@services";
import {
  SUPERFLUID_HOST_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
} from "src/constants/mumbai";

interface MetaMaskWindow extends Window {
  ethereum: any;
}

declare var window: MetaMaskWindow;

const Debug = () => {
  const [controller, setController] = useState<ethers.Contract>();
  const [addressInput, setAddressInput] = useState(
    "0xEa5cEBED0F460cB8234a044D48C38202680b6188"
  );
  const [flowRate, setFlowRate] = useState<number>();
  const [newStreamName, setNewStreamName] = useState("");

  const [streamers, setStreamers] = useState<string[]>([]);
  const [stream, setStream] = useState<ethers.Contract>();
  const [streamData, setStreamData] = useState<string[]>();
  const [depositAmount, setDepositAmount] = useState<number>();

  const start = async () => {
    const controllerContract = await getControllerContract();
    setController(controllerContract);

    try {
      const list = await controllerContract.getAllStreamers();
      console.log(list);
      setStreamers(list);
      const streamContract = await getStreamerContract(list[0]);
      setStream(streamContract);
      getData(streamContract);
    } catch (e) {
      console.error(e);
    }
  };

  const getData = (stream: ethers.Contract) => {
    getStreamData(stream).then((data) => {
      setStreamData([
        data._name,
        data._receiver,
        data._token,
        data._flowRate,
        data._balance,
        data._eta,
      ]);
    });
  };

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (stream !== undefined) {
      getData(stream);
    }
  }, [stream]);

  return (
    <Container mt="4rem">
      <Heading textAlign={"center"}>SuperX Debug Dashboard</Heading>
      {controller !== undefined && (
        <Text textAlign="center" my={2} fontWeight="bold">
          My Controller: <Code fontWeight="normal">{controller.address}</Code>
        </Text>
      )}
      {controller === undefined ||
      controller.address === "0x0000000000000000000000000000000000000000" ? (
        <Flex direction={"column"} gap="1rem" mt="1rem">
          {" "}
          <Button
            onClick={() => {
              deployNewController(setController);
            }}
          >
            Deploy Controller
          </Button>
        </Flex>
      ) : (
        <>
          <Input
            placeholder="Stream Name"
            value={newStreamName}
            onChange={(e) => setNewStreamName(e.target.value)}
          />
          <Input
            type="text"
            value={addressInput}
            placeholder="Stream Target"
            onChange={(e) => setAddressInput(e.target.value)}
          />
          <Input
            type="number"
            value={flowRate}
            placeholder="Flow Rate"
            onChange={(e) => setFlowRate(parseInt(e.target.value))}
          />
          <Flex direction={"column"} gap="1rem" mt="1rem">
            <Button
              onClick={() => {
                if (!flowRate) {
                  return;
                }
                createNewStream(
                  addressInput,
                  flowRate,
                  newStreamName,
                  controller,
                  setStream
                ).then(() => {
                  controller
                    .getAllStreamers()
                    .then((list: string[]) => setStreamers(list));
                });
              }}
            >
              Create New Stream
            </Button>
          </Flex>
          <Flex direction={"column"} gap="1rem" mt="1rem">
            <Button
              onClick={() => {
                deactivateController();
              }}
            >
              Clear Controllers
            </Button>
          </Flex>
          {stream && (
            <>
              <Flex direction={"column"} gap="1rem" mt="1rem">
                <Menu>
                  <MenuButton as={Button} rightIcon={BiChevronDown}>
                    {stream.address}
                  </MenuButton>
                  <MenuList>
                    {streamers.map((address, index) => {
                      return (
                        <MenuItem
                          key={index}
                          onClick={() => {
                            getStreamerContract(address).then((contract) =>
                              setStream(contract)
                            );
                          }}
                        >
                          {address}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Menu>
              </Flex>
              {streamData !== undefined && (
                <Flex direction={"column"} gap="1rem" mt="1rem">
                  <Stack>
                    <Text>Name: {streamData[0].toString()}</Text>
                    <Text>Token: {streamData[2].toString()}</Text>
                    <Text>Recipient: {streamData[1].toString()}</Text>
                    <Text>Balance: {streamData[4].toString()}</Text>
                    <Text>Flow Rate: {streamData[3].toString()}</Text>
                    <Text>ETA: {streamData[5].toString()}</Text>
                  </Stack>

                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(parseInt(e.target.value))}
                    placeholder="Deposit Amount"
                  />

                  <Button
                    onClick={() => {
                      stream.deposit(depositAmount);
                    }}
                  >
                    Deposit
                  </Button>
                </Flex>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Debug;
