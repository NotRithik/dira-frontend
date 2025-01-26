# Dira: The Decentralized AED Stablecoin

This repository contains the frontend application for **Dira**, a decentralized, overcollateralized stablecoin pegged to the Emirati Dirham (AED). Built within the Cosmos ecosystem, Dira offers a robust and transparent solution for accessing a digital AED currency, collateralized by the OM token.

The Dira Frontend provides a user-friendly web interface for seamless interaction with the Dira protocol, currently deployed on the Mantra DuKong testnet. This application enables users to manage their collateral, mint and return Dira stablecoins, and engage with decentralized finance functionalities.

---

## Getting Started with Dira

To begin using the Dira Frontend application, please follow these steps:

1.  **Install Keplr Wallet Extension:**
    The [Keplr browser extension](https://www.keplr.app/) is required to interact with Dira. Ensure you have installed Keplr in your browser. This wallet facilitates secure connection to the Mantra DuKong testnet and management of your assets.

2.  **Acquire Testnet OM Tokens:**
    Dira operates on the Mantra DuKong testnet and necessitates testnet OM tokens for interaction. These tokens can be obtained via the Mantra Chain Discord faucet. Join the [Mantra Chain Discord](https://discord.gg/N72A9zkCRZ), verify your account, acquire the faucet user role, and locate the faucet channel to request testnet OM.

3.  **Access the Dira Frontend Application:**
    Navigate to the Dira Frontend application in your web browser: [Dira Frontend](https://dira-alpha.vercel.app/).

4.  **Connect Keplr Wallet:**
    On the Dira Frontend webpage, click the "Connect Keplr Wallet" button located in the top right corner. Follow the Keplr Wallet extension prompts to establish a connection to the application and the Mantra DuKong testnet.

---

## Key Features of the Dira Frontend

The Dira Frontend is engineered to provide a comprehensive and intuitive user experience, offering the following key features:

*   **Collateral Management:**  Effortlessly lock and unlock OM tokens as collateral through the web interface, securing your minted Dira stablecoins.
*   **Minting and Returning Dira:**  Mint AED-pegged Dira stablecoins against your locked OM collateral and return Dira to unlock your collateral as needed, all within a clear interface.
*   **Comprehensive Dashboard:**  Gain immediate insights from a centralized dashboard displaying your wallet status, connection details, and real-time price charts for both OM and Dira.
*   **Cross-Chain Compatibility (Future Development):**  Designed with future expansion in mind, the frontend architecture is prepared to support cross-chain functionalities via Inter-Blockchain Communication (IBC).
*   **Keplr Wallet Integration:**  Enjoy secure and seamless interaction with the Dira protocol through direct and robust Keplr Wallet integration.

Further features are under development to enhance the Dira ecosystem and user experience.

---

## Frontend Application Features

The Dira web interface is your primary point of interaction with the Dira protocol on the Mantra DuKong testnet.

Currently, the following features have been implemented:

*   **Lock Collateral**: Users can lock OM to mint Dira stablecoins.
*   **Mint/Return Dira**: Intuitive interface to manage minted stablecoins and return them to unlock collateral.
*   **Dashboard**: Provides a comprehensive overview of wallet status, connection information, and price charts.

The following features are planned and will be implemented soon:

*   **Collateral Auction**: Participate in Collateral Auctions to buy liquidated assets.
*   **Oracle Price Feed**: Fetch collateral token's price directly from oracles on-chain and display within the frontend.
*   **Governance Tokens**: Token-holders will be able to vote on critical decisions regarding the Dira protocol through a governance interface.
*   **Auto-Minting/Burning of Governance Tokens**:  The frontend will reflect and interact with the smart contract's auto-minting and burning of governance tokens.
*   **Fees**:  Stability fees will be introduced, and the frontend will display and incorporate fee information.

---

## User Guide: Interacting with the Dira Frontend

The following steps outline how to utilize the core functionalities of the Dira Frontend:

1.  **Establish Keplr Wallet Connection:**
    *   Click the "Connect Keplr Wallet" button in the top right of the application.
    *   Authorize the connection to the Mantra DuKong testnet within the Keplr Wallet prompt.
    *   Upon successful connection, your wallet address will be displayed within the "Wallet Status" section of the Dashboard.

2.  **Lock OM Collateral:**
    *   Navigate to the "Manage Locked Collateral" section via the navigation menu.
    *   Enter the desired amount of OM tokens to lock in the designated "Amount of OM to lock" input field.
    *   Click the "Lock Collateral" button.
    *   Confirm and authorize the transaction via the Keplr Wallet prompt.

3.  **Mint Dira Stablecoins:**
    *   Access the "Mint or Return Dira" section from the navigation menu.
    *   Within the "Mint Dira" interface, specify the amount of Dira to mint, based on your available mintable Dira, using the input field or slider.
    *   Click the "Mint Dira" button.
    *   Approve the transaction via the Keplr Wallet prompt.

4.  **Return Dira and Unlock Collateral:**
    *   In the "Mint or Return Dira" section, locate the "Return Dira" interface and specify the amount of Dira to return.
    *   Click the "Return Dira" button.
    *   Authorize the transaction in Keplr Wallet.
    *   To unlock OM collateral, proceed to "Manage Locked Collateral," utilize the "Unlock Collateral" section to specify the amount of OM to unlock, and confirm the transaction through Keplr.

5.  **Add Dira Token to Keplr (Optional):**
    *   Navigate to the "Dashboard" section.
    *   Locate the "Wallet Status" card and click "Add Dira to Wallet."
    *   Approve the token addition request within the Keplr Wallet to view Dira tokens directly in your wallet interface.

---

## Roadmap: Future Development

The Dira project is committed to ongoing development and expansion. Future roadmap phases for the Frontend include:

*   **Phase 1: Core Functionality Deployment (Current Phase)**
    *   Testnet launch with essential features: Collateral Locking, Dira Minting, and Dira Returning.
    *   Development of a user-centric web interface for core functionalities.
    *   Ongoing user testing and security audits.

*   **Phase 2: Enhanced User Experience and IBC Integration**
    *   UI/UX enhancements based on user feedback and usability testing.
    *   Implementation of frontend support for Inter-Blockchain Communication (IBC) to facilitate cross-chain operations with Neutron and Mantra.
    *   Development of user interface elements for interaction with AED/USD liquidity pools.

*   **Phase 3: Expansion and Governance Features**
    *   Frontend extension to support additional regional stablecoins, such as SGD.
    *   Development of UI components for a multi-currency stablecoin Decentralized Exchange (DEX) interface.
    *   Integration of governance features within the frontend, enabling user participation in Dira protocol governance.

---

## Contributing to Dira Frontend

We encourage community contributions to the Dira Frontend project.

1.  Fork the [Dira Frontend Repository](https://github.com/NotRithik/dira-frontend).
2.  Create a dedicated feature branch for your contributions.
3.  Submit a pull request with a detailed description of the implemented changes.

For significant modifications, we recommend initiating a discussion by opening an issue in the frontend repository to coordinate with the development team.

---

## License

The Dira Frontend project is licensed under the [MIT License](LICENSE). Please refer to the [LICENSE](LICENSE) file within the repository for complete license details.

---

**Dira - Enabling access to a decentralized Emirati Dirham Stablecoin.**
