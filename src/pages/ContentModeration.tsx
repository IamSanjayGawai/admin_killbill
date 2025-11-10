import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Tabs from '../components/Tabs';
import Select from '../components/Select';
import { CheckCircle, XCircle, Eye, Video, Image as ImageIcon } from 'lucide-react';
import { generateMockContent } from '../utils/mockData';

export default function ContentModeration() {
  const [selectedContent, setSelectedContent] = useState<typeof mockContent[0] | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('pending');

  const mockContent = generateMockContent(50);

  const handlePreview = (content: typeof mockContent[0]) => {
    setSelectedContent(content);
    setIsPreviewModalOpen(true);
  };

  const ContentGrid = ({ contents }: { contents: typeof mockContent }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {contents.map((content) => (
        <Card key={content.id} className="overflow-hidden">
          <div className="relative">
            <img
              src={content.thumbnail}
              alt={content.type}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              {content.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
              {content.type}
            </div>
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                content.status === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : content.status === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {content.status}
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm font-medium text-gray-900">{content.userName}</p>
            <p className="text-xs text-gray-600 mt-1">
              Uploaded: {content.uploadDate}
            </p>
            <p className="text-xs text-gray-600">Views: {content.views.toLocaleString()}</p>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={() => handlePreview(content)}
              >
                <Eye size={14} className="mr-1" />
                View
              </Button>
              {content.status === 'pending' && (
                <>
                  <Button size="sm" variant="success">
                    <CheckCircle size={14} />
                  </Button>
                  <Button size="sm" variant="danger">
                    <XCircle size={14} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const pendingContent = mockContent.filter((c) => c.status === 'pending');
  const approvedContent = mockContent.filter((c) => c.status === 'approved');
  const rejectedContent = mockContent.filter((c) => c.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600 mt-1">Review and moderate user-generated content</p>
        </div>
        <Select
          options={[
            { value: 'all', label: 'All Content' },
            { value: 'pending', label: 'Pending Review' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' }
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-gray-900">{pendingContent.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">{approvedContent.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{rejectedContent.length}</p>
        </div>
      </div>

      <Tabs
        tabs={[
          {
            key: 'pending',
            label: `Pending (${pendingContent.length})`,
            content: <ContentGrid contents={pendingContent.slice(0, 12)} />
          },
          {
            key: 'videos',
            label: 'Videos',
            content: <ContentGrid contents={mockContent.filter((c) => c.type === 'video').slice(0, 12)} />
          },
          {
            key: 'stories',
            label: 'Stories',
            content: <ContentGrid contents={mockContent.filter((c) => c.type === 'story').slice(0, 12)} />
          },
          {
            key: 'approved',
            label: 'Approved',
            content: <ContentGrid contents={approvedContent.slice(0, 12)} />
          },
          {
            key: 'rejected',
            label: 'Rejected',
            content: <ContentGrid contents={rejectedContent.slice(0, 12)} />
          }
        ]}
      />

      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Content Preview & Moderation"
        size="lg"
        footer={
          selectedContent?.status === 'pending' && (
            <>
              <Button variant="danger" onClick={() => setIsPreviewModalOpen(false)}>
                <XCircle size={18} className="mr-2" />
                Reject
              </Button>
              <Button variant="success" onClick={() => setIsPreviewModalOpen(false)}>
                <CheckCircle size={18} className="mr-2" />
                Approve
              </Button>
            </>
          )
        }
      >
        {selectedContent && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedContent.thumbnail}
                alt="Content preview"
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
                {selectedContent.type === 'video' ? (
                  <Video size={24} />
                ) : (
                  <ImageIcon size={24} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Content ID</p>
                <p className="font-medium">{selectedContent.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium capitalize">{selectedContent.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Uploaded By</p>
                <p className="font-medium">{selectedContent.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Upload Date</p>
                <p className="font-medium">{selectedContent.uploadDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Views</p>
                <p className="font-medium">{selectedContent.views.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-medium capitalize ${
                  selectedContent.status === 'approved' ? 'text-green-600' :
                  selectedContent.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {selectedContent.status}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Moderation Notes</p>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add notes for this content review..."
              />
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Review Guidelines:</strong> Ensure content follows community guidelines and does
                not contain inappropriate material, hate speech, or copyrighted content.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
