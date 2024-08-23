interface UserMaxWidthProps {
  children?: React.ReactNode;
}

export const UserMaxWidth = ({ children }: UserMaxWidthProps) => {
  return (
    <div className="mt-16 md:mt-0 px-8 pb-4 max-w-7xl w-full mx-auto">
      {children}
    </div>
  );
};
