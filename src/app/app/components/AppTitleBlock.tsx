interface TitleBlockProps {
  title: string;
  description: string;
}

export const AppTitleBlock = ({ title, description }: TitleBlockProps) => {
  return (
    <div className="md:mt-6 py-5 flex justify-between items-center w-full">
      <div>
        <h3 className="text-2xl font-semibold font-display leading-6 text-gray-900">
          {title}
        </h3>
        <div className="mt-4 max-w-xl text-sm text-gray-500 font-normal">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};
