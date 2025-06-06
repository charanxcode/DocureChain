import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:crypto/crypto.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

void main() {
  runApp(SecureDocApp());
}

class SecureDocApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SecureDoc',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.indigo,
          brightness: Brightness.light,
        ),
      ),
      home: HomeScreen(),
    );
  }
}

class Document {
  final String id;
  final String title;
  final String type;
  final String issuer;
  final String contentHash;
  final DateTime timestamp;
  final int blockNumber;
  final String status;
  final String owner;
  final String transactionHash;

  Document({
    required this.id,
    required this.title,
    required this.type,
    required this.issuer,
    required this.contentHash,
    required this.timestamp,
    required this.blockNumber,
    required this.status,
    required this.owner,
    required this.transactionHash,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'type': type,
      'issuer': issuer,
      'contentHash': contentHash,
      'timestamp': timestamp.toIso8601String(),
      'blockNumber': blockNumber,
      'status': status,
      'owner': owner,
      'transactionHash': transactionHash,
    };
  }

  factory Document.fromJson(Map<String, dynamic> json) {
    return Document(
      id: json['id'],
      title: json['title'],
      type: json['type'],
      issuer: json['issuer'],
      contentHash: json['contentHash'],
      timestamp: DateTime.parse(json['timestamp']),
      blockNumber: json['blockNumber'],
      status: json['status'],
      owner: json['owner'],
      transactionHash: json['transactionHash'],
    );
  }
}

class BlockchainService {
  static const String _documentsKey = 'blockchain_documents';
  static const String _verificationsKey = 'blockchain_verifications';
  
  List<Document> _documents = [];
  List<Map<String, dynamic>> _verifications = [];
  int _blockHeight = 1;

  List<Document> get documents => _documents;
  int get blockHeight => _blockHeight;
  int get totalVerifications => _verifications.length;

  Future<void> initialize() async {
    await _loadDocuments();
    await _loadVerifications();
    _blockHeight = _documents.length + 1;
  }

  Future<void> _loadDocuments() async {
    final prefs = await SharedPreferences.getInstance();
    final documentsJson = prefs.getStringList(_documentsKey) ?? [];
    _documents = documentsJson
        .map((json) => Document.fromJson(jsonDecode(json)))
        .toList();
  }

  Future<void> _saveDocuments() async {
    final prefs = await SharedPreferences.getInstance();
    final documentsJson = _documents
        .map((doc) => jsonEncode(doc.toJson()))
        .toList();
    await prefs.setStringList(_documentsKey, documentsJson);
  }

  Future<void> _loadVerifications() async {
    final prefs = await SharedPreferences.getInstance();
    final verificationsJson = prefs.getStringList(_verificationsKey) ?? [];
    _verifications = verificationsJson
        .map((json) => jsonDecode(json) as Map<String, dynamic>)
        .toList();
  }

  Future<void> _saveVerifications() async {
    final prefs = await SharedPreferences.getInstance();
    final verificationsJson = _verifications
        .map((verification) => jsonEncode(verification))
        .toList();
    await prefs.setStringList(_verificationsKey, verificationsJson);
  }

  String _generateHash(String data) {
    var bytes = utf8.encode(data);
    var digest = sha256.convert(bytes);
    return digest.toString();
  }

  String _generateDocumentId() {
    return 'DOC_${DateTime.now().millisecondsSinceEpoch}_${_generateRandomString(9)}';
  }

  String _generateRandomString(int length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return List.generate(length, (index) => chars[DateTime.now().millisecond % chars.length]).join();
  }

  Future<Document> uploadDocument({
    required String title,
    required String type,
    required String issuer,
    required Uint8List fileContent,
  }) async {
    final contentHash = _generateHash(String.fromCharCodes(fileContent));
    final documentId = _generateDocumentId();
    
    final document = Document(
      id: documentId,
      title: title,
      type: type,
      issuer: issuer,
      contentHash: contentHash,
      timestamp: DateTime.now(),
      blockNumber: _blockHeight,
      status: 'verified',
      owner: 'user_${_generateRandomString(9)}',
      transactionHash: 'TX_${_generateHash(documentId + DateTime.now().millisecondsSinceEpoch.toString())}',
    );

    _documents.add(document);
    _blockHeight++;
    await _saveDocuments();
    
    return document;
  }

  Future<Map<String, dynamic>> verifyDocument(String hashOrId) async {
    final verification = {
      'query': hashOrId,
      'timestamp': DateTime.now().toIso8601String(),
      'result': null,
    };

    final document = _documents.firstWhere(
      (doc) => doc.contentHash == hashOrId || doc.id == hashOrId,
      orElse: () => null as Document,
    );

    if (document != null) {
      verification['result'] = {
        'verified': true,
        'document': document.toJson(),
        'message': 'Document is authentic and verified on blockchain',
      };
    } else {
      verification['result'] = {
        'verified': false,
        'message': 'Document not found or invalid hash/ID',
      };
    }

    _verifications.add(verification);
    await _saveVerifications();

    return verification['result'] as Map<String, dynamic>;
  }

  Map<String, String> getShareData(String documentId) {
    final document = _documents.firstWhere(
      (doc) => doc.id == documentId,
      orElse: () => null as Document,
    );
    
    if (document == null) return {};

    return {
      'documentId': document.id,
      'hash': document.contentHash,
      'title': document.title,
      'type': document.type,
      'verificationUrl': 'https://securedoc.app?verify=${document.id}',
    };
  }
}

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final BlockchainService _blockchainService = BlockchainService();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _initializeService();
  }

  Future<void> _initializeService() async {
    await _blockchainService.initialize();
    setState(() {
      _isLoading = false;
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Initializing SecureDoc...'),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.security, color: Colors.white),
            SizedBox(width: 8),
            Text('SecureDoc', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Colors.indigo,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: [
            Tab(icon: Icon(Icons.upload_file), text: 'Upload'),
            Tab(icon: Icon(Icons.verified), text: 'Verify'),
            Tab(icon: Icon(Icons.folder), text: 'My Docs'),
          ],
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.indigo, Colors.indigo.shade800],
            stops: [0.0, 0.3],
          ),
        ),
        child: Column(
          children: [
            _buildStatsCard(),
            Expanded(
              child: Container(
                margin: EdgeInsets.only(top: 16),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                ),
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    UploadTab(blockchainService: _blockchainService),
                    VerifyTab(blockchainService: _blockchainService),
                    DocumentsTab(blockchainService: _blockchainService),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsCard() {
    return Container(
      margin: EdgeInsets.all(16),
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('Documents', _blockchainService.documents.length.toString()),
          _buildStatItem('Verifications', _blockchainService.totalVerifications.toString()),
          _buildStatItem('Block Height', _blockchainService.blockHeight.toString()),
          _buildStatItem('Status', '🟢'),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white70,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

class UploadTab extends StatefulWidget {
  final BlockchainService blockchainService;

  const UploadTab({Key? key, required this.blockchainService}) : super(key: key);

  @override
  _UploadTabState createState() => _UploadTabState();
}

class _UploadTabState extends State<UploadTab> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _issuerController = TextEditingController();
  String _selectedType = '';
  PlatformFile? _selectedFile;
  bool _isUploading = false;

  final List<String> _documentTypes = [
    'Identity Proof',
    'Educational Certificate',
    'Financial Document',
    'Medical Record',
    'Legal Document',
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(height: 16),
            Text(
              'Upload Document',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            SizedBox(height: 24),
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: 'Document Title',
                hintText: 'e.g., Passport, Degree Certificate',
                prefixIcon: Icon(Icons.title),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.white,
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter document title';
                }
                return null;
              },
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedType.isEmpty ? null : _selectedType,
              decoration: InputDecoration(
                labelText: 'Document Type',
                prefixIcon: Icon(Icons.category),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.white,
              ),
              items: _documentTypes.map((type) {
                return DropdownMenuItem(value: type, child: Text(type));
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedType = value ?? '';
                });
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select document type';
                }
                return null;
              },
            ),
            SizedBox(height: 16),
            TextFormField(
              controller: _issuerController,
              decoration: InputDecoration(
                labelText: 'Issuing Authority',
                hintText: 'e.g., Government of India, University Name',
                prefixIcon: Icon(Icons.business),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.white,
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter issuing authority';
                }
                return null;
              },
            ),
            SizedBox(height: 24),
            GestureDetector(
              onTap: _pickFile,
              child: Container(
                height: 120,
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(
                    color: _selectedFile != null ? Colors.green : Colors.grey.shade300,
                    width: 2,
                    style: BorderStyle.solid,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      _selectedFile != null ? Icons.check_circle : Icons.cloud_upload,
                      size: 48,
                      color: _selectedFile != null ? Colors.green : Colors.grey,
                    ),
                    SizedBox(height: 8),
                    Text(
                      _selectedFile != null 
                          ? '✅ ${_selectedFile!.name}'
                          : '📁 Tap to select document',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: _selectedFile != null ? Colors.green : Colors.grey.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    if (_selectedFile != null)
                      Text(
                        'Size: ${(_selectedFile!.size / 1024 / 1024).toStringAsFixed(2)} MB',
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isUploading ? null : _uploadDocument,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.indigo,
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: _isUploading
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        ),
                        SizedBox(width: 12),
                        Text('Uploading to Blockchain...'),
                      ],
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.security),
                        SizedBox(width: 8),
                        Text('Upload & Secure on Blockchain'),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickFile() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      );

      if (result != null) {
        PlatformFile file = result.files.first;
        if (file.size > 10 * 1024 * 1024) {
          _showSnackBar('File size must be less than 10MB', Colors.red);
          return;
        }
        setState(() {
          _selectedFile = file;
        });
      }
    } catch (e) {
      _showSnackBar('Error selecting file: $e', Colors.red);
    }
  }

  Future<void> _uploadDocument() async {
    if (!_formKey.currentState!.validate() || _selectedFile == null) {
      _showSnackBar('Please fill all fields and select a file', Colors.red);
      return;
    }

    setState(() {
      _isUploading = true;
    });

    try {
      final fileContent = _selectedFile!.bytes ?? await File(_selectedFile!.path!).readAsBytes();
      
      await widget.blockchainService.uploadDocument(
        title: _titleController.text,
        type: _selectedType,
        issuer: _issuerController.text,
        fileContent: fileContent,
      );

      _showSnackBar('Document successfully uploaded and secured on blockchain!', Colors.green);
      _resetForm();
    } catch (e) {
      _showSnackBar('Upload failed: $e', Colors.red);
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  void _resetForm() {
    _titleController.clear();
    _issuerController.clear();
    setState(() {
      _selectedType = '';
      _selectedFile = null;
    });
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

class VerifyTab extends StatefulWidget {
  final BlockchainService blockchainService;

  const VerifyTab({Key? key, required this.blockchainService}) : super(key: key);

  @override
  _VerifyTabState createState() => _VerifyTabState();
}

class _VerifyTabState extends State<VerifyTab> {
  final _hashController = TextEditingController();
  bool _isVerifying = false;
  Map<String, dynamic>? _verificationResult;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(height: 16),
          Text(
            'Verify Document',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.indigo,
            ),
          ),
          SizedBox(height: 24),
          TextFormField(
            controller: _hashController,
            decoration: InputDecoration(
              labelText: 'Document Hash or ID',
              hintText: 'Enter document hash to verify',
              prefixIcon: Icon(Icons.fingerprint),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          SizedBox(height: 24),
          ElevatedButton(
            onPressed: _isVerifying ? null : _verifyDocument,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              padding: EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isVerifying
                ? Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      ),
                      SizedBox(width: 12),
                      Text('Verifying...'),
                    ],
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.verified),
                      SizedBox(width: 8),
                      Text('Verify Authenticity'),
                    ],
                  ),
          ),
          if (_verificationResult != null) ...[
            SizedBox(height: 24),
            _buildVerificationResult(),
          ],
        ],
      ),
    );
  }

  Widget _buildVerificationResult() {
    final result = _verificationResult!;
    final isVerified = result['verified'] == true;
    
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isVerified ? Colors.green.shade50 : Colors.red.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isVerified ? Colors.green : Colors.red,
          width: 2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isVerified ? Icons.check_circle : Icons.error,
                color: isVerified ? Colors.green : Colors.red,
                size: 28,
              ),
              SizedBox(width: 12),
              Text(
                isVerified ? 'Document Verified' : 'Verification Failed',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: isVerified ? Colors.green.shade800 : Colors.red.shade800,
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          if (isVerified && result['document'] != null) ...[
            _buildDetailRow('Title', result['document']['title']),
            _buildDetailRow('Type', result['document']['type']),
            _buildDetailRow('Issuer', result['document']['issuer']),
            _buildDetailRow('Upload Date', DateTime.parse(result['document']['timestamp']).toString()),
            _buildDetailRow('Block Number', '#${result['document']['blockNumber']}'),
            _buildDetailRow('Transaction Hash', result['document']['transactionHash']),
          ],
          SizedBox(height: 12),
          Text(
            result['message'],
            style: TextStyle(
              fontStyle: FontStyle.italic,
              color: isVerified ? Colors.green.shade700 : Colors.red.shade700,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  Future<void> _verifyDocument() async {
    final hash = _hashController.text.trim();
    if (hash.isEmpty) {
      _showSnackBar('Please enter a document hash or ID', Colors.red);
      return;
    }

    setState(() {
      _isVerifying = true;
      _verificationResult = null;
    });

    try {
      final result = await widget.blockchainService.verifyDocument(hash);
      setState(() {
        _verificationResult = result;
      });
      
      final isVerified = result['verified'] == true;
      _showSnackBar(
        isVerified ? 'Document verification successful!' : 'Document verification failed',
        isVerified ? Colors.green : Colors.red,
      );
    } catch (e) {
      _showSnackBar('Verification error: $e', Colors.red);
    } finally {
      setState(() {
        _isVerifying = false;
      });
    }
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

class DocumentsTab extends StatefulWidget {
  final BlockchainService blockchainService;

  const DocumentsTab({Key? key, required this.blockchainService}) : super(key: key);

  @override
  _DocumentsTabState createState() => _DocumentsTabState();
}

class _DocumentsTabState extends State<DocumentsTab> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(Icons.folder, color: Colors.indigo),
              SizedBox(width: 8),
              Text(
                'My Documents',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.indigo,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: widget.blockchainService.documents.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.folder_open, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text(
                        'No documents uploaded yet',
                        style: TextStyle(fontSize: 18, color: Colors.grey),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Upload your first document to get started!',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  itemCount: widget.blockchainService.documents.length,
                  itemBuilder: (context, index) {
                    final document = widget.blockchainService.documents[index];
                    return _buildDocumentCard(document);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildDocumentCard(Document document) {
    return Card(
      margin: EdgeInsets.only(bottom: 12),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    document.title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.indigo,
                    ),
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.verified, size: 16, color: Colors.green),
                      SizedBox(width: 4),
                      Text(
                        'Verified',
                        style: TextStyle(
                          color: Colors.green.shade800,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text('Type: ${document.type}'),
            Text('Issuer: ${document.issuer}'),
            Text('Upload Date: ${document.timestamp.toString().split('.')[0]}'),
            SizedBox(height: 8),
            Text(
              'Document ID: ${document.id}',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
            Text(
              'Block: #${document.blockNumber} | Hash: ${document.contentHash.substring(0, 16)}...',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _shareDocument(document),
                    icon: Icon(Icons.share, size: 16),
                    label: Text('Share'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _showQRCode(document),
                    icon: Icon(Icons.qr_code, size: 16),
                    label: Text('QR Code'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _shareDocument(Document document) {
    final shareData = widget.blockchainService.getShareData(document.id);
    if (shareData.isEmpty) {
      _showSnackBar('Error generating share data', Colors.red);
      return;
    }

    final shareText = '''
📄 Document Verification Details

Title: ${shareData['title']}
Type: ${shareData['type']}
Document ID: ${shareData['documentId']}
Verification Hash: ${shareData['hash']}

🔗 Verify online: ${shareData['verificationUrl']}

Secured by SecureDoc Blockchain
    ''';

    Clipboard.setData(ClipboardData(text: shareText));
    _showSnackBar('Document details copied to clipboard!', Colors.green);
  }

  void _showQRCode(Document document) {
    final shareData = widget.blockchainService.getShareData(document.id);
    if (shareData.isEmpty) {
      _showSnackBar('Error generating QR code data', Colors.red);
      return;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Document QR Code',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
                SizedBox(height: 16),
                Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: QrImageView(
                    data: shareData['verificationUrl']!,
                    version: QrVersions.auto,
                    size: 200.0,
                    foregroundColor: Colors.black,
                    backgroundColor: Colors.white,
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  document.title,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 8),
                Text(
                  'Scan to verify document authenticity',
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextButton(
                        onPressed: () => Navigator.of(context).pop(),
                        child: Text('Close'),
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.grey,
                        ),
                      ),
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: shareData['verificationUrl']!));
                          Navigator.of(context).pop();
                          _showSnackBar('Verification URL copied!', Colors.green);
                        },
                        child: Text('Copy URL'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.indigo,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}