import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "react-toastify";

const useDelegateVote = (address) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) return toast.error("Wrong network");
    if (!isAddress(address)) return toast.error("invalid address");
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {

      const transaction = await contract.delegate(address);
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        return toast.success("delegated successfull!");
      }

      toast.error("delegate failed!");
    } catch (error) {
      let errorText;
      if (error.reason === "Self-delegation is disallowed.") {
        errorText = "self delegate not allowed";
      } else if (error.reason === "Already voted.") {
        errorText = "You have already voted";
      } else if (error.reason === "Found loop in delegation.") {
        errorText = "invalid delegation";
      } else {
        errorText = "An unknown error occured";
      }

      toast.error(`error:  ${errorText}`);
    }
  }, [address, chainId, walletProvider]);
};

export default useDelegateVote;

//
