import Streamer from "@abi/Streamer.sol/Streamer.json";
import Controller from "@abi/Controller.sol/Controller.json";
import ControllerFactory from "@abi/ControllerFactory.sol/ControllerFactory.json";
import { ethers } from "ethers";
import {
  CONTROLLER_FACTORY_ADDRESS,
  SUPERFLUID_HOST_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
} from "src/constants/mumbai";

interface MetaMaskWindow extends Window {
  ethereum: any;
}

declare var window: MetaMaskWindow;

const requestAccount = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
};

export const getSigner = async () => {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return signer;
  }
};

export const getFactoryContract = async () => {
  if (typeof window.ethereum !== "undefined") {
    const signer = await getSigner();
    const contract = new ethers.Contract(
      CONTROLLER_FACTORY_ADDRESS,
      ControllerFactory.abi,
      signer
    );
    return contract;
  } else {
    throw new Error("No Web 3.0 Provider Found!");
  }
};

export const getControllerAddress = async () => {
  const factoryContract = await getFactoryContract();
  const address = await factoryContract!.getController();
  return address;
};

export const getControllerContract = async () => {
  const signer = await getSigner();
  const address = await getControllerAddress();
  const controllerContract = new ethers.Contract(
    address,
    Controller.abi,
    signer
  );

  return controllerContract;
};

export const createNewStream = async (
  target: string,
  flowRate: number,
  name: string,
  controllerContract: ethers.Contract,
  setStream: (stream: ethers.Contract) => void
) => {
  const signer = await getSigner();
  const address = await signer?.getAddress();
  const filter = controllerContract!.filters.newStream(
    address,
    null,
    null,
    null
  );

  try {
    await controllerContract!.createNewStream(
      SUPERFLUID_HOST_ADDRESS,
      target,
      TOKEN_CONTRACT_ADDRESS.MATICx,
      flowRate,
      name
    );
    controllerContract.once(filter, (owner, address, receiver, flowRate) => {
      console.log(address);
      getStreamerContract(address).then((contract) => setStream(contract));
    });
  } catch (e) {
    console.error(e);
  }
};

export const getStreamerContract = async (address: string) => {
  const signer = await getSigner();
  const streamerContract = new ethers.Contract(address, Streamer.abi, signer);

  return streamerContract;
};

export const getStreamData = async (streamer: ethers.Contract) => {
  const signer = await getSigner();
  try {
    const data = await streamer.getStreamData();
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const deployNewController = async (
  setController: (contract: ethers.Contract) => void
) => {
  const signer = await getSigner();
  const address = await signer?.getAddress();
  const factoryContract = await getFactoryContract();
  const filter = factoryContract!.filters.newController(address, null);

  const transaction = await factoryContract!.deployController();
  factoryContract!.once(filter, (_, contractAddress) => {
    setController(new ethers.Contract(contractAddress, Controller.abi, signer));
  });
  await transaction.wait();
};

export const deactivateController = async () => {
  const factoryContract = await getFactoryContract();
  const transaction = await factoryContract!.deactivateController();
  await transaction.wait();
};

export const approveToken = async (
  amount: number,
  tokenAddress: string,
  contractAddress: string
) => {
  if (typeof window.ethereum !== "undefined") {
    const signer = await getSigner();
    console.log(tokenAddress);
    const contract = new ethers.Contract(
      tokenAddress,
      [
        {
          constant: true,
          inputs: [],
          name: "name",
          outputs: [
            {
              name: "",
              type: "string",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_spender",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_from",
              type: "address",
            },
            {
              name: "_to",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [
            {
              name: "",
              type: "uint8",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              name: "_owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              name: "balance",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "symbol",
          outputs: [
            {
              name: "",
              type: "string",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_to",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              name: "_owner",
              type: "address",
            },
            {
              name: "_spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          payable: true,
          stateMutability: "payable",
          type: "fallback",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
      ],
      signer
    );
    await contract.approve(contractAddress, amount);
  }
};
