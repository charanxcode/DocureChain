import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("DocureChain Contracts", function () {
    let identityRegistry: any;
    let documentRegistry: any;
    let accessControl: any;
    let owner: any;
    let user1: any;
    let issuer: any;
    let verifier: any;

    before(async function () {
        [owner, user1, issuer, verifier] = await ethers.getSigners();

        const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
        identityRegistry = await upgrades.deployProxy(IdentityRegistry, [], { initializer: 'initialize' });

        const identityAddress = await identityRegistry.getAddress();

        const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
        documentRegistry = await upgrades.deployProxy(DocumentRegistry, [identityAddress], { initializer: 'initialize' });

        const documentAddress = await documentRegistry.getAddress();

        const AccessControl = await ethers.getContractFactory("AccessControl");
        accessControl = await upgrades.deployProxy(AccessControl, [identityAddress, documentAddress], { initializer: 'initialize' });
    });

    describe("IdentityRegistry", function () {
        it("should register a DID for a user", async function () {
            const did = "did:ethr:0xuser1";
            await expect(identityRegistry.connect(user1).registerDID(did))
                .to.emit(identityRegistry, "DIDRegistered")
                .withArgs(user1.address, did);

            expect(await identityRegistry.didToAddress(did)).to.equal(user1.address);
            expect(await identityRegistry.addressToDID(user1.address)).to.equal(did);
        });

        it("should register an issuer only if owner", async function () {
            const did = "did:ethr:0xissuer";
            await identityRegistry.connect(issuer).registerDID(did);

            await expect(identityRegistry.connect(user1).registerIssuer(did))
                .to.be.reverted; // Wait, actually it reverts with custom message or standard, any revert is fine.

            await expect(identityRegistry.connect(owner).registerIssuer(did))
                .to.emit(identityRegistry, "IssuerRegistered")
                .withArgs(did);

            expect(await identityRegistry.isIssuer(did)).to.be.true;
        });
    });

    describe("DocumentRegistry", function () {
        it("should register a document", async function () {
            const did = "did:ethr:0xuser1";
            const hashKey = ethers.id("somefilehash");
            const cid = "ipfs://somecid";

            await expect(documentRegistry.connect(user1).registerDocument(hashKey, did, cid, "AADHAAR", ""))
                .to.emit(documentRegistry, "DocumentRegistered");

            const doc = await documentRegistry.verifyDocument(hashKey);
            expect(doc.ownerDID).to.equal(did);
            expect(doc.ipfsCID).to.equal(cid);
            expect(doc.docType).to.equal("AADHAAR");
            expect(doc.isRevoked).to.be.false;
        });

        it("should revoke a document by its owner", async function () {
            const hashKey = ethers.id("somefilehash");
            await expect(documentRegistry.connect(user1).revokeDocument(hashKey))
                .to.emit(documentRegistry, "DocumentRevoked");

            const doc = await documentRegistry.verifyDocument(hashKey);
            expect(doc.isRevoked).to.be.true;
        });
    });

    describe("AccessControl", function () {
        it("should grant access to a verifier", async function () {
            const hashKey = ethers.id("somefilehash");
            // user1 is the owner
            await accessControl.connect(user1).grantAccess(hashKey, verifier.address, 3600);

            const hasAccess = await accessControl.checkAccess(hashKey, verifier.address);
            expect(hasAccess).to.be.true;
        });

        it("should revoke access from a verifier", async function () {
            const hashKey = ethers.id("somefilehash");
            await accessControl.connect(user1).revokeAccess(hashKey, verifier.address);

            const hasAccess = await accessControl.checkAccess(hashKey, verifier.address);
            expect(hasAccess).to.be.false;
        });
    });
});
