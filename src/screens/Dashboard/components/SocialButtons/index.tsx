import { X } from '@/assets/icons/X';
import { ConfirmUnlinkModal } from '@/layouts/AppLayout/component/Header/components/ConfirmUnlinkModal';
import { userService } from '@/services/userService';
import { SocialsEnum } from '@/types/socials';
import { isCreatedWithTelegram, isCreatedWithTwitter } from '@/utilities/privy';
import { useLinkAccount, usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import { BsTelegram } from 'react-icons/bs';

export const SocialButtons = () => {
  const { user, unlinkTwitter, unlinkTelegram } = usePrivy();
  const { linkTwitter, linkTelegram } = useLinkAccount({
    onSuccess: async () => {
      await userService.registerUser();
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialToUnlink, setSocialToUnlink] = useState<SocialsEnum | null>(
    null
  );
  const isTwitterUnlinkDisabled = isCreatedWithTwitter(user);
  const isTelegramUnlinkDisabled = isCreatedWithTelegram(user);

  const handleToggleSocial = async (social: SocialsEnum) => {
    if (!user) return;

    if (social === SocialsEnum.TWITTER && user.twitter) {
      if (!isTwitterUnlinkDisabled) {
        setSocialToUnlink(social);
        return;
      }
    }

    if (social === SocialsEnum.TELEGRAMM && user.telegram) {
      if (!isTelegramUnlinkDisabled) {
        setSocialToUnlink(social);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (social === SocialsEnum.TWITTER) {
        user.twitter
          ? await unlinkTwitter(user.twitter.subject)
          : linkTwitter();
      } else if (social === SocialsEnum.TELEGRAMM) {
        user.telegram
          ? await unlinkTelegram(user.telegram.telegramUserId)
          : linkTelegram();
      }
      await userService.registerUser();
    } finally {
      setIsSubmitting(false);
      setSocialToUnlink(null);
    }
  };

  return (
    <>
      {user?.twitter && (
        <button
          onClick={() => handleToggleSocial(SocialsEnum.TWITTER)}
          className="hover:opacity-70 duration-300 cursor-pointer flex items-center justify-start gap-1 bg-[#171717] bg-opacity-[36%] p-[13px] rounded-[10px]"
        >
          <div>
            <X
              width={20}
              height={20}
              className="bg-[#FFFFFF1A] p-1 rounded-[4px] min-w-5"
            />
          </div>
        </button>
      )}
      {user?.telegram && (
        <button
          onClick={() => handleToggleSocial(SocialsEnum.TELEGRAMM)}
          className="hover:opacity-70 duration-300 cursor-pointer flex items-center justify-start gap-1 bg-[#171717] bg-opacity-[36%] p-[13px] rounded-[10px]"
        >
          <div>
            <BsTelegram className="text-[#fff] text-[22px] bg-[#FFFFFF1A] rounded-[4px] p-1 min-w-5" />
          </div>
        </button>
      )}

      <ConfirmUnlinkModal
        isOpened={!!socialToUnlink}
        onClose={() => setSocialToUnlink(null)}
        socialLinkName={socialToUnlink as SocialsEnum}
        onConfirm={() => {
          if (socialToUnlink) {
            handleToggleSocial(socialToUnlink);
          }
        }}
        isLoading={isSubmitting}
      />
    </>
  );
};
