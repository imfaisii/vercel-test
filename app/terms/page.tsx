import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Terms & Conditions | Free Calculators",
  description: "Terms and conditions for using Free Calculators services and website.",
}

export default function TermsPage() {
  const breadcrumbItems = [
    {
      label: "Terms & Conditions",
      href: "/terms",
      current: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>

      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-6">Last updated: March 6, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to Free Calculators ("we," "our," or "us"). By accessing or using our website at freecalculators.ai
          (the "Service"), you agree to comply with and be bound by these Terms and Conditions. Please read them
          carefully.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptance of Terms</h2>
        <p>
          By accessing or using our Service, you confirm that you accept these Terms and Conditions and that you agree
          to comply with them. If you do not agree to these terms, you must not use our Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will provide notice of significant changes by
          updating the "Last updated" date at the top of this page. Your continued use of the Service following the
          posting of revised Terms means that you accept and agree to the changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Using Our Service</h2>
        <p>
          Free Calculators provides various online calculators for different purposes. While we strive for accuracy, we
          cannot guarantee that all calculations will be error-free. The calculators are provided for informational and
          educational purposes only.
        </p>
        <p>
          You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of,
          restrict, or inhibit anyone else's use and enjoyment of the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property
          of Free Calculators. The Service is protected by copyright, trademark, and other laws of both the United
          States and foreign countries.
        </p>
        <p>
          Our trademarks and trade dress may not be used in connection with any product or service without the prior
          written consent of Free Calculators.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
        <p>
          In no event shall Free Calculators, nor its directors, employees, partners, agents, suppliers, or affiliates,
          be liable for any indirect, incidental, special, consequential or punitive damages, including without
          limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your access to or use of or inability to access or use the Service;</li>
          <li>Any conduct or content of any third party on the Service;</li>
          <li>Any content obtained from the Service; and</li>
          <li>Unauthorized access, use or alteration of your transmissions or content.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Disclaimer</h2>
        <p>
          Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
          The Service is provided without warranties of any kind, whether express or implied, including, but not limited
          to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of
          performance.
        </p>
        <p>
          Free Calculators does not warrant that: (a) the Service will function uninterrupted, secure or available at
          any particular time or location; (b) any errors or defects will be corrected; (c) the Service is free of
          viruses or other harmful components; or (d) the results of using the Service will meet your requirements.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the United States, without regard
          to its conflict of law provisions.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of
          these Terms will remain in effect.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <p className="mb-12">
          <Link href="/contact" className="text-primary hover:underline">
            Drop us a Line
          </Link>
        </p>
      </div>
    </div>
  )
}

