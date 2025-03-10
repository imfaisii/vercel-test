import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Privacy Policy | Free Calculators",
  description: "Privacy policy for Free Calculators services and website.",
}

export default function PrivacyPage() {
  const breadcrumbItems = [
    {
      label: "Privacy Policy",
      href: "/privacy",
      current: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-6">Last updated: March 6, 2025</p>

        <p className="mb-6">
          At Free Calculators, we respect your privacy and are committed to protecting your personal data. This Privacy
          Policy explains how we collect, use, and safeguard your information when you visit our website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">1.1 Information You Provide</h3>
        <p>We may collect information that you provide directly to us when you:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Use our calculators and input data</li>
          <li>Subscribe to our newsletter</li>
          <li>Request a calculator</li>
          <li>Contact us</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">1.2 Automatically Collected Information</h3>
        <p>When you visit our website, we automatically collect certain information about your device, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Time and date of your visit</li>
          <li>Pages you view</li>
          <li>Time spent on pages</li>
          <li>Referring website</li>
        </ul>
        <p>
          We collect this information using cookies and similar technologies. See our Cookie Policy section below for
          more details.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide, maintain, and improve our calculators and services</li>
          <li>Develop new calculators and features</li>
          <li>Understand how users interact with our website</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Send you technical notices, updates, and administrative messages</li>
          <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cookie Policy</h2>
        <p>Cookies are small text files that are placed on your device when you visit a website. We use cookies to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Remember your preferences and settings</li>
          <li>Understand how you interact with our website</li>
          <li>Analyze and improve our service</li>
          <li>Deliver relevant advertising</li>
        </ul>
        <p>
          You can control cookies through your browser settings. However, if you block certain cookies, you may not be
          able to use all the features of our website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data against
          unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </p>
        <p>
          However, please note that no method of transmission over the Internet or method of electronic storage is 100%
          secure. While we strive to use commercially acceptable means to protect your personal data, we cannot
          guarantee its absolute security.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Third-Party Services</h2>
        <p>
          Our website may contain links to third-party websites or services that are not owned or controlled by Free
          Calculators. We have no control over, and assume no responsibility for, the content, privacy policies, or
          practices of any third-party websites or services.
        </p>
        <p>
          We may use third-party services such as Google Analytics to help us understand how our users interact with the
          website. These services may collect information about your use of our website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Children's Privacy</h2>
        <p>
          Our Service is not directed to children under the age of 13. We do not knowingly collect personally
          identifiable information from children under 13. If you are a parent or guardian and you are aware that your
          child has provided us with personal data, please contact us.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last updated" date at the top of this page.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are
          effective when they are posted on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>The right to access, update, or delete your personal data</li>
          <li>The right to rectification if your information is inaccurate or incomplete</li>
          <li>The right to object to our processing of your personal data</li>
          <li>The right to request restriction of processing your personal data</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p className="mb-12">
          <Link href="/contact" className="text-primary hover:underline">
            Drop us a Line
          </Link>
        </p>
      </div>
    </div>
  )
}

