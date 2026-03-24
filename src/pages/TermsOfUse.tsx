import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";

export function TermsOfUsePage() {
  return (
    <>
      <Navbar />
      <section className="mt-[50px] lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-6 lg:space-y-8">
        <div>
          <p className="text-[#181818] text-center lg:text-left font-semibold text-2xl lg:text-4xl">
            Terms of Use
          </p>
          <p className="text-sm lg:text-lg mt-2">Last Updated: March 19, 2025</p>
        </div>

        {/* 1 */}
        <div className="lg:space-y-2">
          <p className="text-[#181818] font-medium">
            1. Acceptance of Terms
          </p>
          <p>
            Welcome to TravelMate. These Terms of Use constitute a legally
            binding agreement between you and TravelMate Inc.
          </p>
          <p>
            By accessing or using our Service, you agree to be bound by these
            Terms. If you do not agree, you may not use the Service.
          </p>
        </div>

        {/* 2 */}
        <div className="lg:space-y-2">
          <p className="text-[#181818] font-medium">
            2. Eligibility
          </p>
          <p>
            You must be at least 18 years old and capable of forming a binding
            contract to use our Service.
          </p>
        </div>

        {/* 3 */}
        <div className="lg:space-y-5">
          <p className="text-[#181818] font-medium">
            3. User Accounts
          </p>

          <div>
            <p className="">
              3.1 Account Creation
            </p>
            <p>
              You agree to provide accurate and complete information during
              registration and keep it updated.
            </p>
          </div>

          <div>
            <p className="">
              3.2 Account Security
            </p>
            <p>
              You are responsible for maintaining your account credentials and
              all activities under your account.
            </p>
          </div>

          <div>
            <p className="">
              3.3 Account Termination
            </p>
            <p>
              We may suspend or terminate your account if you violate these
              Terms.
            </p>
          </div>
        </div>

        {/* 4 */}
        <div className="lg:space-y-3">
          <p className="text-[#181818] font-medium">
            4. Booking Services
          </p>

          <div>
            <p className="">4.1 Booking Process</p>
            <p>
              TravelMate acts as an intermediary between you and service
              providers. Bookings are contracts between you and the provider.
            </p>
          </div>

          <div>
            <p className="">4.2 Prices & Availability</p>
            <p>
              Prices and availability may change without notice until booking is
              confirmed.
            </p>
          </div>

          <div>
            <p className="">4.3 Payment</p>
            <p>
              Payments are processed via third-party providers and subject to
              their terms.
            </p>
          </div>

          <div>
            <p className="">4.4 Cancellations & Refunds</p>
            <p>
              Policies vary by provider. Review terms before booking.
            </p>
          </div>
        </div>

        {/* 5 */}
        <div className="lg:space-y-2">
          <p className="text-[#181818] font-medium">
            5. Acceptable Use
          </p>
          <p>You agree not to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Use the Service for illegal activities</li>
            <li>Post harmful or abusive content</li>
            <li>Impersonate others</li>
            <li>Disrupt the platform</li>
            <li>Attempt unauthorized access</li>
            <li>Use bots or automated scraping</li>
            <li>Send spam or promotions</li>
            <li>Overload or damage the Service</li>
          </ul>
        </div>

        {/* 6 */}
        <div className="lg:space-y-5">
          <p className="text-[#181818] font-medium">
            6. Intellectual Property
          </p>

          <div>
            <p className="">6.1 TravelMate Content</p>
            <p>
              All content on the Service is owned by TravelMate and protected by
              intellectual property laws.
            </p>
          </div>

          <div>
            <p className="">6.2 User Content</p>
            <p>
              By submitting content, you grant us a license to use and distribute
              it in connection with the Service.
            </p>
          </div>
        </div>

        {/* 7 */}
        <div className="lg:space-y-2">
          <p className="text-[#181818] font-medium">
            7. Third-Party Services
          </p>
          <p>
            We are not responsible for third-party websites or services linked
            from our platform.
          </p>
        </div>

        {/* 8 */}
        <div className="lg:space-y-2">
          <p className="text-[#181818] font-medium">
            8. Limitation of Liability
          </p>
          <p>
            We are not liable for any indirect or consequential damages arising
            from your use of the Service.
          </p>
        </div>

        {/* 9 */}
        <div className="lg:space-y-2">
          <p className="text-[#181818] font-medium">
            9. Disclaimer of Warranties
          </p>
          <p>
            The Service is provided "as is" without warranties of any kind.
          </p>
        </div>

        {/* 10 */}
        <div className="lg:space-y-2">
          <p className="text-[#181818] font-medium">
            10. Contact Us
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