import { ethers, upgrades } from "hardhat";
import * as fs from "fs";

async function main() {
    console.log("Deploying IdentityRegistry...");
    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    const identityRegistry = await upgrades.deployProxy(IdentityRegistry, [], { initializer: 'initialize' });
    await identityRegistry.waitForDeployment();
    const identityRegistryAddress = await identityRegistry.getAddress();
    console.log("IdentityRegistry deployed to:", identityRegistryAddress);

    console.log("Deploying DocumentRegistry...");
    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    const documentRegistry = await upgrades.deployProxy(DocumentRegistry, [identityRegistryAddress], { initializer: 'initialize' });
    await documentRegistry.waitForDeployment();
    const documentRegistryAddress = await documentRegistry.getAddress();
    console.log("DocumentRegistry deployed to:", documentRegistryAddress);

    console.log("Deploying AccessControl...");
    const AccessControl = await ethers.getContractFactory("AccessControl");
    const accessControl = await upgrades.deployProxy(AccessControl, [identityRegistryAddress, documentRegistryAddress], { initializer: 'initialize' });
    await accessControl.waitForDeployment();
    const accessControlAddress = await accessControl.getAddress();
    console.log("AccessControl deployed to:", accessControlAddress);

    const deployments = {
        IdentityRegistry: identityRegistryAddress,
        DocumentRegistry: documentRegistryAddress,
        AccessControl: accessControlAddress
    };

    fs.writeFileSync("deployments.json", JSON.stringify(deployments, null, 2));
    console.log("Deployments saved to deployments.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
