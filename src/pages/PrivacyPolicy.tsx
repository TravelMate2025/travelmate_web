import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";

export function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <section className="mt-[50px] lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-8">
        <div>
          <p className="text-[#181818] font-semibold text-2xl text-center lg:text-left lg:text-4xl">
            Privacy Policy
          </p>
          <p className="text-sm lg:mt-2  lg:text-lg mt-6">Last Updated: March 19, 2025</p>
        </div>

        {/* 1 */}
        <div className="">
          <p className="text-[#181818] font-semibold">
            1. Introduction
          </p>
          <p>
            Welcome to TravelMate. We respect your privacy and are committed to
            protecting your personal data. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our website and mobile application (collectively, the "Service").
          </p>
          <p>
            By using our Service, you consent to the collection, use, and
            disclosure of your information as described in this Privacy Policy.
          </p>
        </div>

        {/* 2 */}
        <div className="space-y-2">
          <p className="text-[#181818] font-medium">
            2. Information We Collect
          </p>

          {/* 2.1 */}
          <div className="">
            <p className="">
              2.1 Personal Information
            </p>
            <p>We may collect personal information when you:</p>
            <ul className="list-disc ml-6">
              <li>Create an account</li>
              <li>Make bookings (flights, hotels, rentals)</li>
              <li>Contact support</li>
              <li>Subscribe to newsletters</li>
            </ul>

            <p>This may include:</p>
            <ul className="list-disc ml-6">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Payment information</li>
              <li>Date of birth</li>
            </ul>
          </div>

          {/* 2.2 */}
          <div className="space-y-2">
            <p className="">
              2.2 Usage Information
            </p>
            <p>We automatically collect:</p>
            <ul className="list-disc ml-6">
              <li>IP address</li>
              <li>Device type</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Time and date of visits</li>
              <li>Referring website</li>
              <li>Search terms</li>
              <li>Clickstream data</li>
            </ul>
          </div>

          {/* 2.3 */}
          <div className="">
            <p className="">
              2.3 Location Information
            </p>
            <p>
              With your consent, we may collect precise location data to provide
              services like nearby hotels or rentals.
            </p>
          </div>

          {/* 2.4 */}
          <div className="space-y-2">
            <p className="">
              2.4 Cookies and Tracking
            </p>
            <p>
              We use cookies and similar technologies to improve user experience
              and analyze usage.
            </p>
          </div>
        </div>

        {/* 3 */}
        <div className="space-y-2">
          <p className="text-[#181818] font-medium">
            3. How We Use Your Information
          </p>

          <div>
            <p className="">3.1 Provide Services</p>
            <ul className="list-disc ml-6">
              <li>Process bookings</li>
              <li>Handle payments</li>
              <li>Send confirmations</li>
              <li>Customer support</li>
            </ul>
          </div>

          <div>
            <p className="">3.2 Improve Services</p>
            <ul className="list-disc ml-6">
              <li>Analyze trends</li>
              <li>Fix bugs</li>
              <li>Develop new features</li>
            </ul>
          </div>

          <div>
            <p className="">3.3 Marketing</p>
            <ul className="list-disc ml-6">
              <li>Send newsletters</li>
              <li>Promotional offers</li>
            </ul>
          </div>

          <div>
            <p className="">3.4 Legal & Security</p>
            <ul className="list-disc ml-6">
              <li>Comply with laws</li>
              <li>Prevent fraud</li>
              <li>Secure platform</li>
            </ul>
          </div>
        </div>

        {/* 4 */}
        <div className="space-y-2">
          <p className="text-[#181818] font-medium">
            4. Information Sharing
          </p>

          <div>
            <p className="">4.1 Service Providers</p>
            <p>
              We may share data with providers like payment processors, airlines,
              hotels, and analytics tools.
            </p>
          </div>

          <div>
            <p className="">4.2 Business Transfers</p>
            <p>
              Data may be transferred during mergers or acquisitions.
            </p>
          </div>

          <div>
            <p className="">4.3 Legal Requirements</p>
            <p>
              We may disclose data if required by law.
            </p>
          </div>

          <div>
            <p className="">4.4 Consent</p>
            <p>
              We may share data with your explicit permission.
            </p>
          </div>
        </div>

        {/* 5 */}
        <div className="space-y-2">
          <p className="text-[#181818] font-medium">
            5. Data Security
          </p>
          <p>
            We implement security measures to protect your data, but no system is
            100% secure.
          </p>
        </div>

        {/* 6 */}
        <div className="space-y-2">
          <p className="text-[#181818] font-medium">
            6. International Transfers
          </p>
          <p>
            Your data may be processed in other countries with different data
            laws.
          </p>
        </div>

        {/* 7 */}
        <div className="space-y-2">
          <p className="text-[#181818] font-medium">
            7. Changes to Policy
          </p>
          <p>
            We may update this policy periodically. Please review regularly.
          </p>
        </div>

        {/* 8 */}
        <div className="space-y-2">
          <p className="text-[#181818] font-medium">
            8. Contact Us
          </p>
          <p>Email: privacy@travelmate.com</p>
          <p>Phone: 1-800-TRAVEL-MATE</p>
          <p>Address: 123 Booking Street, Travel City</p>
        </div>
      </section>
      <Footer />
    </>
  );
}