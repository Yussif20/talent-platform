import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: September 25, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Collection and Processing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              TalentBridge is designed with privacy at its core. All assessment
              data is processed entirely on your device (client-side) and is
              never stored on our servers.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Information We Collect
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>Student name and ID (for form completion and results)</li>
              <li>Email address (for sending results)</li>
              <li>Assessment responses (processed locally on your device)</li>
              <li>No personal data is stored on our servers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How We Use Your Information
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>Generate assessment results and individualized plans</li>
              <li>Create PDF reports for educational purposes</li>
              <li>Send results via email using Email.js service</li>
              <li>All processing happens locally in your browser</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Data Security
            </h3>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
              <ul className="list-disc list-inside text-green-800 dark:text-green-200 space-y-2">
                <li>No backend storage - all data processed in your browser</li>
                <li>Email delivery through secure Email.js API</li>
                <li>No tracking or analytics on assessment data</li>
                <li>Results are temporary and not permanently stored</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Third-Party Services
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>
                <strong>Email.js:</strong> For sending assessment results via
                email
              </li>
              <li>
                <strong>Vercel:</strong> For hosting the web application
              </li>
              <li>No other third-party tracking or analytics services</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Educational Purpose Disclaimer
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> TalentBridge is designed for
                educational screening purposes only. The assessment results do
                not constitute a medical or psychological diagnosis and should
                not be used as a substitute for professional evaluation by
                qualified specialists.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Your Rights
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>
                Since no data is stored, there is no personal data to delete or
                modify
              </li>
              <li>
                You can choose not to provide an email address (results will
                only display on screen)
              </li>
              <li>
                You maintain full control over assessment responses and results
              </li>
              <li>
                You can discontinue use at any time without data retention
                concerns
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have questions about this Privacy Policy or the
              TalentBridge application, please contact us at:
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
              Changes to This Policy
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date. We
              encourage you to review this policy periodically.
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
