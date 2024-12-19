"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

function PurchaseContent() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);

  const { data: wallets } = useReadContract({
    address: deployedContracts[11155111].MasterMerchant.address,
    abi: deployedContracts[11155111].MasterMerchant.abi,
    functionName: "getAllWallets",
  });

  if (!params.productId || !params.merchantId || !params.amount) return;

  const amountEth = +params.amount / nativeCurrencyPrice;

  const handleCopyToClipboard = (text: string, type: "amount" | "address") => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      notification.success(<span>Copied {type} to the clipboard!</span>);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 gap-5">
      <span>
        Purchase <b>Spotify Subscription</b> on <b>Spotify.com</b>
      </span>
      {wallets && (
        <>
          <span>
            Transfer{" "}
            {nativeCurrencyPrice !== 0 && (
              <span
                className="underline underline-offset-2 cursor-pointer"
                onClick={() => handleCopyToClipboard(amountEth.toString(), "amount")}
              >
                {amountEth.toFixed(4)} ETH{" "}
              </span>
            )}
            ({params.amount}$) to the following wallet address:
          </span>
          <div className="flex flex-col gap-2">
            {nativeCurrencyPrice !== 0 && (
              <span
                className="underline underline-offset-2 cursor-pointer"
                onClick={() => handleCopyToClipboard(wallets[0].toString(), "address")}
              >
                {wallets[0]}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function PurchasePage() {
  return (
    <Suspense fallback={<div className="flex items-center flex-col flex-grow pt-10">Loading...</div>}>
      <PurchaseContent />
    </Suspense>
  );
}
