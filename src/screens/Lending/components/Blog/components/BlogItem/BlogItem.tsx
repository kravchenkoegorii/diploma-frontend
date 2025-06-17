import { BlogBlackArrow } from '../../../../../../assets/icons/BlogBlackArrow';

interface IBlogItemProps {
  title: string;
  image?: string;
  link: string;
}

export const BlogItem = ({ title, image, link }: IBlogItemProps) => {
  return (
    <div
      className="flex flex-col h-full w-full max-992px:h-[345px] max-992px:min-h-[345px] min-h-[400px] font-radio lg:max-w-[380px] pb-[15px] border-b group"
      dir="ltr"
    >
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div className=" bg-gray-100">
          <img src={image} alt="" className="mb-4 w-full h-full" />
        </div>
      </a>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <p className="max-992px:group-hover:opacity-100 group-hover:opacity-40 transition duration-300 max-992px:text-[24px] text-[34px] text-left mb-[26px]">
          {title}
        </p>
      </a>
      <a
        href={link}
        className="max-992px:group-hover:opacity-100 group-hover:opacity-40 transition duration-300 flex flex-row justify-between items-start mt-auto"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Read on medium</span>
        <BlogBlackArrow />
      </a>
    </div>
  );
};
