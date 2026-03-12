// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title IdentityRegistry
 * @dev Manages DID-to-Address mappings and registered issuers
 */
contract IdentityRegistry is Initializable, OwnableUpgradeable {
    
    mapping(string => address) public didToAddress;
    mapping(address => string) public addressToDID;
    mapping(string => bool) public registeredIssuers;

    event DIDRegistered(address indexed userAddress, string did);
    event IssuerRegistered(string did);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __Ownable_init(msg.sender);
    }

    /**
     * @dev Registers the msg.sender's address to a DID.
     * @param did The decentralized identifier to map.
     */
    function registerDID(string calldata did) external {
        require(didToAddress[did] == address(0), "DID already registered");
        require(bytes(addressToDID[msg.sender]).length == 0, "Address already has a DID");

        didToAddress[did] = msg.sender;
        addressToDID[msg.sender] = did;

        emit DIDRegistered(msg.sender, did);
    }

    /**
     * @dev Registers a DID as an official issuer (Owner only).
     * @param did The decentralized identifier to register as issuer.
     */
    function registerIssuer(string calldata did) external onlyOwner {
        require(didToAddress[did] != address(0), "DID must be registered first");
        registeredIssuers[did] = true;

        emit IssuerRegistered(did);
    }

    /**
     * @dev Checks whether a given DID is a registered issuer.
     * @param did The decentralized identifier to check.
     */
    function isIssuer(string calldata did) external view returns (bool) {
        return registeredIssuers[did];
    }
}
