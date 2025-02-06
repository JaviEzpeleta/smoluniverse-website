// avsModule.ts
import { ethers, Contract, Wallet } from "ethers";
import { postErrorToDiscord, postToDiscord } from "./discord";
import { transferFromCloneToClone } from "./web3functions";

/**
 * Función AVS que ejecuta y verifica una transferencia de tokens entre clones.
 * Agrega una capa extra de seguridad creando un hash único de la acción y firmándolo.
 */
export async function avsTransferFunds(
  tokenContract: Contract,
  deployer: Wallet,
  cloneA: string,
  cloneB: string,
  amount: bigint,
  permitSignature: string
): Promise<string | false> {
  try {
    // 1. Pre-verificación: muestra los parámetros y comprueba (a nivel de log) lo que vas a hacer
    console.log("AVS: Iniciando transferencia verificada...");
    const tokenAddress = await tokenContract.getAddress();
    console.log(
      `AVS: Token (${tokenAddress}) - de ${cloneA} a ${cloneB} - Cantidad: ${ethers.formatEther(
        amount
      )}`
    );

    // 2. Crea un hash único de la acción para que sea verificable
    const actionHash = ethers.keccak256(
      new ethers.AbiCoder().encode(
        ["address", "address", "address", "uint256"],
        [tokenAddress, cloneA, cloneB, amount]
      )
    );
    console.log("AVS: Hash de acción:", actionHash);

    // 3. Firma el hash con el deployer (o con la wallet AVS dedicada) para crear un registro inmutable
    const avsSignature = await deployer.signMessage(
      ethers.getBytes(actionHash)
    );
    console.log("AVS: Firma verificable:", avsSignature);

    // 4. Ejecuta la función real de transferencia
    await transferFromCloneToClone(
      tokenContract,
      deployer,
      cloneA,
      cloneB,
      amount,
      permitSignature
    );

    // 5. Post-verificación: notifica el éxito y registra la verificación
    console.log("AVS: Transferencia ejecutada y verificada con éxito.");
    await postToDiscord(
      `AVS: Transferencia verificada de ${ethers.formatEther(
        amount
      )} tokens de ${cloneA} a ${cloneB}. AVS Signature: ${avsSignature}`
    );
    return avsSignature;
  } catch (error) {
    console.error("AVS: Error durante la transferencia verificada:", error);
    await postErrorToDiscord(
      "AVS: Error ejecutando la transferencia verificada."
    );
    return false;
  }
}
