# Dira Frontend - The OM-backed stablecoin for the AED

This is the frontend application for Dira, a decentralized, overcollateralized stablecoin solution for AED (United Arab Emirates Dirham), inspired by MakerDAO for USD. Built on the Cosmos ecosystem, Dira allows users to mint AED stablecoins by locking OM as collateral, providing a stable on-chain value store and enabling seamless integration with the growing blockchain ecosystem in Dubai and beyond.

This frontend provides a user-friendly web interface to interact with the Dira smart contract deployed on the Mantra DuKong testnet.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Frontend Application](#frontend-application)
- [How to Use the Dira Frontend](#how-to-use-the-dira-frontend)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Dira addresses the need for localized stablecoins in the Cosmos ecosystem. With the increasing adoption of tokenized real-world assets (RWAs) in Dubai, Dira provides a reliable and decentralized AED-pegged stablecoin, backed by OM as collateral. This frontend application makes it easy for users to interact with the Dira protocol.

Dira will leverage IBC to integrate seamlessly with chains in the Cosmos ecosystem and increase liquidity for the AED. Dira-based liquidity pools will also be created to facilitate ForEx transactions. By leveraging staking and liquidity pool fees, Dira also drives utility and demand for OM.

---

## Features

- **Decentralized & Overcollateralized**: Interact with the Dira stablecoin system backed by OM, ensuring stability and security.
- **Cross-Chain Ready**: Frontend is designed to interact with the Dira smart contract as it expands across the Cosmos ecosystem via IBC.
- **Manage Collateral**: Lock and unlock OM collateral directly through the web interface.
- **Mint & Return Dira**: Mint AED-pegged Dira stablecoins and return them to unlock your OM.
- **User-Friendly Interface**: Intuitive web interface for easy interaction with the Dira protocol.
- **Wallet Integration**: Seamlessly connect and interact using Keplr Wallet.

---

## Getting Started

To start using the Dira frontend application, follow these steps:

1. **Install Keplr Wallet**
   You need to have the [Keplr browser extension](https://www.keplr.app/) installed in your browser. This wallet will allow you to connect to the Mantra DuKong testnet and interact with the Dira smart contract.

2. **Get Testnet OM from Mantra Chain Faucet**
   To interact with Dira on the testnet, you will need testnet OM tokens. You can obtain these from the Mantra Chain Discord faucet. Join the [Mantra Chain Discord](https://discord.gg/N72A9zkCRZ), verify your account, get the faucet user role, browse channels and look for the faucet channel to request testnet OM.

3. **Access the Dira Frontend Application**
   Navigate to the deployed Dira Frontend application: [Dira Frontend](https://dira-alpha.vercel.app/)

4. **Connect Your Keplr Wallet**
   Once on the Dira Frontend webpage, click the "Connect Keplr Wallet" button in the top right corner. Follow the prompts in your Keplr Wallet extension to connect to the application and the Mantra DuKong testnet.

---

## Frontend Application

This web interface is your gateway to interacting with the Dira protocol on the Mantra DuKong testnet.

Currently, the following features are implemented and accessible through the frontend:

- **Lock Collateral**:  On the "Manage Locked Collateral" page, you can lock your OM tokens as collateral. Enter the amount of OM you wish to lock and click "Lock Collateral." You will be prompted to approve the transaction in your Keplr Wallet.
- **Mint/Return Dira**: On the "Mint or Return Dira" page, you can mint Dira stablecoins based on your locked OM collateral or return minted Dira to unlock your OM. Use the intuitive sliders or input fields to specify the amount of Dira to mint or return, and then click "Mint Dira" or "Return Dira" respectively. Approve the transaction in Keplr Wallet when prompted.
- **Dashboard**: The "Dashboard" provides an overview of your wallet status, connection information, and price charts for OM and Dira.

Planned features that will be implemented in the frontend soon:

- **Collateral Auction**: Participate in Collateral Auctions to buy liquidated assets.
- **Oracle Price Feed**: View collateral token's price fetched directly from oracles on-chain within the UI.
- **Governance Features**: Interface to interact with governance functionalities when they are implemented in the smart contract.
- **Fee Information**: Display and incorporate stability fees when they are introduced.

---

## How to Use the Dira Frontend

Here's a step-by-step guide to using the Dira Frontend:

1. **Connect Keplr Wallet**:
   Click the "Connect Keplr Wallet" button in the top right corner of the webpage and approve the connection in your Keplr Wallet extension.

2. **Ensure You Have Testnet OM**:
   Verify that you have testnet OM tokens in your Keplr Wallet for the connected Mantra DuKong testnet. If not, obtain them from the Mantra Chain Discord faucet (see "Getting Started" section).

3. **Lock OM Collateral**:
   Navigate to the "Manage Locked Collateral" page using the navigation menu.
   - Enter the amount of OM you wish to lock in the "Amount of OM to lock" input field.
   - Click the "Lock Collateral" button.
   - Approve the transaction in your Keplr Wallet when prompted.

4. **Mint Dira Stablecoins**:
   Navigate to the "Mint or Return Dira" page.
   - Use the "Amount of Dira to mint" input or the slider to specify the amount of Dira you want to mint, based on your available mintable Dira.
   - Click the "Mint Dira" button.
   - Approve the transaction in your Keplr Wallet.

5. **Return Dira and Unlock Collateral**:
   On the "Mint or Return Dira" page:
   - Use the "Amount of Dira to return" input or slider to specify the amount of Dira you want to return.
   - Click the "Return Dira" button.
   - Approve the transaction in your Keplr Wallet.
   - To unlock your OM collateral, navigate to the "Manage Locked Collateral" page, and use the "Unlock Collateral" section to unlock a desired amount of OM.

6. **Add Dira Token to Keplr**:
   After successfully minting Dira, you can add the Dira token to your Keplr Wallet for easier tracking.
   - Click on the "Dashboard" button in the navigation menu.
   - In the "Wallet Status" card, click the "Add Dira to Wallet" button.
   - Approve the token suggestion in your Keplr Wallet.

---

## Roadmap

- **Phase 1**:
  - Launch Dira on testnet with a functional frontend.
  - User testing and feedback collection.
  - Security audits of both smart contract and frontend.

- **Phase 2**:
  - Enhance frontend UI/UX based on user feedback.
  - Implement frontend support for IBC integrations with Neutron and Mantra.
  - Develop UI for AED/USD liquidity pool interactions.

- **Phase 3**:
  - Expand frontend to support other regional stablecoins (e.g., SGD).
  - Develop UI for multi-currency stablecoin DEX features.
  - Implement governance feature interactions in the frontend.

---

## Contributing

Contributions to the Dira frontend are welcome!

1. Fork the [Dira Frontend Repository](https://github.com/NotRithik/dira-frontend).
2. Create a feature branch.
3. Submit a pull request with a clear description of the changes.

For major changes, please open an issue first in the frontend repository to discuss your ideas.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file in the repository for details.

---

**Dira Frontend - Your interface to the OM-backed stablecoin for the Emirati Dirham. Secure, stable, and decentralized.**
