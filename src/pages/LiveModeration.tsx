import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Radio, Users, MessageSquare, UserX, StopCircle, AlertTriangle } from 'lucide-react';
import { generateMockLiveStreams } from '../utils/mockData';

export default function LiveModeration() {
  const [selectedStream, setSelectedStream] = useState<typeof mockLiveStreams[0] | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<string>('');

  const mockLiveStreams = generateMockLiveStreams(12);

  const handleAction = (stream: typeof mockLiveStreams[0], action: string) => {
    setSelectedStream(stream);
    setActionType(action);
    setIsActionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Stream Moderation</h1>
        <p className="text-gray-600 mt-1">Monitor and moderate active live streams</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Streams</p>
              <p className="text-2xl font-bold text-gray-900">{mockLiveStreams.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Radio className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Viewers</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockLiveStreams.reduce((sum, stream) => sum + stream.viewers, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flagged Streams</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actions Today</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <StopCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockLiveStreams.map((stream) => (
          <Card key={stream.id}>
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Users size={12} />
                  {stream.viewers.toLocaleString()}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">{stream.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{stream.streamerName}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{stream.category}</span>
                  <span>{stream.duration} min</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleAction(stream, 'view')}
                >
                  <MessageSquare size={14} className="mr-1" />
                  Monitor
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAction(stream, 'mute')}
                >
                  <MessageSquare size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleAction(stream, 'end')}
                >
                  <StopCircle size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={
          actionType === 'end'
            ? 'End Live Stream'
            : actionType === 'mute'
            ? 'Mute Chat'
            : 'Stream Details'
        }
        footer={
          actionType !== 'view' && (
            <>
              <Button variant="secondary" onClick={() => setIsActionModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger">
                {actionType === 'end' ? 'End Stream' : 'Mute Chat'}
              </Button>
            </>
          )
        }
      >
        {selectedStream && (
          <div className="space-y-4">
            {actionType === 'view' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Streamer</p>
                    <p className="font-medium">{selectedStream.streamerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Viewers</p>
                    <p className="font-medium">{selectedStream.viewers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{selectedStream.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{selectedStream.category}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Recent Chat Messages</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {['Great stream!', 'Amazing content', 'Keep it up!', 'Love this!'].map((msg, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium text-blue-600">User{i + 1}: </span>
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <UserX size={16} className="mr-1" />
                    Kick User
                  </Button>
                  <Button variant="danger" size="sm" className="flex-1">
                    <StopCircle size={16} className="mr-1" />
                    End Stream
                  </Button>
                </div>
              </>
            )}

            {actionType === 'end' && (
              <div>
                <p className="text-gray-700">
                  Are you sure you want to end this live stream? This action cannot be undone and the
                  streamer will be notified.
                </p>
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Stream:</strong> {selectedStream.title}
                  </p>
                  <p className="text-sm text-red-800">
                    <strong>Streamer:</strong> {selectedStream.streamerName}
                  </p>
                </div>
              </div>
            )}

            {actionType === 'mute' && (
              <div>
                <p className="text-gray-700">
                  Muting the chat will prevent all viewers from sending messages. The streamer will still
                  be able to broadcast.
                </p>
                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Send warning notification to streamer</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
