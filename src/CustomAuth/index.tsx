import {
	type WalletConfig,
	EmbeddedWallet,
	type WalletOptions,
	type ConnectUIProps,
	useCreateWalletInstance,
	useSetConnectedWallet,
	useSetConnectionStatus,
} from '@thirdweb-dev/react';
import styles from './styles.module.css';
import { useState } from 'react';
import { ChevronLeftIcon, RetryIcon } from './icons';

const coinbaseIcon =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzA1NTVGRiIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMzMwM184NjM0KSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuMzMxMiA0SDM1LjY2NzJDNDAuMjcwNCA0IDQ0IDguMDEyOCA0NCAxMi45NjMyVjM1LjAzNjhDNDQgMzkuOTg3MiA0MC4yNzA0IDQ0IDM1LjY2ODggNDRIMTIuMzMxMkM3LjcyOTYgNDQgNCAzOS45ODcyIDQgMzUuMDM2OFYxMi45NjMyQzQgOC4wMTI4IDcuNzI5NiA0IDEyLjMzMTIgNFoiIGZpbGw9IiMwMDUyRkYiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNC4wMDAzIDkuNzkzNDZDMzEuODQ2NyA5Ljc5MzQ2IDM4LjIwNjcgMTYuMTUzNSAzOC4yMDY3IDIzLjk5OTlDMzguMjA2NyAzMS44NDYzIDMxLjg0NjcgMzguMjA2MyAyNC4wMDAzIDM4LjIwNjNDMTYuMTUzOSAzOC4yMDYzIDkuNzkzOTUgMzEuODQ2MyA5Ljc5Mzk1IDIzLjk5OTlDOS43OTM5NSAxNi4xNTM1IDE2LjE1MzkgOS43OTM0NiAyNC4wMDAzIDkuNzkzNDZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIwLjUwMDYgMTkuNDU5SDI3LjQ5NzRDMjguMDczNCAxOS40NTkgMjguNTM5IDE5Ljk2MTQgMjguNTM5IDIwLjU3OVYyNy40MTlDMjguNTM5IDI4LjAzODIgMjguMDcxOCAyOC41MzkgMjcuNDk3NCAyOC41MzlIMjAuNTAwNkMxOS45MjQ2IDI4LjUzOSAxOS40NTkgMjguMDM2NiAxOS40NTkgMjcuNDE5VjIwLjU3OUMxOS40NTkgMTkuOTYxNCAxOS45MjYyIDE5LjQ1OSAyMC41MDA2IDE5LjQ1OVoiIGZpbGw9IiMwMDUyRkYiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMzAzXzg2MzQiPgo8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0IDQpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';

export const coinbaseAuth = (options?: { recommended?: boolean }): WalletConfig<EmbeddedWallet> => {
	return {
		id: 'coinbase-auth',
		recommended: options?.recommended,
		meta: {
			name: 'Coinbase Auth',
			iconURL: coinbaseIcon,
		},
		create(walletOptions: WalletOptions) {
			return new EmbeddedWallet({ ...walletOptions, clientId: walletOptions.clientId || '' });
		},
		connectUI: ConnectUI,
	};
};

type AuthStatus = 'logged-out' | 'logged-in' | 'logging-in' | 'login-failed';

function ConnectUI(props: ConnectUIProps<EmbeddedWallet>) {
	const createWalletInstance = useCreateWalletInstance();
	const setConnectionStatus = useSetConnectionStatus();
	const setConnectedWallet = useSetConnectedWallet();
	const [authStatus, setAuthStatus] = useState<AuthStatus>('logged-out');

	async function getJWT() {
		return ''; // Implement your OAuth logic here to get the JWT
	}

	async function signIn() {
		const wallet = createWalletInstance(props.walletConfig);

		try {
			setAuthStatus('logging-in');
			setConnectionStatus('connecting');

			const authResult = await wallet.authenticate({
				strategy: 'jwt',
				jwt: await getJWT(),
			});

			await wallet.connect({ authResult });

			setConnectedWallet(wallet);
			setConnectionStatus('connected');

			// wallet connected, close modal
			props.connected();
		} catch (e) {
			console.error(e);
			setAuthStatus('login-failed');
			setConnectionStatus('disconnected');
		}
	}

	return (
		<div className={styles.signInScreen} data-theme={props.theme}>
			<div className={styles.screenHeader}>
				<button
					className={styles.iconButton}
					onClick={props.goBack}
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						transform: 'translateX(-25%)',
					}}
				>
					<ChevronLeftIcon size='24' />
				</button>
				<h3 className={styles.screenTitle}>Coinbase Auth</h3>
			</div>

			<div className={styles.signinScreenContent}>
				{authStatus === 'logged-out' && (
					<div className={styles.fadeIn}>
						<button className={styles.button} onClick={signIn}>
							<img src={coinbaseIcon} width={24} height={24} />
							Sign in with Coinbase
						</button>
					</div>
				)}

				{authStatus === 'logging-in' && <div className={styles.fadeIn}> Signing in... </div>}

				{authStatus === 'login-failed' && (
					<div className={styles.fadeIn}>
						<p className={styles.failedToLogin}> Failed to Login </p>

						<button className={styles.button} onClick={signIn}>
							<RetryIcon size='24' />
							Try again
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
