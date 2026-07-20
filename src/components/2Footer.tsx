
export default function Footer() {
  return (
    <footer className="bg-[#023E8A] text-white py-10 px-6 md:px-14">
      {/* Footer Links Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Our Product */}
        <div>
          <h3 className="text-lg font-bold mb-3">Our Product</h3>
          <ul className="space-y-2">
            <li><a href="/?tab=stays" className="hover:underline">Stays</a></li>
            <li><a href="/?tab=flights" className="hover:underline">Flight</a></li>
            <li><a href="/?tab=transfers" className="hover:underline">Airport Taxi</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-bold mb-3">Support</h3>
          <ul className="space-y-2">
            <li><a href="/faqs" className="hover:underline">FAQ</a></li>
            <li><a href="/tickets" className="hover:underline">Raise a Ticket</a></li>
            <li><a href="/chat-with-us" className="hover:underline">Chat with Us</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-bold mb-3">Company</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/partners" className="hover:underline">Our Partners</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-bold mb-3">Policies</h3>
          <ul className="space-y-2">
            <li><a href="/privacy-policy" className="hover:underline">Privacy</a></li>
            <li><a href="/terms-of-use" className="hover:underline">Terms of Use</a></li>
            <li><a href="/refund-policy" className="hover:underline">Refund &amp; Cancellation</a></li>
            <li><a href="/cookie-policy" className="hover:underline">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Divider Line */}
      <hr className="border-t-2 border-white my-6" />

      {/* Copyright Section */}
      <div className="text-center text-sm">
        &copy; {new Date().getFullYear()} TravelMate Company. All rights reserved. TravelMate and TravelMate
        Logo are trademarks or registered trademarks of TravelMate.
      </div>
    </footer>
  );
}
