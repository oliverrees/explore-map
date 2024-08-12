interface CardHolderProps {
  children?: React.ReactNode;
}

export const CardHolder = ({ children }: CardHolderProps) => {
  return (
    <div className="bg-white shadow sm:rounded-lg w-full">
      <div className="px-4 py-5 sm:p-6 flex justify-between">{children}</div>
    </div>
  );
};
