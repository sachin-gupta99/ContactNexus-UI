import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "26 November 2026";
const REPO_URL = "https://github.com/sachin-gupta99";

const LegalPage = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} - Contact Nexus`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-700 leading-relaxed">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {LAST_UPDATED}</p>
        <div className="space-y-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          {children}
        </div>
      </article>
    </div>
  );
};

export const Privacy = () => (
  <LegalPage title="Privacy Policy">
    <p>
      Contact Nexus is a personal project. This page explains what it stores
      and why, in plain language.
    </p>

    <section>
      <h2>What we store</h2>
      <ul>
        <li>Your account: name, email address and a one-way hash of your password (never the password itself).</li>
        <li>Profile details you choose to fill in, and your profile photo if you upload one.</li>
        <li>The contacts you add and whether you have starred them.</li>
        <li>
          For each signed-in session: a hashed session token, your browser’s user agent and IP address,
          so sessions can be revoked and suspicious reuse detected.
        </li>
      </ul>
    </section>

    <section>
      <h2>Where it lives</h2>
      <ul>
        <li>Data is stored in a PostgreSQL database hosted by Neon.</li>
        <li>Profile photos are kept in a private Amazon S3 bucket and only shown through short-lived signed links.</li>
        <li>The app runs on Render (server) and Vercel (website).</li>
        <li>Password-reset and password-changed emails are sent through Brevo.</li>
      </ul>
    </section>

    <section>
      <h2>Cookies and tracking</h2>
      <p>
        One cookie is used: an HttpOnly session cookie that keeps you signed in for up to 7 days.
        There is no analytics, advertising or third-party tracking.
      </p>
    </section>

    <section>
      <h2>Sharing</h2>
      <p>
        Your data is never sold or shared. A contact only leaves the app when you share or export it yourself.
      </p>
    </section>

    <section>
      <h2>Your choices</h2>
      <ul>
        <li>Edit your details any time from your profile.</li>
        <li>Export all your contacts as a .vcf file from the Contacts page.</li>
        <li>
          Delete your account from <Link to="/settings" className="text-blue-600 hover:underline">Settings</Link>.
          This immediately removes your account, every contact and your photo.
        </li>
      </ul>
    </section>

    <section>
      <h2>Questions</h2>
      <p>
        Open an issue on{" "}
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>.
      </p>
    </section>
  </LegalPage>
);

export const Terms = () => (
  <LegalPage title="Terms of Service">
    <p>By creating an account you agree to these terms.</p>

    <section>
      <h2>The service</h2>
      <p>
        Contact Nexus is a free personal project, provided “as is” without any warranty. It may change,
        be unavailable at times, or be shut down. Keep your own copy of anything important; the
        Export .vcf button on the Contacts page makes that easy.
      </p>
    </section>

    <section>
      <h2>Your account</h2>
      <ul>
        <li>Keep your password private. You’re responsible for activity on your account.</li>
        <li>Only store contact details you have a right to keep.</li>
        <li>Don’t use the service to send spam, harass anyone, or attempt to break or overload it.</li>
      </ul>
    </section>

    <section>
      <h2>Ending things</h2>
      <p>
        You can delete your account at any time from Settings. Accounts that break these terms may be removed.
      </p>
    </section>

    <section>
      <h2>Liability</h2>
      <p>
        To the extent the law allows, the maintainer isn’t liable for any loss arising from use of the service.
      </p>
    </section>

    <p>
      See also the <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
    </p>
  </LegalPage>
);
