// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IIdentityRegistry {
    function didToAddress(string calldata did) external view returns (address);
    function addressToDID(address userAddress) external view returns (string memory);
}

/**
 * @title DocumentRegistry
 * @dev Stores anchored document hashes acting as the source of truth for verification.
 */
contract DocumentRegistry is Initializable, OwnableUpgradeable {
    
    struct DocumentRecord {
        string ownerDID;
        string ipfsCID;
        string docType;
        uint256 timestamp;
        bool isRevoked;
        string issuerId;
    }

    mapping(bytes32 => DocumentRecord) public documents;
    
    IIdentityRegistry public identityRegistry;

    event DocumentRegistered(bytes32 indexed hashKey, string ownerDID, string ipfsCID, string docType, string issuerId, uint256 timestamp);
    event DocumentRevoked(bytes32 indexed hashKey, uint256 timestamp);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _identityRegistry) initializer public {
        __Ownable_init(msg.sender);
        identityRegistry = IIdentityRegistry(_identityRegistry);
    }

    /**
     * @dev Registers a new document on the blockchain.
     * @param hashKey The keccak256 hash of the SHA-256 document hash.
     * @param ownerDID The DID of the document owner.
     * @param ipfsCID The IPFS CID where the encrypted document is hosted.
     * @param docType The type of document (e.g. AADHAAR).
     * @param issuerId The DID or string ID of the issuing authority.
     */
    function registerDocument(
        bytes32 hashKey,
        string calldata ownerDID,
        string calldata ipfsCID,
        string calldata docType,
        string calldata issuerId
    ) external {
        require(documents[hashKey].timestamp == 0, "Document already registered");
        // Verify msg.sender translates to ownerDID OR msg.sender translates to the issuer
        string memory senderDID = identityRegistry.addressToDID(msg.sender);
        require(
            keccak256(bytes(senderDID)) == keccak256(bytes(ownerDID)) || 
            keccak256(bytes(senderDID)) == keccak256(bytes(issuerId)),
            "Caller is not owner nor issuer"
        );

        documents[hashKey] = DocumentRecord({
            ownerDID: ownerDID,
            ipfsCID: ipfsCID,
            docType: docType,
            timestamp: block.timestamp,
            isRevoked: false,
            issuerId: issuerId
        });

        emit DocumentRegistered(hashKey, ownerDID, ipfsCID, docType, issuerId, block.timestamp);
    }

    /**
     * @dev Revokes a document.
     * @param hashKey The hash key of the document to revoke.
     */
    function revokeDocument(bytes32 hashKey) external {
        DocumentRecord storage doc = documents[hashKey];
        require(doc.timestamp != 0, "Document does not exist");
        require(!doc.isRevoked, "Document already revoked");

        string memory senderDID = identityRegistry.addressToDID(msg.sender);
        require(
            keccak256(bytes(senderDID)) == keccak256(bytes(doc.ownerDID)) || 
            keccak256(bytes(senderDID)) == keccak256(bytes(doc.issuerId)),
            "Caller is not owner nor issuer"
        );

        doc.isRevoked = true;
        emit DocumentRevoked(hashKey, block.timestamp);
    }

    /**
     * @dev Retrieves a document record.
     * @param hashKey The hash key of the document.
     */
    function verifyDocument(bytes32 hashKey) external view returns (DocumentRecord memory) {
        DocumentRecord memory doc = documents[hashKey];
        require(doc.timestamp != 0, "Document not found");
        return doc;
    }
}
