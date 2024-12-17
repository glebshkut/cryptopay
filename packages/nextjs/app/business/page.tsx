"use client";

import { useState } from "react";
import { useAccount, useDeployContract } from "wagmi";
import { EtherInput, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";

export default function Business() {
  const { address: connectedAddress } = useAccount();
  const { deployContract, data: deployContractData } = useDeployContract();
  console.log("🚀 ~ Business ~ deployContractData:", deployContractData);
  const [value, setValue] = useState<string>("0");
  const [productName, setProductName] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");

  const onCreateProduct = () => {
    setValue("0");
    setProductName("");
    setWebhookUrl("");
  };

  const onDeployContract = async () => {
    if (!connectedAddress) return;
    deployContract({
      abi: deployedContracts[31337].MasterMerchant.abi,
      bytecode: deployedContracts[31337].MasterMerchant.bytecode as `0x${string}`,
      args: [connectedAddress, BigInt(10)],
    });
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 gap-5">
      <h1 className="text-4xl">Register your Business</h1>
      <div className="flex flex-col items-start gap-5 w-full px-10">
        <span className="text-xl font-medium">Follow these steps to start using CryptoPay:</span>
        <ul className="list-decimal w-full md:w-1/2 flex flex-col gap-3 px-10">
          {!connectedAddress && (
            <div className="flex flex-col items-center justify-center gap-2">
              <li className="italic">Connect your wallet</li>
              <RainbowKitCustomConnectButton className="w-full h-[48px]" />
            </div>
          )}
          <div className="flex flex-col items-center justify-center gap-2">
            <li className="italic">Create a smart contract</li>
            <button className="btn btn-primary w-full" onClick={onDeployContract}>
              Create
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <li className="italic">Create a product</li>
            <input
              type="text"
              placeholder="Product name"
              className="input input-bordered w-full"
              value={productName}
              onChange={e => setProductName(e.target.value)}
            />
            <EtherInput placeholder="Product price" value={value} onChange={setValue} />
            <input
              type="text"
              placeholder="Webhook url"
              className="input input-bordered w-full"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
            />
            <button className="btn btn-primary w-full" onClick={onCreateProduct}>
              Create a product
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
}
