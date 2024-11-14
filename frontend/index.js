import { backend } from "declarations/backend";

const plugWhitelist = [
    process.env.CANISTER_ID_BACKEND
];

const PLUG_HOST = "https://mainnet.plugwallet.ooo";

class WalletManager {
    constructor() {
        this.isConnected = false;
        this.balance = 0;
        this.init();
    }

    async init() {
        this.updateUI();
        document.getElementById('connect-button').addEventListener('click', () => this.connect());
    }

    async connect() {
        this.showLoading(true);
        try {
            // Check if Plug is installed
            if (window.ic?.plug === undefined) {
                window.open(PLUG_HOST, '_blank');
                throw new Error('Plug wallet not found');
            }

            // Request connection
            const connected = await window.ic.plug.requestConnect({
                whitelist: plugWhitelist,
            });

            if (!connected) throw new Error('Failed to connect to Plug wallet');

            this.isConnected = true;
            await this.getBalance();
        } catch (error) {
            console.error('Connection error:', error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
            this.updateUI();
        }
    }

    async getBalance() {
        if (!this.isConnected) return;

        try {
            const balance = await window.ic.plug.requestBalance();
            if (balance && balance.length > 0) {
                this.balance = balance[0].amount;
            }
        } catch (error) {
            console.error('Balance fetch error:', error);
            this.showError('Failed to fetch balance');
        }
        this.updateUI();
    }

    updateUI() {
        const connectionStatus = document.getElementById('connection-status');
        const balanceContainer = document.getElementById('balance-container');
        const balanceElement = document.getElementById('balance');
        const connectButton = document.getElementById('connect-button');

        connectionStatus.textContent = this.isConnected ? 'Connected' : 'Disconnected';
        connectionStatus.className = this.isConnected ? 'status-connected' : 'status-disconnected';

        if (this.isConnected) {
            balanceContainer.classList.remove('d-none');
            balanceElement.textContent = `${this.balance} ICP`;
            connectButton.textContent = 'Connected';
            connectButton.disabled = true;
        } else {
            balanceContainer.classList.add('d-none');
            connectButton.textContent = 'Connect to Plug';
            connectButton.disabled = false;
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loading-spinner');
        if (show) {
            spinner.classList.remove('d-none');
        } else {
            spinner.classList.add('d-none');
        }
    }

    showError(message) {
        alert(message);
    }
}

// Initialize the wallet manager when the page loads
window.addEventListener('load', () => {
    new WalletManager();
});
