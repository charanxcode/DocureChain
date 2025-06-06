// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SecureDocumentVerification
 * @dev Smart contract for blockchain-based document verification and storage
 */
contract SecureDocumentVerification is Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // Document counter for unique IDs
    Counters.Counter private _documentIds;
    
    // Verification counter for analytics
    Counters.Counter private _verificationCount;
    
    // Document structure
    struct Document {
        uint256 id;
        string title;
        string documentType;
        string issuer;
        bytes32 contentHash;
        bytes32 metadataHash;
        address owner;
        uint256 timestamp;
        bool isActive;
    }
    
    // Access permission structure
    struct AccessPermission {
        address requester;
        uint256 documentId;
        uint256 expirationTime;
        bool isGranted;
        string purpose;
    }
    
    // Verification log structure
    struct VerificationLog {
        uint256 documentId;
        address verifier;
        uint256 timestamp;
        bool isValid;
    }
    
    // Mappings
    mapping(uint256 => Document) public documents;
    mapping(bytes32 => uint256) public hashToDocumentId;
    mapping(address => uint256[]) public userDocuments;
    mapping(uint256 => AccessPermission[]) public documentPermissions;
    mapping(address => bool) public authorizedIssuers;
    mapping(uint256 => VerificationLog[]) public verificationLogs;
    
    // Events
    event DocumentUploaded(
        uint256 indexed documentId,
        address indexed owner,
        string title,
        bytes32 contentHash,
        uint256 timestamp
    );
    
    event DocumentVerified(
        uint256 indexed documentId,
        address indexed verifier,
        bool isValid,
        uint256 timestamp
    );
    
    event AccessGranted(
        uint256 indexed documentId,
        address indexed owner,
        address indexed requester,
        uint256 expirationTime,
        string purpose
    );
    
    event AccessRevoked(
        uint256 indexed documentId,
        address indexed owner,
        address indexed requester
    );
    
    event IssuerAuthorized(address indexed issuer, bool status);
    
    // Modifiers
    modifier onlyDocumentOwner(uint256 _documentId) {
        require(documents[_documentId].owner == msg.sender, "Not document owner");
        _;
    }
    
    modifier documentExists(uint256 _documentId) {
        require(documents[_documentId].id != 0, "Document does not exist");
        _;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner(), "Not authorized issuer");
        _;
    }
    
    constructor() {
        // Owner is automatically an authorized issuer
        authorizedIssuers[msg.sender] = true;
    }
    
    /**
     * @dev Upload a new document to the blockchain
     * @param _title Document title
     * @param _documentType Type of document (identity, education, etc.)
     * @param _issuer Issuing authority
     * @param _contentHash Hash of the document content
     * @param _metadataHash Hash of document metadata
     */
    function uploadDocument(
        string memory _title,
        string memory _documentType,
        string memory _issuer,
        bytes32 _contentHash,
        bytes32 _metadataHash
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_documentType).length > 0, "Document type cannot be empty");
        require(bytes(_issuer).length > 0, "Issuer cannot be empty");
        require(_contentHash != bytes32(0), "Content hash cannot be empty");
        require(hashToDocumentId[_contentHash] == 0, "Document already exists");
        
        _documentIds.increment();
        uint256 newDocumentId = _documentIds.current();
        
        Document memory newDocument = Document({
            id: newDocumentId,
            title: _title,
            documentType: _documentType,
            issuer: _issuer,
            contentHash: _contentHash,
            metadataHash: _metadataHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });
        
        documents[newDocumentId] = newDocument;
        hashToDocumentId[_contentHash] = newDocumentId;
        userDocuments[msg.sender].push(newDocumentId);
        
        emit DocumentUploaded(
            newDocumentId,
            msg.sender,
            _title,
            _contentHash,
            block.timestamp
        );
        
        return newDocumentId;
    }
    
    /**
     * @dev Verify a document by its ID or content hash
     * @param _documentId Document ID to verify
     */
    function verifyDocument(uint256 _documentId) 
        external 
        documentExists(_documentId) 
        whenNotPaused 
        returns (bool) 
    {
        Document memory doc = documents[_documentId];
        bool isValid = doc.isActive && doc.timestamp > 0;
        
        // Log verification attempt
        verificationLogs[_documentId].push(VerificationLog({
            documentId: _documentId,
            verifier: msg.sender,
            timestamp: block.timestamp,
            isValid: isValid
        }));
        
        _verificationCount.increment();
        
        emit DocumentVerified(_documentId, msg.sender, isValid, block.timestamp);
        
        return isValid;
    }
    
    /**
     * @dev Verify document by content hash
     * @param _contentHash Hash of document content
     */
    function verifyDocumentByHash(bytes32 _contentHash) 
        external 
        whenNotPaused 
        returns (bool) 
    {
        uint256 documentId = hashToDocumentId[_contentHash];
        require(documentId != 0, "Document not found");
        
        return this.verifyDocument(documentId);
    }
    
    /**
     * @dev Grant access permission to another address
     * @param _documentId Document ID
     * @param _requester Address to grant access to
     * @param _expirationTime Expiration timestamp
     * @param _purpose Purpose of access
     */
    function grantAccess(
        uint256 _documentId,
        address _requester,
        uint256 _expirationTime,
        string memory _purpose
    ) external onlyDocumentOwner(_documentId) whenNotPaused {
        require(_requester != address(0), "Invalid requester address");
        require(_expirationTime > block.timestamp, "Invalid expiration time");
        require(bytes(_purpose).length > 0, "Purpose cannot be empty");
        
        AccessPermission memory permission = AccessPermission({
            requester: _requester,
            documentId: _documentId,
            expirationTime: _expirationTime,
            isGranted: true,
            purpose: _purpose
        });
        
        documentPermissions[_documentId].push(permission);
        
        emit AccessGranted(_documentId, msg.sender, _requester, _expirationTime, _purpose);
    }
    
    /**
     * @dev Revoke access permission
     * @param _documentId Document ID
     * @param _requester Address to revoke access from
     */
    function revokeAccess(uint256 _documentId, address _requester) 
        external 
        onlyDocumentOwner(_documentId) 
        whenNotPaused 
    {
        AccessPermission[] storage permissions = documentPermissions[_documentId];
        
        for (uint256 i = 0; i < permissions.length; i++) {
            if (permissions[i].requester == _requester && permissions[i].isGranted) {
                permissions[i].isGranted = false;
                emit AccessRevoked(_documentId, msg.sender, _requester);
                break;
            }
        }
    }
    
    /**
     * @dev Check if an address has access to a document
     * @param _documentId Document ID
     * @param _requester Address to check
     */
    function hasAccess(uint256 _documentId, address _requester) 
        external 
        view 
        returns (bool) 
    {
        // Owner always has access
        if (documents[_documentId].owner == _requester) {
            return true;
        }
        
        AccessPermission[] memory permissions = documentPermissions[_documentId];
        
        for (uint256 i = 0; i < permissions.length; i++) {
            if (permissions[i].requester == _requester && 
                permissions[i].isGranted && 
                permissions[i].expirationTime > block.timestamp) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * @dev Get document details (only accessible by owner or authorized addresses)
     * @param _documentId Document ID
     */
    function getDocument(uint256 _documentId) 
        external 
        view 
        documentExists(_documentId) 
        returns (Document memory) 
    {
        require(
            documents[_documentId].owner == msg.sender || 
            this.hasAccess(_documentId, msg.sender) ||
            authorizedIssuers[msg.sender] ||
            msg.sender == owner(),
            "Access denied"
        );
        
        return documents[_documentId];
    }
    
    /**
     * @dev Get user's documents
     * @param _user User address
     */
    function getUserDocuments(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        require(_user == msg.sender || msg.sender == owner(), "Access denied");
        return userDocuments[_user];
    }
    
    /**
     * @dev Deactivate a document (soft delete)
     * @param _documentId Document ID
     */
    function deactivateDocument(uint256 _documentId) 
        external 
        onlyDocumentOwner(_documentId) 
        whenNotPaused 
    {
        documents[_documentId].isActive = false;
    }
    
    /**
     * @dev Reactivate a document
     * @param _documentId Document ID
     */
    function reactivateDocument(uint256 _documentId) 
        external 
        onlyDocumentOwner(_documentId) 
        whenNotPaused 
    {
        documents[_documentId].isActive = true;
    }
    
    /**
     * @dev Authorize an issuer
     * @param _issuer Issuer address
     * @param _status Authorization status
     */
    function setIssuerAuthorization(address _issuer, bool _status) 
        external 
        onlyOwner 
    {
        authorizedIssuers[_issuer] = _status;
        emit IssuerAuthorized(_issuer, _status);
    }
    
    /**
     * @dev Get verification logs for a document
     * @param _documentId Document ID
     */
    function getVerificationLogs(uint256 _documentId) 
        external 
        view 
        returns (VerificationLog[] memory) 
    {
        require(
            documents[_documentId].owner == msg.sender || 
            msg.sender == owner(),
            "Access denied"
        );
        
        return verificationLogs[_documentId];
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() 
        external 
        view 
        returns (uint256 totalDocuments, uint256 totalVerifications) 
    {
        return (_documentIds.current(), _verificationCount.current());
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Batch verify multiple documents
     * @param _documentIds Array of document IDs to verify
     */
    function batchVerifyDocuments(uint256[] memory _documentIds) 
        external 
        whenNotPaused 
        returns (bool[] memory) 
    {
        require(_documentIds.length <= 50, "Too many documents in batch");
        
        bool[] memory results = new bool[](_documentIds.length);
        
        for (uint256 i = 0; i < _documentIds.length; i++) {
            if (documents[_documentIds[i]].id != 0) {
                results[i] = this.verifyDocument(_documentIds[i]);
            } else {
                results[i] = false;
            }
        }
        
        return results;
    }
}

/**
 * @title DocumentFactory
 * @dev Factory contract for creating document verification instances
 */
contract DocumentFactory is Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _instanceIds;
    
    struct InstanceInfo {
        uint256 id;
        address contractAddress;
        string organizationName;
        address admin;
        uint256 createdAt;
        bool isActive;
    }
    
    mapping(uint256 => InstanceInfo) public instances;
    mapping(address => uint256[]) public adminInstances;
    
    event InstanceCreated(
        uint256 indexed instanceId,
        address indexed contractAddress,
        string organizationName,
        address indexed admin
    );
    
    /**
     * @dev Create a new document verification instance
     * @param _organizationName Name of the organization
     * @param _admin Admin address for the new instance
     */
    function createInstance(
        string memory _organizationName,
        address _admin
    ) external returns (address) {
        require(bytes(_organizationName).length > 0, "Organization name required");
        require(_admin != address(0), "Invalid admin address");
        
        SecureDocumentVerification newInstance = new SecureDocumentVerification();
        newInstance.transferOwnership(_admin);
        
        _instanceIds.increment();
        uint256 newInstanceId = _instanceIds.current();
        
        InstanceInfo memory instanceInfo = InstanceInfo({
            id: newInstanceId,
            contractAddress: address(newInstance),
            organizationName: _organizationName,
            admin: _admin,
            createdAt: block.timestamp,
            isActive: true
        });
        
        instances[newInstanceId] = instanceInfo;
        adminInstances[_admin].push(newInstanceId);
        
        emit InstanceCreated(
            newInstanceId,
            address(newInstance),
            _organizationName,
            _admin
        );
        
        return address(newInstance);
    }
    
    /**
     * @dev Get instances created by an admin
     * @param _admin Admin address
     */
    function getAdminInstances(address _admin) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return adminInstances[_admin];
    }
    
    /**
     * @dev Get total number of instances
     */
    function getTotalInstances() external view returns (uint256) {
        return _instanceIds.current();
    }
}

/**
 * @title DocumentRegistry
 * @dev Global registry for cross-referencing documents across different instances
 */
contract DocumentRegistry is Ownable {
    struct GlobalDocument {
        bytes32 contentHash;
        address contractAddress;
        uint256 documentId;
        string issuer;
        uint256 timestamp;
    }
    
    mapping(bytes32 => GlobalDocument) public globalDocuments;
    mapping(address => bool) public registeredContracts;
    
    event DocumentRegistered(
        bytes32 indexed contentHash,
        address indexed contractAddress,
        uint256 indexed documentId,
        string issuer
    );
    
    event ContractRegistered(address indexed contractAddress, bool status);
    
    modifier onlyRegisteredContract() {
        require(registeredContracts[msg.sender], "Contract not registered");
        _;
    }
    
    /**
     * @dev Register a document verification contract
     * @param _contractAddress Contract address to register
     */
    function registerContract(address _contractAddress) external onlyOwner {
        registeredContracts[_contractAddress] = true;
        emit ContractRegistered(_contractAddress, true);
    }
    
    /**
     * @dev Register a document in the global registry
     * @param _contentHash Document content hash
     * @param _documentId Document ID in the contract
     * @param _issuer Issuing authority
     */
    function registerDocument(
        bytes32 _contentHash,
        uint256 _documentId,
        string memory _issuer
    ) external onlyRegisteredContract {
        require(globalDocuments[_contentHash].timestamp == 0, "Document already registered");
        
        GlobalDocument memory doc = GlobalDocument({
            contentHash: _contentHash,
            contractAddress: msg.sender,
            documentId: _documentId,
            issuer: _issuer,
            timestamp: block.timestamp
        });
        
        globalDocuments[_contentHash] = doc;
        
        emit DocumentRegistered(_contentHash, msg.sender, _documentId, _issuer);
    }
    
    /**
     * @dev Check if a document exists globally
     * @param _contentHash Document content hash
     */
    function documentExists(bytes32 _contentHash) external view returns (bool) {
        return globalDocuments[_contentHash].timestamp > 0;
    }
    
    /**
     * @dev Get global document info
     * @param _contentHash Document content hash
     */
    function getGlobalDocument(bytes32 _contentHash) 
        external 
        view 
        returns (GlobalDocument memory) 
    {
        require(globalDocuments[_contentHash].timestamp > 0, "Document not found");
        return globalDocuments[_contentHash];
    }
}