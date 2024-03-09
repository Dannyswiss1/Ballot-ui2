import { useWeb3ModalAccount } from "@web3modal/ethers/react";

const useIsChairPerson = () => {
  const { address } = useWeb3ModalAccount();

  return address === import.meta.env.VITE_ballot_chairperson;
};

export default useIsChairPerson;
