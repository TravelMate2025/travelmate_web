import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import RaiseTicketModal from '../components/modals/RaiseTicketModal';
import { getTickets } from '../api/tickets';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { FaRegEnvelope } from 'react-icons/fa';
import Navbar from './homePage/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/2Footer';

interface Ticket {
  id: number;
  ticket_id: string;
  title: string;
  category: string;
  status: 'pending' | 'resolved';
  created_at: string;
  description: string;
}

const TicketsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ ,setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Tickets" },
  ];

  useEffect(() => {
    if (!accessToken) {
      setError('Access token not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getTickets(accessToken)
      .then((data) => {
        const filtered = data.results.filter((ticket: Ticket) =>
          activeTab === 'all' ? true : ticket.status === activeTab
        );
        setTickets(filtered);
      })
      .catch(() => setError('Failed to load tickets'))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <>
    <Navbar />
    <div className="p-4 sm:p-8 mt-12 sm:mt-10">
      <div className='hidden md:ml-[-40px] md:block '>
      <Breadcrumbs items={breadcrumbs} />
      </div>
      
      <hr className="mb-4 text-gray-400" />

      {/* Title and Button */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold">Tickets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#023E8A] hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          Raise a ticket
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-200 rounded-md p-4 flex space-x-2 w-full mb-6">
        {['all', 'pending', 'resolved'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'all' | 'pending' | 'resolved')}
            className={clsx(
              'flex-1 py-2 px-4 rounded-md text-black text-sm capitalize',
              activeTab === tab ? 'bg-white text-black font-semibold shadow' : 'text-gray-600'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4 text-gray-600">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500">
            <FaRegEnvelope size={24} />
          </div>
          <h2 className="text-lg font-bold">No Tickets Found</h2>
          <p className="text-sm">Need Help? Raise a new Ticket.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#023E8A] hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Raise a ticket
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="bg-white rounded-lg shadow border border-gray-200 cursor-pointer hover:shadow-md transition"
            >
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{ticket.title}</h2>
                  <p className="text-sm text-gray-500">Category: {ticket.category}</p>
                  <p className="text-xs text-gray-400">
                    Ticket ID: {ticket.ticket_id} • {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={clsx(
                    'text-sm font-medium px-3 py-1 rounded-lg border',
                    ticket.status === 'resolved'
                      ? 'text-green-600 border-green-600'
                      : 'text-yellow-400 border-yellow-400'
                  )}
                >
                  {ticket.status}
                </span>
              </div>
              <hr className="border-gray-200" />
              <div className="p-4 text-sm text-gray-600 truncate">{ticket.description}</div>
            </div>
          ))}
        </div>
      )}

      <RaiseTicketModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onTicketRaised={() => setActiveTab('all')}
      />
    </div>
    <Footer />
    </>
    
  );
};

export default TicketsPage;
