// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IIdentityRegistry {
    function addressToDID(address userAddress) external view returns (string memory);
}

interface IDocumentRegistry {
    struct DocumentRecord {
        string ownerDID;
        string ipfsCID;
        string docType;
        uint256 timestamp;
        bool isRevoked;
        string issuerId;
    }
    function verifyDocument(bytes32 hashKey) external view returns (DocumentRecord memory);
}

/**
 * @title AccessControl
 * @dev Manages temporary verifier access to unencrypted payloads or off-chain data via blockchain state.
 */
contract AccessControl is Initializable, OwnableUpgradeable {
    
    struct AccessToken {
        address grantedTo;
        uint256 expiresAt;
        bool used;
    }

    mapping(bytes32 => AccessToken[]) public accessTokens;
    
    IIdentityRegistry public identityRegistry;
    IDocumentRegistry public documentRegistry;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _identityRegistry, address _documentRegistry) initializer public {
        __Ownable_init(msg.sender);
        identityRegistry = IIdentityRegistry(_identityRegistry);
        documentRegistry = IDocumentRegistry(_documentRegistry);
    }

    /**
     * @dev Grants access to a document.
     * @param hashKey The hashkey of the document.
     * @param verifier The address of the verifier.
     * @param duration The duration (in seconds) the access token is valid for.
     */
    function grantAccess(bytes32 hashKey, address verifier, uint256 duration) external {
        IDocumentRegistry.DocumentRecord memory doc = documentRegistry.verifyDocument(hashKey);
        string memory senderDID = identityRegistry.addressToDID(msg.sender);
        require(keccak256(bytes(senderDID)) == keccak256(bytes(doc.ownerDID)), "Only owner can grant access");

        accessTokens[hashKey].push(AccessToken({
            grantedTo: verifier,
            expiresAt: block.timestamp + duration,
            used: false
        }));
    }

    /**
     * @dev Checks if a verifier still has access.
     * @param hashKey The hashkey of the document.
     * @param verifier The verifier's address.
     */
    function checkAccess(bytes32 hashKey, address verifier) external view returns (bool) {
        AccessToken[] memory tokens = accessTokens[hashKey];
        for(uint i = 0; i < tokens.length; i++) {
            if (tokens[i].grantedTo == verifier && tokens[i].expiresAt > block.timestamp && !tokens[i].used) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Revokes all access for a specific verifier.
     * @param hashKey The document hash key.
     * @param verifier The verifier's address.
     */
    function revokeAccess(bytes32 hashKey, address verifier) external {
        IDocumentRegistry.DocumentRecord memory doc = documentRegistry.verifyDocument(hashKey);
        string memory senderDID = identityRegistry.addressToDID(msg.sender);
        require(keccak256(bytes(senderDID)) == keccak256(bytes(doc.ownerDID)), "Only owner can revoke access");

        AccessToken[] storage tokens = accessTokens[hashKey];
        for(uint i = 0; i < tokens.length; i++) {
            if (tokens[i].grantedTo == verifier) {
                tokens[i].expiresAt = 0; // invalidate instantly
            }
        }
    }
}
