import { Row, Col, Spin, Empty } from 'antd';
import { BookCard } from './BookCard';
import type { Book } from '../types';

interface BookListProps {
  books: Book[];
  loading: boolean;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

/**
 * 图书列表组件
 * 显示所有图书的网格布局列表
 * 支持加载状态和空状态显示
 * 需求：4.1, 4.2, 4.3
 */
export const BookList: React.FC<BookListProps> = ({
  books,
  loading,
  onEdit,
  onDelete,
}) => {
  // 加载状态 - 需求 4.2
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 空状态 - 需求 4.3
  if (books.length === 0) {
    return (
      <div style={{ padding: '50px 0' }}>
        <Empty
          description="暂无图书数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  // 图书列表展示 - 需求 4.1
  return (
    <Row gutter={[16, 16]}>
      {books.map((book) => (
        <Col
          key={book.id}
          xs={24}  // 移动设备：1列
          sm={12}  // 小屏幕：2列
          md={8}   // 中等屏幕：3列
          lg={6}   // 大屏幕：4列
          xl={6}   // 超大屏幕：4列
          style={{ display: 'flex' }}
        >
          <BookCard
            book={book}
            onEdit={() => onEdit(book)}
            onDelete={() => onDelete(book.id)}
          />
        </Col>
      ))}
    </Row>
  );
};
