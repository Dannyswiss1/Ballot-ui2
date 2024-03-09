import { useEffect, useState } from "react";
import { getProposalsContract } from "../constants/contracts";
import { readOnlyProvider } from "../constants/providers";
import { decodeBytes32String } from "ethers";

const useProposals = () => {
  const [proposals, setProposal] = useState({
    loading: true,
    data: [],
  });

  useEffect(() => {
    const contract = getProposalsContract(readOnlyProvider);

    contract
      .getAllProposals()
      .then((res) => {
        const converted = res.map((item) => ({
          name: decodeBytes32String(item.name),
          voteCount: item.voteCount,
        }));
        setProposal({
          loading: false,
          data: converted,
        });
      })
      .catch((err) => {
        toast.error("error fetching proposals: ", err);
        setProposal((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  return proposals;
};

export default useProposals;
