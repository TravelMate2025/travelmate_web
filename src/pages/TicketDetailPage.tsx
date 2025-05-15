import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTicketById, replyToTicket } from '../api/tickets';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import clsx from 'clsx';
import Breadcrumbs from '../components/Breadcrumbs';
import Navbar from './homePage/Navbar';
import { MdOutlineImage } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
// import Footer from '../components/2Footer';


interface Message {
  created_at: string;
  id: number;
  sender: { email: string };
  content: string;
  attachment?: string | null;
  timestamp?: string;
}


interface TicketDetail {
  ticket_id: number;
  title: string;
  category: string;
  status: 'pending' | 'resolved';
  created_at: string;
  messages: Message[];
  user: {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}


const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [messageSentTrigger, setMessageSentTrigger] = useState(0);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
  if (!accessToken || !id) {
    setError('No access token or ticket ID provided');
    setLoading(false);
    return;
  }

  let intervalId: ReturnType<typeof setInterval>;
  let runCount = 0;

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(id, accessToken);
      setTicket((prev) => {
        if (!prev || JSON.stringify(prev.messages) !== JSON.stringify(data.messages)) {
          return data;
        }
        return prev;
      });
    } catch (err) {
      console.error('Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  fetchTicket(); // initial fetch

  // Poll 3 times then stop
  intervalId = setInterval(() => {
    if (runCount >= 5) {
      clearInterval(intervalId);
      return;
    }
    runCount++;
    fetchTicket();
  }, 10000); // every 10 seconds

  return () => clearInterval(intervalId);
}, [id, accessToken, messageSentTrigger]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages?.length]);


  const handleSend = async () => {
    if (!accessToken || !id) return;
  
    // Fallback message if only attachment is present
    const messageToSend = newMessage.trim() || (attachment ? "Sent an attachment" : "");
  
    // Don't proceed if both message and attachment are empty
    if (!messageToSend && !attachment) return;
  
    setSending(true);
    try {
      const response = await replyToTicket(id, messageToSend, accessToken, attachment);
  
      const correctedMessage: Message = {
        ...response,
        sender: { email: ticket!.user.email },
        created_at: new Date().toISOString(),
      };
  
      setTicket((prev) =>
        prev ? { ...prev, messages: [...prev.messages, correctedMessage] } : prev
      );
  
      setNewMessage('');
      setAttachment(null);
      setMessageSentTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Reply failed:', err);
    } finally {
      setSending(false);
    }
  };
  
  
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Tickets", link: "/tickets" },
    { name: "Ticket Details" },
  ];
  

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-4 sm:p-8 mt-12 sm:mt-10 space-y-6">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
  
          {/* Title skeleton */}
          <div className="h-8 w-48 bg-gray-300 rounded-md animate-pulse" />
  
          {/* Ticket info skeleton */}
          <div className="bg-white rounded-lg shadow border p-4 space-y-2 animate-pulse">
            <div className="h-5 w-1/3 bg-gray-300 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>
  
          {/* Messages skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
  
          {/* Reply input skeleton */}
          <div className="fixed bottom-2 left-2 right-2 bg-white border-t border-gray-200 shadow-md px-2 py-2">
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="flex-1 h-10 bg-gray-100 rounded-md" />
              <div className="w-16 h-10 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!ticket) return null;

  return (
      <>
      <Navbar />
      <div className="p-4 sm:p-8 mt-12 sm:mt-10">
      <div className='hidden md:ml-[-40px] md:block '>
      <Breadcrumbs items={breadcrumbs} />
      </div>
      <hr className="mb-4 text-gray-300" />

      <div className="flex items-center mb-2 md:hidden py-2">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md p-2"
        >
          <IoChevronBack size={24} />
        </button>
  
        <h1 className="text-2xl font-bold ml-16">Tickets Details</h1>
      </div>
      

      <h1 className="text-xl font-bold mb-4 hidden md:block">Ticket Details</h1>

      {/* Ticket Info */}
      <div className="flex justify-between bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
        <div>
          <h2 className="font-semibold text-lg">{ticket.title}</h2>
          <p className="text-sm text-gray-500">Category: {ticket.category}</p>
          <p className="text-xs text-gray-400">Ticket ID: {ticket.ticket_id} • {new Date(ticket.created_at).toLocaleString()}</p>
        </div>
        <span
          className={clsx(
            'text-sm font-medium px-3 py-1 rounded-lg border h-8',
            ticket.status === 'resolved'
              ? 'text-green-600 border-green-600'
              : 'text-yellow-400 border-yellow-400'
          )}
        >
          {ticket.status}
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-16">
      {ticket.messages?.length > 0 ? (
          ticket.messages.map((msg, index) => {
            const isUser = msg.sender?.email?.toLowerCase() === ticket.user.email.toLowerCase();
            const isAdmin = !isUser;
            const date = new Date(msg.created_at ?? msg.timestamp ?? '').toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            });
            const adminName = msg.sender?.email?.split('@')[0] || 'Admin';
            const firstLetter = adminName.charAt(0).toUpperCase();

            return (
              <div
            key={`${msg.id}-${msg.created_at || index}`}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}
          >
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-2`}>
              {isAdmin && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#023E8A] text-white font-semibold text-sm mt-1">
                  {firstLetter}
                </div>
              )}

              <div
                className={` w-fit min-w-[70px] max-w-[70%] md:max-w-[60%] p-3 text-sm rounded-md ${
                  isUser ? 'bg-[#023E8A] text-white' : 'bg-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.attachment && (
                  <div className="mt-2 space-y-1">
                    <img
                      src={msg.attachment}
                      alt="Attachment"
                      className="rounded-md max-h-48 object-contain border"
                    />
                    <a
                      href={msg.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      View Full Image
                    </a>
                  </div>
                )}

              </div>
            </div>

            <div
              className={`text-xs text-gray-500 mt-1 ${
                isUser ? 'text-right pr-1' : 'text-left pl-10'
              }`}
            >
              {isUser ? date : `${adminName} • ${date}`}
            </div>
          </div>

            );
          })
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )}

      </div>

      {/* Reply Box */}
      {ticket.status === 'resolved' ? (
        <div className="bg-blue-50 text-gray-700 p-3 rounded-md text-sm border border-[#023E8A]">
          Ticket successfully resolved. If you need further assistance, please create a new ticket or contact our support team.
        </div>
      ) : (
        <>
         {attachmentLoading ? (
            <div className="fixed bottom-20 left-2 right-2 flex items-center justify-center p-2 mb-2">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : attachment && (
            <div className="fixed bottom-20 left-2 right-2 bg-white border border-gray-200 rounded-md p-2 mb-2 shadow-md flex items-center gap-4">
              <img
                src={URL.createObjectURL(attachment)}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-md"
              />
              <span className="text-sm text-gray-700 truncate">{attachment.name}</span>
              <button
                onClick={() => {
                   setAttachment(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                
                className="ml-auto text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
          )}


          {/* Reply Input Box */}
          <div className="flex items-center gap-2 border rounded px-2 py-2 fixed bottom-2 left-2 right-2 bg-white shadow-md border-t border-gray-200">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAttachmentLoading(true);
                  setTimeout(() => {
                    setAttachment(file);
                    setAttachmentLoading(false);
                  }, 500);
                }
              }}
              className="hidden"
              id="file-upload"
              ref={fileInputRef}
            />

            <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
              <MdOutlineImage size={30} />
            </label>

            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 outline-none text-sm border border-gray-300 p-2 rounded-md"
              placeholder="Write a reply..."
            />

            <button
              onClick={handleSend}
              disabled={sending}
              className="bg-[#023E8A] text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center min-w-[70px]"
            >
              {sending ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send"
              )}
            </button>

          </div>
        </>
      )}

      <div ref={messagesEndRef} />

    </div>    
      </>
    
  );
};

export default TicketDetailPage;
