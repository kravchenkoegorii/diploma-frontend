import { useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { STAGE, STAGES } from './constants';
import {
  chatRoutes,
  DeprecatedDevRoutes,
  DeprecatedProdRoutes,
  PLAIN_ROUTES,
} from './constants/routes';
import { AppLayout } from './layouts/AppLayout';
import { AuthTokensScreen } from './screens/AuthTokensScreen';
import { priceService } from './services/priceService';
import { userService } from './services/userService';
import { TOS } from './screens/Lending/components/TOS';
import { PP } from './screens/Lending/components/PP';
import {
  useHeadlessDelegatedActions,
  useLogin,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';
import { chatsStore, useChatsStore } from './stores/chats';
import { STORAGE_KEYS } from './constants/storageKeys';
import { ESenderType, IChat } from './types/chat';
import { chatService } from './services/chatService';
import { mutate, preload } from 'swr';
import { useSetActiveWallet } from '@privy-io/wagmi';
import { useUserStore } from './stores/user';
import { useShallow } from 'zustand/shallow';
import ChatScreen from './screens/Chat';
import FAQ from './screens/FAQ';
import Dashboard from './screens/Dashboard';

function App() {
  const isChatRoute = chatRoutes.includes(window.location.host);
  const { delegateWallet } = useHeadlessDelegatedActions();
  const { setActiveWallet } = useSetActiveWallet();
  const { wallets } = useWallets();
  const userData = useUserStore(useShallow(s => s.userData));
  const { isSubmitting } = useChatsStore();
  const { ready, user, authenticated } = usePrivy();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!ready || !user || !userData || !authenticated || isSubmitting) {
      return;
    }

    const defaultWallet = userData?.wallets?.find(wallet => wallet.isDefault);
    const activeWallet = wallets.find(
      wallet => wallet.address === defaultWallet?.address
    );

    if (!activeWallet || activeWallet?.connectorType === 'embedded') {
      return;
    }
  }, [ready, user, userData, authenticated, isSubmitting]);

  useLogin({
    onComplete: async ({ wasAlreadyAuthenticated }) => {
      const { setIsSubmitting, setSelectedChat, setIsSettingChatId } =
        chatsStore.getState();
      try {
        setIsSettingChatId(true);
        const user = await userService.registerUser();
        const wallet = user.wallets.find(wallet => wallet.isDefault);
        mutate('/messages/limits');

        if (wallet) {
          try {
            delegateWallet({
              address: wallet.address,
              chainType: 'ethereum',
            });
          } catch (error) {
            console.error(error);
          }
        }

        const guestMessage = localStorage.getItem(STORAGE_KEYS.GUEST_MESSAGE);
        const guestMessageId = localStorage.getItem(
          STORAGE_KEYS.GUEST_MESSAGE_ID
        );

        setIsSubmitting(true);
        const chats = await chatService.getChats(!guestMessage);

        if (guestMessage && !wasAlreadyAuthenticated) {
          const modifiedChat: IChat = {
            id: guestMessageId || crypto.randomUUID(),
            title: `Room ${(chats?.length || 0) + 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
              {
                id: crypto.randomUUID(),
                content: guestMessage,
                senderType: ESenderType.USER,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          };
          preload(`/chats/${guestMessageId}`, () => modifiedChat);
          await mutate(`/chats/${guestMessageId}`, () => modifiedChat, {
            optimisticData: () => modifiedChat,
            revalidate: false,
          });
          const newChat = await chatService.createChat(
            `Room ${chats.length + 1}`,
            false,
            true
          );
          preload(`/chats/${newChat.id}`, () => modifiedChat);
          setSelectedChat({
            ...modifiedChat,
            id: newChat.id,
          });

          await chatService.sendMessage(newChat.id, guestMessage);
          localStorage.removeItem(STORAGE_KEYS.GUEST_MESSAGE);

          await mutate('/chats', () => chatService.getChats(!guestMessage));
          await mutate(`/chats/${newChat.id}`, () =>
            chatService.getChat(newChat.id)
          );

          preload(`/chats/${guestMessageId}`, () => undefined);
          await mutate(`/chats/${guestMessageId}`, () => undefined, {
            optimisticData: () => undefined,
            populateCache: true,
          });
        } else {
          const chats = await chatService.getChats();
          preload('/chats', () => chats);
          await mutate('/chats', () => chats, {
            optimisticData: () => chats,
            revalidate: false,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
        setIsSettingChatId(false);
      }
    },
  });

  useEffect(() => {
    if (wallets.length) {
      const defaultWallet = userData?.wallets.find(wallet => wallet.isDefault);
      const activeWallet = wallets.find(
        wallet => wallet.address === defaultWallet?.address
      );
      if (activeWallet) {
        setActiveWallet(activeWallet);
      }
    }
  }, [wallets, userData, wallets.length, setActiveWallet, pathname]);

  useEffect(() => {
    const getUser = async () => {
      await userService.getUser();
    };

    authenticated && getUser();
  }, [authenticated]);

  useEffect(() => {
    priceService.fetchPrice();
  }, []);

  const routes = useMemo(
    () => (
      <>
        {isChatRoute ? (
          <>
            <Route path="/" element={<AppLayout />}>
              <Route path={PLAIN_ROUTES.HOME} element={<ChatScreen />} />
              <Route path={PLAIN_ROUTES.FAQ} element={<FAQ />} />
              <Route path={PLAIN_ROUTES.TERMINAL} element={<Dashboard />} />

              <Route
                path={DeprecatedProdRoutes.DASHBOARD}
                element={<Navigate to={PLAIN_ROUTES.TERMINAL} replace />}
              />
              <Route path="*" element={<Navigate to={PLAIN_ROUTES.HOME} />} />
            </Route>
          </>
        ) : (
          <>
            <Route
              index
              element={<Navigate to={PLAIN_ROUTES.CHAT} replace />}
            />
            <Route path={PLAIN_ROUTES.TOS} element={<TOS />} />
            <Route path={PLAIN_ROUTES.PP} element={<PP />} />
            {/* For SPA and local environment */}
            {(STAGE === STAGES.DEVELOPMENT || STAGE === STAGES.STAGING) && (
              <>
                <Route
                  path={PLAIN_ROUTES.AUTH_TOKENS}
                  element={<AuthTokensScreen />}
                />
                <Route path="/" element={<AppLayout />}>
                  <Route path={PLAIN_ROUTES.CHAT} element={<ChatScreen />} />
                  <Route path={PLAIN_ROUTES.FAQ} element={<FAQ />} />
                  <Route path={PLAIN_ROUTES.TERMINAL} element={<Dashboard />} />

                  <Route
                    path={DeprecatedDevRoutes.DASHBOARD}
                    element={<Navigate to={PLAIN_ROUTES.TERMINAL} replace />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to={PLAIN_ROUTES.HOME} />}
                  />
                </Route>
              </>
            )}
          </>
        )}
      </>
    ),
    [isChatRoute]
  );

  return (
    <>
      <>
        <Routes>{routes}</Routes>
      </>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--privy-color-background)',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;
