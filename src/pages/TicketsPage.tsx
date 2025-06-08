import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import RaiseTicketModal from '../components/modals/RaiseTicketModal';
import { deleteTicket, getTickets } from '../api/tickets';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { FaRegEnvelope } from 'react-icons/fa';
import Navbar from './homePage/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/2Footer';
import { IoChevronBack } from 'react-icons/io5';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { Menu } from '@headlessui/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';


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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Tickets" },
  ];

  const fetchTickets = async () => {
  if (!accessToken) {
    setError('Access token not found');
    setLoading(false);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const data = await getTickets();
    const filtered = data.results.filter((ticket: Ticket) => {
      const normalizedStatus = ticket.status === 'resolved' ? 'resolved' : 'pending';
      return activeTab === 'all' ? true : normalizedStatus === activeTab;
    });
    setTickets(filtered);
  } catch {
    setError('Failed to load tickets');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTickets();
  }, [activeTab, accessToken]);

  

  const handleDeleteRequest = (id: number) => {
    setDeleteId(id);
  };



  const confirmDelete = async () => {
    if (!accessToken || deleteId === null) return;

    setIsDeleting(true);

    try {
      await deleteTicket(deleteId);
      setTickets((prev) => prev.filter((ticket) => ticket.id !== deleteId));
      toast.success('Ticket deleted successfully');
    } catch (err) {
      toast.error('Failed to delete ticket');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };



  return (
    <>
      <Navbar />
      <div className="min-h-100vh flex flex-col justify-between">

          <div className="p-4 sm:p-8 mt-12 sm:mt-10">
        <div className='hidden md:ml-[-40px] md:block '>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <hr className="mb-4 text-gray-400" />

        <div className="flex items-center mb-2 md:hidden py-2">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md p-2"
          >
            <IoChevronBack size={24} />
          </button>
    
          <h1 className="text-2xl font-bold ml-24">Tickets</h1>
        </div>

        {/* Title and Button */}
        <div className="flex justify-between hidden md:block md:flex items-center mb-4 flex-wrap gap-2">
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
            <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4 px-4">
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 max-w-md w-full shadow-sm">
                <div className="text-4xl mb-2">⚠️</div>
                <h2 className="text-lg font-bold mb-1">Something went wrong</h2>
                <p className="text-sm mb-2">
                  An error occurred while fetching your tickets. 
                </p>
                <p className="text-sm mb-4">
                  We are attending to it now. Please try again later.
                </p>
                {/* <p className="text-xs text-red-400 break-words mb-4">{error}</p> */}
                {/* <button
                  onClick={() => fetchTickets()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Retry
                </button> */}
              </div>
            </div>
          ) : loading ? (

          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg w-full" />
            ))}
          </div>
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
          <div className="space-y-4 transition-opacity duration-300">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition"
              >
                {/* Top clickable section */}
                <div
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="p-4 flex justify-between items-start cursor-pointer"
                >
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
                    {ticket.status === 'resolved' ? 'resolved' : 'pending'}
                  </span>
                </div>

                <hr className="border-gray-200" />

                {/* Bottom section - NOT clickable */}
                <div className="p-4 flex justify-between items-start">
                  <div className="text-sm text-gray-600 truncate w-full pr-2">{ticket.description}</div>

                  {/* Vertical dots menu */}
                  <Menu as="div" className="relative inline-block text-left z-10">
                    <Menu.Button
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <HiOutlineDotsVertical className="w-5 h-5 ml-10" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRequest(ticket.id);
                              }}
                              className={`${
                                active ? 'bg-red-100 text-red-700' : 'text-red-600'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Delete
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>

            ))}
          </div>
        )}

        <RaiseTicketModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onTicketRaised={() => {
            setActiveTab('all');
            fetchTickets(); // 👈 manually trigger refetch
          }}
        />

        <ConfirmDeleteModal
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          loading={isDeleting}
        />

       
      </div>

        
      </div>
       {/* Conditionally show Raise a Ticket button at the bottom */}
        {tickets.length > 0 && (
          <div className="md:hidden mt-8 mb-6 px-4">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-[#023E8A] hover:bg-blue-800 text-white px-4 py-3 rounded shadow-lg"
            >
              Raise a ticket
            </button>
          </div>
        )}

      <Footer />
    </>
  );
};

export default TicketsPage;
