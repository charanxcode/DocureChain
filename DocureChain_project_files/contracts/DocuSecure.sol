// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocureChain {

    struct Document {
        string ipfsHash;        // IPFS hash of the document
        uint256 timestamp;      // Upload time
        address owner;          // Who uploaded it
        bool isValid;           // Can be revoked later
    }

    mapping(string => Document) private documents; // Use a unique doc ID
    mapping(address => string[]) private userDocs;

    event DocumentUploaded(address indexed uploader, string docId, string ipfsHash);
    event DocumentRevoked(string docId);

    modifier onlyOwner(string memory docId) {
        require(documents[docId].owner == msg.sender, "Not the document owner");
        _;
    }

    function uploadDocument(string memory docId, string memory ipfsHash) public {
        require(documents[docId].timestamp == 0, "Document ID already exists");
        
        documents[docId] = Document({
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            owner: msg.sender,
            isValid: true
        });

        userDocs[msg.sender].push(docId);

        emit DocumentUploaded(msg.sender, docId, ipfsHash);
    }

    function getDocument(string memory docId) public view returns (
        string memory ipfsHash, 
        uint256 timestamp, 
        address owner, 
        bool isValid
    ) {
        Document memory doc = documents[docId];
        require(doc.timestamp != 0, "Document does not exist");
        return (doc.ipfsHash, doc.timestamp, doc.owner, doc.isValid);
    }

    function getMyDocuments() public view returns (string[] memory) {
        return userDocs[msg.sender];
    }

    function revokeDocument(string memory docId) public onlyOwner(docId) {
        require(documents[docId].isValid, "Already revoked");
        documents[docId].isValid = false;
        emit DocumentRevoked(docId);
    }

}
