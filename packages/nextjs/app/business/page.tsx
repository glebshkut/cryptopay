"use client";

import { useMemo, useState } from "react";
import { sepolia } from "viem/chains";
import { useAccount, useDeployContract } from "wagmi";
import { EtherInput, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";

export default function Business() {
  const { address: connectedAddress } = useAccount();
  const { deployContract } = useDeployContract();
  const [value, setValue] = useState<string>("0");
  const [productName, setProductName] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [params, setParams] = useState<Record<string, string>>({
    merchantId: Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6),
    productId: Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6),
    amount: value,
    email: "",
    userId: "",
  });

  const onDeployContract = async () => {
    if (!connectedAddress) return;
    deployContract({
      abi: deployedContracts[sepolia.id].MasterMerchant.abi,
      bytecode: deployedContracts[sepolia.id].MasterMerchant.bytecode as `0x${string}`,
      args: [connectedAddress, BigInt(10)],
    });
  };

  const productUrl = useMemo(() => {
    const newParams = { ...params };
    const afterPath = new URLSearchParams(Object.entries(newParams)).toString();
    if (typeof window !== "undefined") {
      return window.location.origin + "/purchase?" + afterPath;
    }
    return "";
  }, [params]);

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
            <EtherInput
              placeholder="Product price"
              value={value}
              onChange={value => {
                setValue(value);
                setParams(prev => {
                  return { ...prev, amount: value };
                });
              }}
            />
            <input
              type="text"
              placeholder="Webhook url"
              className="input input-bordered w-full"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
            />
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                // TODO: implement create product
              }}
            >
              Create a product
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <li className="italic">Redirect your customer to this url</li>
            <input type="text" className="input input-bordered w-full" value={productUrl} disabled />
            {Object.entries(params).map(([key, value], index) => {
              const disabled = index < 3;
              return (
                <div key={index} className="flex flex-row justify-between gap-1 w-full">
                  <input
                    className={`input input-bordered ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    value={key}
                    onChange={e => {
                      if (disabled) return;
                      const newKey = e.target.value;
                      setParams(prev => {
                        const newParams: Record<string, string> = {};
                        Object.entries(prev).forEach(([k, v]) => {
                          if (k === key) {
                            newParams[newKey] = v;
                          } else {
                            newParams[k] = v;
                          }
                        });
                        return newParams;
                      });
                    }}
                  />
                  <input
                    className={`input input-bordered ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    value={value}
                    onChange={e => {
                      if (disabled) return;
                      setParams(prev => ({
                        ...prev,
                        [key]: e.target.value,
                      }));
                    }}
                  />
                </div>
              );
            })}
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                // copy to clipboard
                navigator.clipboard.writeText(productUrl);
              }}
            >
              Copy to clipboard
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
}
