interface TitleBlockProps {
  title: string;
  description: string;
}

export const AppTitleBlock = ({ title, description }: TitleBlockProps) => {
  return (
    <div className="md:mt-6 pt-6 md:py-5 flex justify-center md:justify-between items-center w-full">
      <div>
        <h3 className="text-2xl text-center md:text-left font-semibold font-display leading-6 text-gray-900">
          {title}
        </h3>
        <div className="mt-2 md:mt-4 max-w-xl text-sm text-gray-500 text-center md:text-left font-normal">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};
