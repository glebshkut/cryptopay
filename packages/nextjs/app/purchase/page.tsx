"use client";

import { useSearchParams } from "next/navigation";
import { useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

export default function Business() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);

  const { data: wallets } = useReadContract({
    address: deployedContracts[11155111].MasterMerchant.address,
    abi: deployedContracts[11155111].MasterMerchant.abi,
    functionName: "getAllWallets",
  });

  if (!params.productId || !params.merchantId || !params.amount) return;

  // TODO: verify amount is the correct price of the product

  const amountEth = +params.amount / nativeCurrencyPrice;

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
                onClick={() => {
                  navigator.clipboard.writeText(amountEth.toString());
                  notification.success(
                    <span>Copied amount to the clipboard!</span>
                  );
                }}
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
                onClick={() => {
                  navigator.clipboard.writeText(wallets[0].toString());
                  notification.success(
                    <span>Copied address to the clipboard!</span>
                  );
                }}
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
