# 📄 Docure: Blockchain-Based Document Verification System

Docure is a decentralized document verification system designed to prevent misuse of personal documents. Inspired by India's DigiLocker, this project leverages **Blockchain**, **IPFS**, and **Flutter** to ensure secure, tamper-proof, and permanent storage and validation of documents.

---

## 🚀 Features

- 🔐 Blockchain-based verification (Smart Contracts on Polygon Testnet)
- 📱 Cross-platform mobile app built with Flutter
- 🗂️ IPFS integration for decentralized document storage
- 🧾 Real-time document validation and history tracking
- 👤 User login and secure document upload
- 🌐 Admin interface for institution-level access (future scope)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| 📱 Frontend | Flutter |
| 🔗 Smart Contracts | Solidity (Polygon Testnet) |
| 🧊 Storage | IPFS |
| 🔐 Wallet Integration | MetaMask / WalletConnect |
| ☁️ Backend (optional) | Node.js / Firebase (planned) |

---

## 📦 Project Structure

```plaintext
/docure
│
├── flutter_app/              # Flutter mobile frontend
│   ├── lib/
│   ├── assets/
│   └── pubspec.yaml
│
├── contracts/                # Smart Contracts
│   ├── Docure.sol
│   └── deployment/
│
├── ipfs/                     # IPFS interaction scripts (Node or Python)
│
└── README.md
