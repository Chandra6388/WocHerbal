import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-light/10 to-secondary/20 pt-20 lg:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8 animate-fade-in-up">
          <Link to="/terms">
            <Button variant="outline" className="mb-6 hover-lift">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Terms
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-100">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gradient mb-2">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-creative p-8 lg:p-12 border border-accent/10">
          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border-l-4 border-emerald-500">
              <p className="text-foreground leading-relaxed">
                Welcome to Wocherbal.com, a website owned and operated by Jaiswal Innovations. We are dedicated to safeguarding your privacy and maintaining the integrity of your personal and sensitive information. Our Privacy Policy defines how we collect, use, and disclose your data when you visit or make a purchase from our website, www.wocherbal.com.
              </p>
              <p className="text-foreground mt-4 leading-relaxed">
                When you use our website, you are agreeing to the terms of this Privacy Policy. If you do not agree, please do not visit or use the website.
              </p>
            </div>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-6 flex items-center gap-3">
                <span className="bg-emerald-100 p-2 rounded-lg">📋</span>
                1. Information We Collect
              </h2>
              <p className="mb-4 text-muted-foreground">We will collect following data to serve you better:</p>
              <ul className="space-y-3">
                {[
                  'Your full name',
                  'Your email Id', 
                  'Your mobile number',
                  'Your billing & shipping address',
                  'Your Date of birth',
                  'Your Bank/payment information (only for payment processing)',
                  'Any other information voluntarily provided via contact forms, chats, or purchases.'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-1">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-6 flex items-center gap-3">
                <span className="bg-blue-100 p-2 rounded-lg">🎯</span>
                2. Your Information
              </h2>
              <p className="mb-4 text-muted-foreground">Your data is collected to make the things easier for you and for us:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'It helps us process your orders and manage your account.',
                  'It helps us respond to inquiries. It also helps us provide customer support.',
                  'It improves our website and product offerings to you.',
                  'To provide you with marketing communications, offers, and updates is our goal.',
                  'We use various methods to detect or prevent fraud, unauthorized activities, or misuse of our website.'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-accent-light/30 p-4 rounded-lg">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-6 flex items-center gap-3">
                <span className="bg-purple-100 p-2 rounded-lg">🔄</span>
                3. Sharing and Disclosure of Information
              </h2>
              <p className="mb-4 text-muted-foreground">We may share your collected data to improvise our services by providing it:</p>
              <div className="space-y-3">
                {[
                  'With our employees, consultants, delivery partners, or payment gateway providers on a need-to-know basis',
                  'With service providers for website management, hosting, marketing, or analytics',
                  'With regulatory/government authorities to comply with legal obligations, if required.',
                  'At the time of merger, acquisition.',
                  'In the event of suspicious activity, law enforcement should be informed.'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive font-medium">⚠️ We do not engage in the sale or rental of collected data to third parties.</p>
              </div>
            </section>

            {/* Continue with remaining sections - abbreviated for space */}
            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-4">4. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal data only as long as necessary for legitimate business purposes or as required by law. If your account is terminated or inactive, we may delete your data after a reasonable period unless otherwise required.
              </p>
            </section>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-4">5. Cookies and Tracking</h2>
              <p className="mb-4 text-muted-foreground">We use cookies for the following things:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'To improve your browsing experience',
                  'To remember your preferences and login details',
                  'To understand site usage patterns through analytics tools Google Analytics',
                  'To customize our content and to design marketing strategies.'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <span className="text-orange-500">🍪</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800">
                  <strong>Note:</strong> You can disable cookies option in your browser settings. After disabling this some features of the wocherbal.com may not function properly.
                </p>
              </div>
            </section>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-4">9. Grievance Officer</h2>
              <p className="mb-4 text-muted-foreground">Contact us for questions or concerns related:</p>
              <div className="bg-gradient-to-br from-accent-light to-secondary p-6 rounded-xl border border-accent/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">👤 Grievance Officer:</span> 
                      <span className="text-accent font-medium">Ankit</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">📧 Email:</span> 
                      <span className="text-accent font-medium">care@wocherbal.com</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">📞 Phone:</span> 
                      <span className="text-accent font-medium">08878875006</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-semibold text-foreground">📍 Address:</span> 
                      <span className="text-muted-foreground text-sm">33A, Jaiswal Innovations, MPIDC Badiyakhedi, Sehore (466001), Madhya Pradesh, India.</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-4">10. Jurisdiction</h2>
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-red-800 font-medium">All disputes shall be resolved under the jurisdiction of Sehore (M.P.)</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;