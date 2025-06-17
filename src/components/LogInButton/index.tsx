'use strict';

import { AccountIcon } from '@/assets/icons/AccountIcon';

export const LogInButton = ({ ...props }) => {
  return (
    <button
      className="cursor-pointer flex items-center gap-[6px] p-[13px] pl-[26px] border-[0.5px] border-solid border-[#FFFFFF1A] rounded-full disabled:opacity-50"
      {...props}
    >
      <span className="hover:opacity-70 transition duration-300 text-sm leading-none">
        Log in
      </span>
      <span className="inline-flex items-center justify-center rounded-full text-violet11 outline-none hover:bg-violet3">
        <AccountIcon width={24} height={24} />
      </span>
    </button>
  );
};
