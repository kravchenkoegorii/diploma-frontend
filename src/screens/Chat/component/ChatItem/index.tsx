import Modal from '@mui/material/Modal';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { CgSpinnerAlt } from 'react-icons/cg';
import { IoMdClose } from 'react-icons/io';
import useSWR, { mutate } from 'swr';
import { useShallow } from 'zustand/shallow';
import { DeleteIcon } from '../../../../assets/icons/Delete';
import { EditIcon } from '../../../../assets/icons/Edit';
import { danger } from '../../../../assets/images';
import { chatService } from '../../../../services/chatService';
import { chatsStore, useChatsStore } from '../../../../stores/chats';
import { IChat } from '../../../../types/chat';
import { useWindowSize } from 'usehooks-ts';

interface IChatItemProps {
  chat: IChat;
}

export const ChatItem = ({ chat }: IChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);
  const [setIsOpenedChatItemModal] = useChatsStore(
    useShallow(s => [s.setIsOpenedChatItemModal])
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { login } = useLogin();
  const { user } = usePrivy();
  const { width } = useWindowSize();
  const isMobile = width <= 992;
  const selectedChatId = useChatsStore(useShallow(s => s.selectedChat?.id));
  const { data: chats } = useSWR('/chats', () => chatService.getChats(), {
    revalidateOnFocus: !!selectedChatId,
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setNewTitle(chat.title);
  }, [chat.title]);

  const handleSelectChat = async (chatId: IChat['id']) => {
    if (!user) {
      login();
      return;
    }

    if (!chats || isDeleting) {
      return;
    }

    const { setSelectedChat } = chatsStore.getState();

    try {
      const chat = chats.find(chat => chat.id === chatId);
      if (chat) {
        setSelectedChat(chat);
      } else {
        const chat = await mutate<IChat | undefined>(`/chats/${chatId}`);
        setSelectedChat(chat || null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditChat = async () => {
    if (!user) {
      login();
      return;
    }

    if (newTitle.trim() === '') {
      setNewTitle(chat.title);
      setIsEditing(false);

      return;
    }

    if (newTitle === chat.title) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSubmitting(true);
      setIsEditing(false);
      await chatService.updateChat(chat.id, newTitle);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!user) {
      login();
      return;
    }

    try {
      setIsDeleting(true);
      setIsOpenModal(false);
      setIsOpenedChatItemModal(false);
      await chatService.deleteChat(chat.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleEditChat();
    }

    if (e.key === 'Escape') {
      setNewTitle(chat.title);
      setIsEditing(false);
    }
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setIsOpenedChatItemModal(false);
  };

  return (
    <>
      <div
        className={clsx(
          'flex items-center max-992px:w-full max-992px:p-[10px] p-[20px] rounded-[10px] max-h-[56px] cursor-pointer',
          (chat.id === selectedChatId || isEditing) && 'bg-white bg-opacity-5'
        )}
        key={chat?.id}
        onClick={() => handleSelectChat(chat.id)}
      >
        {!isEditing ? (
          <button
            type="button"
            disabled={isEditing || isDeleting}
            className="w-full h-5 -my-0.5 flex items-center justify-between disabled:opacity-50 disabled:pointer-events-none cursor-pointer leading-tight overflow-hidden text-ellipsis whitespace-nowrap hover:opacity-50 duration-30 roomName"
          >
            <div className="whitespace-nowrap overflow-hidden max-w-[100%]">
              <span className="bg-clip-text text-white">{chat?.title}</span>
            </div>
          </button>
        ) : (
          <input
            style={{ caretColor: '#fff' }}
            ref={inputRef}
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleEditChat}
            onKeyDown={handleKeyDown}
            className="w-full max-992px:h-full h-4 max-w-[212px] bg-[transparent] text-[#fff] outline-none"
            placeholder=""
          />
        )}
        <div className="flex items-center gap-1">
          {!isSubmitting && (
            <button
              type="button"
              disabled={isEditing || isDeleting}
              className={clsx(
                'max-992px:w-6 max-992px:h-6 w-5 h-5 flex justify-center items-center text-xl cursor-pointer opacity-75 hover:bg-[#FFFFFF08] rounded-[4px] transition duration-300 disabled:pointer-events-none disabled:opacity-50',
                !user && 'hidden'
              )}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <EditIcon
                width={isMobile ? 16.8 : 17}
                height={isMobile ? 16.8 : 17}
              />
            </button>
          )}
          {isSubmitting && (
            <div className="flex justify-center items-center w-5 min-w-5 text-xl my-auto opacity-75 animate-spin">
              <CgSpinnerAlt />
            </div>
          )}
          {!isDeleting && (
            <button
              type="button"
              disabled={isEditing || isDeleting}
              className={clsx(
                'max-992px:w-6 max-992px:h-6 w-5 h-5 flex justify-center items-center text-xl cursor-pointer opacity-75 hover:bg-[#FFFFFF08] rounded-[4px] transition duration-300 disabled:pointer-events-none disabled:opacity-50',
                !user && 'hidden'
              )}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpenModal(true);
                setIsOpenedChatItemModal(true);
              }}
            >
              <DeleteIcon
                width={isMobile ? 16.8 : 17}
                height={isMobile ? 16.8 : 17}
              />
            </button>
          )}
          {isDeleting && (
            <div className="flex justify-center items-center w-5 min-w-5 text-xl my-auto opacity-75 animate-spin">
              <CgSpinnerAlt />
            </div>
          )}
        </div>
      </div>
      <Modal
        open={isOpenModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex flex-col justify-center items-center z-[20] "
      >
        <>
          <div className="absolute inset-0 backdrop-blur-[4px] bg-[#000]/10"></div>
          <div
            className="relative max-w-[293px] border-[0.5px] z-[10] border-solid border-white/10 
                rounded-[23px] pt-[32px] px-[26px] pb-[20px] backdrop-blur-[25.4px]  flex flex-col items-center"
          >
            <img src={danger} alt="" width={31} height={31} />
            <IoMdClose
              width={16}
              height={16}
              className="text-[#969598] absolute right-3 top-3 cursor-pointer"
              onClick={handleCloseModal}
            />
            <div className="text-white/60 text-center leading-[19.2px] py-6">
              Are you sure you want to delete{' '}
              <div className="inline-block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-center">
                {chat.title} Room?
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleDeleteChat}
                className="hover:opacity-75 transition duration-200 cursor-pointer py-[9px] px-[37px] bg-[#FF31315E] border-[0.5px] border-solid border-white/10 text-white rounded-[23px]"
              >
                Delete
              </button>
              <button
                onClick={handleCloseModal}
                className="hover:opacity-75 transition duration-200 cursor-pointer py-[9px] px-[37px] bg-[rgba(23,23,23,0.16)] border-[0.5px] border-solid border-white/10 text-white rounded-[23px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};
