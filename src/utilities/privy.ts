import { User } from '@privy-io/react-auth';

export const isCreatedWithTwitter = (user?: User | null) => {
  if (!user) return false;

  const accounts = user.linkedAccounts.filter(
    account =>
      !(account.type === 'wallet' && account.connectorType === 'embedded')
  );
  const createdAtRounded = Math.trunc(user.createdAt.getTime() / 1000);
  const twitterCreatedAt =
    accounts
      .find(account => account.type === 'twitter_oauth')
      ?.firstVerifiedAt?.getTime() || 0;
  const twitterCreatedAtRounded = Math.trunc(twitterCreatedAt / 1000);

  return !!twitterCreatedAt && twitterCreatedAtRounded === createdAtRounded;
};

export const isCreatedWithTelegram = (user?: User | null) => {
  if (!user) return false;

  const accounts = user.linkedAccounts.filter(
    account =>
      !(account.type === 'wallet' && account.connectorType === 'embedded')
  );
  const createdAtRounded = Math.trunc(user.createdAt.getTime() / 1000);
  const twitterCreatedAt =
    accounts
      .find(account => account.type === 'telegram')
      ?.firstVerifiedAt?.getTime() || 0;
  const twitterCreatedAtRounded = Math.trunc(twitterCreatedAt / 1000);

  return !!twitterCreatedAt && twitterCreatedAtRounded === createdAtRounded;
};
