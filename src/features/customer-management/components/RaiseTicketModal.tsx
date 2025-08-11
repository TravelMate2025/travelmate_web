import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { createTicket } from '../api/tickets';
import { useSelector } from 'react-redux';
import { RootState } from "../../../store";
import { FaCheck } from 'react-icons/fa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTicketRaised?: () => void;
}

const CreateTicketModal: React.FC<Props> = ({ isOpen, onClose, onTicketRaised }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) return;
    if (!accessToken) {
      setError('Access token missing.');
      return;
    }

    setLoading(true);
    try {
      await createTicket(formData);
      setShowSuccess(true);
      onTicketRaised?.();
      onClose();
      setFormData({ title: '', category: '', description: '', priority: 'medium' });
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Ticket creation failed:', err);
      setError('Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 md:mt-10 overflow-y-auto">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative bg-white rounded-lg max-w-md w-full p-6 z-10 shadow-xl">
            <div className="absolute right-6 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer" onClick={onClose}>
              X
            </div>

            <Dialog.Title className="text-lg font-semibold text-center mb-6">Raise a Ticket</Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Issue Title</label>
                <input
                  name="title"
                  maxLength={50}
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Enter a title"
                  required
                />
                <p className="text-xs text-gray-500 text-right mt-1">{formData.title.length}/50</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500"
                  required
                >
                  <option value="" disabled className=''>Select a category</option>
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Car">Car</option>
                  <option value="Account">Account</option>
                </select>
                <p className="text-xs text-gray-500 text-right mt-1">{formData.category.length}/30</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  maxLength={300}
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Describe your issue"
                  required
                />
                <p className="text-xs text-gray-500 text-right mt-1">{formData.description.length}/300</p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#023E8A] text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={showSuccess} onClose={() => {}} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
        <div className="relative w-[364px] h-[282px] bg-white rounded-lg flex flex-col items-center justify-center gap-4 p-6 z-50 shadow-lg">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
            <FaCheck className="text-white text-3xl" />
          </div>
          <div className="text-xl font-bold">Ticket Submitted</div>
          <div className="text-xl font-bold">Successfully</div>
        </div>
      </Dialog>

    </>
  );
};

export default CreateTicketModal;
