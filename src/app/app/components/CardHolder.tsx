interface CardHolderProps {
  children?: React.ReactNode;
  classNames?: string;
}

export const CardHolder = ({ children, classNames }: CardHolderProps) => {
  return (
    <div className={`bg-white shadow rounded-lg w-full ${classNames}`}>
      <div className="">{children}</div>
    </div>
  );
};
