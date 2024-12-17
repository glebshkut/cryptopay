import {
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
  toHex,
  hexToString,
  Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import {
  abi,
  bytecode,
} from "../artifacts/contracts/MasterMerchant.sol/MasterMerchant.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  /////////////////

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  /////////////////

  console.log("\nDeploying Ballot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [deployer.account.address, 10],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);

  /////////////////

  const wallets = await publicClient.readContract({
    address: "0xBc6509Cb3C19Aa9877a92E94fbaFc844Ed478E4b",
    abi,
    functionName: "wallets",
    args: [BigInt(0)],
  }) as any[];

  // The address should be in wallets[0][1] assuming the struct in your smart contract 
  // has address as the second field
  console.log("Wallet address:", wallets[0][1]);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});