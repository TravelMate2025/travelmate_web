import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';
import { getTicketById, replyToTicket } from '../api/tickets';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import clsx from 'clsx';
import Breadcrumbs from '../components/Breadcrumbs';
import Navbar from './homePage/Navbar';
// import Footer from '../components/2Footer';


interface Message {
  created_at: string;
  id: number;
  sender: { email: string };
  content: string;
  attachment?: string | null;
  timestamp?: string;
}

// interface TicketDetail {
//   ticket_id: number;
//   title: string;
//   category: string;
//   status: 'pending' | 'resolved';
//   created_at: string;
//   messages: Message[];
// }

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (!accessToken || !id) {
      setError('No access token or ticket ID provided');
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id!, accessToken);
        setTicket(data);
      } catch (err) {
        setError('Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleSend = async () => {
    if (!newMessage.trim() || !accessToken || !id) return;
  
    try {
      const response = await replyToTicket(id, newMessage, accessToken);
  
      const correctedMessage: Message = {
        ...response,
        sender: { email: ticket!.user.email },
        created_at: new Date().toISOString(), // fallback to current time
      };
  
      setTicket((prev) =>
        prev ? { ...prev, messages: [...prev.messages, correctedMessage] } : prev
      );
  
      setNewMessage('');
    } catch (err) {
      console.error('Reply failed:', err);
    }
  };
  
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Tickets", link: "/tickets" },
    { name: "Ticket Details" },
  ];
  

  if (loading) return <div className="p-4">Loading ticket...</div>;
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

      <h1 className="text-xl font-bold mb-4">Ticket Details</h1>

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
                className={` w-fit min-w-[70px] max-w-[70%] md:max-w-[60%] p-3 rounded-md text-sm ${
                  isUser ? 'bg-[#023E8A] text-white' : 'bg-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.attachment && (
                  <p className="mt-1">
                    <a
                      href={msg.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      View Attachment
                    </a>
                  </p>
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
        <div className="flex items-center gap-2 border rounded px-2 py-2 fixed bottom-2 left-2 right-2 bg-white shadow-md border-t border-gray-200">
          <button className="text-gray-500">
            <FaImage size={30} />
          </button>

          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 outline-none text-sm border border-gray-300 p-2 rounded-md"
            placeholder="Write a reply..."
          />

          <button
            onClick={handleSend}
            className="bg-[#023E8A] text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      )}

    </div>
    {/* <div className='hidden md:block'>
    <Footer />
    </div> */}
    
      </>
    
  );
};

export default TicketDetailPage;
