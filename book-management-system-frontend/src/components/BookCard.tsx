import { Card, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Book } from '../types';
import { getImageUrl } from '@/utils/image';

interface BookCardProps {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * 图书卡片组件
 * 显示单个图书的信息，包括封面、标题、作者、描述
 * 提供编辑和删除操作按钮
 */
export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  return (
    <Card
      hoverable
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      cover={
        <img
          alt={book.name}
          src={getImageUrl(book.cover)}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      actions={[
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
        >
          删除
        </Button>,
      ]}
    >
      <Card.Meta
        title={
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={book.name}
          >
            {book.name}
          </div>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={book.author}
            >
              <strong>作者：</strong>
              {book.author}
            </div>
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                whiteSpace: 'normal',
              }}
              title={book.description}
            >
              <strong>描述：</strong>
              {book.description}
            </div>
          </Space>
        }
      />
    </Card>
  );
};
