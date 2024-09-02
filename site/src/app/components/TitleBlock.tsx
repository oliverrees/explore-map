interface TitleBlockProps {
  title: string;
  description?: string[];
  dark?: boolean;
}

export const TitleBlock = ({ title, description, dark }: TitleBlockProps) => {
  const darkModeText = dark ? "text-white" : "text-black";
  return (
    <div>
      <h2
        className={`text-2xl font-display font-semibold mb-3 lg:mb-4 leading-13 md:leading-13 ${darkModeText}`}
      >
        {title}
      </h2>
      {description && (
        <div
          className={`lg:w-8/12 lg:text-lg text-md flex flex-col gap-6 font-light ${darkModeText}/70`}
        >
          {description.map((desc, index) => (
            <div key={index}>{desc}</div>
          ))}
        </div>
      )}
    </div>
  );
};
