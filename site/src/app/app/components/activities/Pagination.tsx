import { Pagination } from "@nextui-org/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="w-full flex justify-center ">
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        onChange={handlePageChange}
        siblings={1} // Number of sibling pages to show around the current page
        boundaries={1} // Number of boundary pages to show at the start and end
      />
    </div>
  );
}
