import Modal from "./Modal";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose, onDelete }: DeleteAccountModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Account"
      onSave={onDelete}
      saveText="Delete Account"
    >
      <div className="space-y-4">
        {/* Reason for Deletion */}
        <p className="font-semibold">Kindly select why you want to delete your account</p>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="reason" value="Alternative" className="mr-2" /> Found A Better Alternative App
          </label>
          <label className="flex items-center">
            <input type="radio" name="reason" value="Notifications" className="mr-2" /> Excessive Notifications and
            Email Overload
          </label>
          <label className="flex items-center">
            <input type="radio" name="reason" value="Security" className="mr-2" /> Account Security Concerns
          </label>
        </div>

        {/* Additional Feedback */}
        <p className="font-semibold">Additional Feedback</p>
        <p className="text-gray-500 text-sm">
          We are committed to improving our services. Your honest insight helps us understand how we can do better.
        </p>
        <textarea
          placeholder="Type here..."
          className="w-full border rounded-md p-2 h-24 resize-none outline-none"
        ></textarea>
      </div>
    </Modal>
  );
}
