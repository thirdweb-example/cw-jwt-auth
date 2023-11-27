import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThirdwebProvider, embeddedWallet } from '@thirdweb-dev/react';
import './styles/globals.css';
import { coinbaseAuth } from './CustomAuth';

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = 'ethereum';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
	<React.StrictMode>
		<ThirdwebProvider
			clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
			activeChain={activeChain}
			supportedWallets={[coinbaseAuth({ recommended: true }), embeddedWallet()]}
		>
			<App />
		</ThirdwebProvider>
	</React.StrictMode>
);
