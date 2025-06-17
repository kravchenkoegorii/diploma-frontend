import {
  getAccessToken,
  useHeadlessDelegatedActions,
  useLogin,
} from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { userService } from '../../services/userService';

export const AuthTokensScreen = () => {
  const [privyToken, setPrivyToken] = useState<string | undefined>();
  const [copiedText, copy] = useCopyToClipboard();
  const { delegateWallet } = useHeadlessDelegatedActions();
  const { login } = useLogin({
    async onComplete() {
      const user = await userService.registerUser();
      const wallet = user.wallets.find(wallet => wallet.isDefault);

      if (wallet) {
        delegateWallet({
          address: wallet.address,
          chainType: 'ethereum',
        });
      }

      const accessToken = await getAccessToken();
      setPrivyToken(accessToken || undefined);
    },
  });

  useEffect(() => {
    const fetchTokens = async () => {
      const accessToken = await getAccessToken();
      setPrivyToken(accessToken || undefined);
    };

    fetchTokens();
  }, []);

  return (
    <div className="flex flex-col gap-1 p-4">
      <h1 className="mb-4 text-3xl font-bold">Auth Tokens</h1>
      <b>Privy token:</b>
      <p>{privyToken || 'User not authorized'}</p>
      {privyToken && (
        <button
          className="border max-w-max px-4 py-1 rounded-full transition-colors duration-300 hover:bg-gray-50"
          onClick={() => copy(privyToken || '')}
        >
          {copiedText === privyToken ? 'Copied!' : 'Copy'}
        </button>
      )}
      {!privyToken && (
        <button
          className="border max-w-max px-4 py-1 rounded-full transition-colors duration-300 hover:bg-gray-50"
          onClick={login}
        >
          Log in
        </button>
      )}
    </div>
  );
};
