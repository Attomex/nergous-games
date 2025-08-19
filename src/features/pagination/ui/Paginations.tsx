import { Pagination } from "antd";

interface PaginationProps {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    onChange: (page: number) => void;
}

export const Paginations: React.FC<PaginationProps> = ({ totalItems, currentPage, pageSize, onChange }) => {
    return (
        <Pagination
            className="styled-pagination"
            total={totalItems}
            current={currentPage}
            align="center"
            showQuickJumper
            showSizeChanger={false}
            pageSize={pageSize}
            onChange={onChange}
            locale={{
                page: "",
                jump_to: "Перейти к",
            }}
        />
    );
};
