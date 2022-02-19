import { ethers } from "ethers";
import { useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";

interface MetaMaskWindow extends Window {
  ethereum: any;
}

declare var window: MetaMaskWindow;

const requestAccount = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
};

const STREAMER_ADDRESS = "0x24B833d4edbffC2f8465Db4F0531C5D6d50d5b22";

const Home = () => {
  const [depositAmount, setDepositAmount] = useState(500);
  const getContract = async () => {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      STREAMER_ADDRESS,
      Streamer.abi,
      signer
    );
    return contract;
  };

  const deposit = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const contract = await getContract();

        const transaction = await contract.deposit(depositAmount);
        console.log(transaction);

        await transaction.wait();
        console.log(transaction);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const increaseAllowance = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const contract = await getContract();

        const transaction = await contract.increaseAllowance(depositAmount);
        console.log(transaction);

        await transaction.wait();
        console.log(transaction);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  return (
    <Box>
      <Input
        w="20vw"
        value={depositAmount}
        type="number"
        onChange={(e) => setDepositAmount(parseInt(e.target.value))}
      />
      <Button onClick={increaseAllowance}>increaseAllowance</Button>
      <Button onClick={deposit}>deposit</Button>
    </Box>
  );
};

export default Home;
