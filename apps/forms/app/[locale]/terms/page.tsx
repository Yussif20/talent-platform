import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: September 25, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              By accessing and using the TalentBridge web application, you
              accept and agree to be bound by the terms and provision of this
              agreement. These terms apply to all users of the service,
              including teachers, parents, and educational professionals.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Purpose and Scope
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              TalentBridge is designed specifically for:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>
                Educational screening of twice-exceptional characteristics
              </li>
              <li>
                Supporting teachers and parents in identifying student needs
              </li>
              <li>Providing preliminary behavioral assessment data</li>
              <li>
                Generating individualized educational planning suggestions
              </li>
            </ul>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Important Limitations
              </h4>
              <ul className="list-disc list-inside text-red-700 dark:text-red-300 space-y-1 text-sm">
                <li>
                  This tool does NOT provide medical or psychological diagnoses
                </li>
                <li>Results should not replace professional evaluation</li>
                <li>Not intended for clinical or therapeutic use</li>
                <li>
                  Should be used in conjunction with professional guidance
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              User Responsibilities
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              By using TalentBridge, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>
                Provide accurate and honest responses to assessment questions
              </li>
              <li>Use the tool only for its intended educational purpose</li>
              <li>
                Respect the privacy and confidentiality of student information
              </li>
              <li>
                Not share login credentials or assessment results
                inappropriately
              </li>
              <li>Seek professional guidance when indicated by results</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Intellectual Property
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The TalentBridge application, including its assessment tools,
              algorithms, content, and design, is protected by copyright and
              other intellectual property laws. Users may use the service for
              its intended purpose but may not reproduce, distribute, or create
              derivative works without permission.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Privacy and Data Protection
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
              <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-2">
                <li>
                  All assessment data is processed locally in your browser
                </li>
                <li>No personal information is stored on our servers</li>
                <li>Email delivery uses secure third-party services</li>
                <li>Users maintain full control over their data</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Limitation of Liability
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              TalentBridge and its creators shall not be liable for any direct,
              indirect, incidental, special, or consequential damages resulting
              from the use or inability to use the service. This includes but is
              not limited to damages from educational decisions based solely on
              assessment results without professional consultation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Service Availability
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>
                We strive to maintain high availability but cannot guarantee
                uninterrupted service
              </li>
              <li>Maintenance periods may temporarily affect accessibility</li>
              <li>
                We reserve the right to modify or discontinue features with
                notice
              </li>
              <li>
                No warranty is provided regarding service performance or results
                accuracy
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Professional Consultation
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Strongly Recommended:</strong> Assessment results should
                be reviewed with qualified educational professionals, special
                education specialists, or licensed psychologists for proper
                interpretation and educational planning.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Modifications to Terms
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We reserve the right to modify these terms and conditions at any
              time. Changes will be effective immediately upon posting on this
              page. Continued use of TalentBridge following any changes
              constitutes acceptance of the new terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              For questions about these Terms & Conditions, please contact:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                Email:{" "}
                <a
                  href="mailto:support@talentbridge.edu"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  support@talentbridge.edu
                </a>
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Governing Law
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              These terms and conditions are governed by applicable educational
              privacy laws and regulations. Any disputes will be resolved
              through appropriate legal channels in the jurisdiction where the
              service is provided.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <Link
            href="/en"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
