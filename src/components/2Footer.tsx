export default function Footer() {
  return (
    <footer className="bg-[#023E8A] text-white py-10 px-6 md:px-14">
      {/* Footer Links Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Our Product */}
        <div>
          <h3 className="text-lg font-bold mb-3">Our Product</h3>
          <ul className="space-y-2">
            <li><a href="/stays-search-result" className="hover:underline">Stays</a></li>
            <li><a href="/departure-flight" className="hover:underline">Flight</a></li>
            <li><a href="/display-cars" className="hover:underline">Airport Taxi</a></li>
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
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Our Partners</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-bold mb-3">Policies</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Privacy</a></li>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
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
