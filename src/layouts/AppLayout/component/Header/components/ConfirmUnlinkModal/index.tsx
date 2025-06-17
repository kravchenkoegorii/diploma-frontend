import { Modal } from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { CgSpinnerAlt } from 'react-icons/cg';
import { SocialsEnum } from '@/types/socials';
import { FaXTwitter } from 'react-icons/fa6';
import { BsTelegram } from 'react-icons/bs';

type Props = {
  socialLinkName: SocialsEnum;
  isLoading: boolean;
  isOpened: boolean;
  onClose: () => void;
  onConfirm: (val: SocialsEnum) => void;
};
export const ConfirmUnlinkModal: React.FC<Props> = ({
  socialLinkName,
  onClose,
  onConfirm,
  isOpened,
  isLoading,
}) => {
  return (
    <Modal
      open={isOpened}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-col justify-center items-center z-[20] "
    >
      <>
        <div className="absolute inset-0 backdrop-blur-[4px] bg-[#000]/10"></div>

        <div className="relative max-w-[293px] border-[0.5px] z-[10] border-solid border-white/10 rounded-[23px] pt-[32px] px-[26px] pb-[20px] backdrop-blur-[25.4px]  flex flex-col items-center">
          {socialLinkName === SocialsEnum.TWITTER ? (
            <FaXTwitter className="text-[51px] text-white" />
          ) : (
            <BsTelegram className="text-[51px] text-white" />
          )}
          <IoMdClose
            width={16}
            height={16}
            className="text-[#969598] absolute right-3 top-3 cursor-pointer"
            onClick={onClose}
          />
          <div className="text-white/60 text-center leading-[19.2px] py-6">
            Are you sure you want to disconnect {socialLinkName} account?
          </div>
          <div className="grid grid-cols-2 w-full gap-2 justify-end">
            <button
              onClick={onClose}
              className="flex justify-center items-center grow hover:opacity-75 transition duration-200 cursor-pointer py-[9px] px-[37px] bg-[rgba(23,23,23,0.16)] border-[0.5px] border-solid border-white/10 text-white rounded-[23px]"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(socialLinkName)}
              disabled={isLoading}
              className="flex justify-center items-center grow hover:opacity-75 transition duration-200 cursor-pointer py-[9px] px-[37px] bg-[#FF31315E] border-[0.5px] border-solid border-white/10 text-white rounded-[23px] disabled:pointer-events-none"
            >
              {isLoading ? (
                <CgSpinnerAlt
                  style={{ width: '17px', height: '17px' }}
                  color="inherit"
                  className="animate-spin"
                />
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};
