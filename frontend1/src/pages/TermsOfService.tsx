import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-light/10 to-secondary/20 pt-20 lg:pt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 animate-fade-in-up">
          <Link to="/terms">
            <Button variant="outline" className="mb-6 hover-lift">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Terms
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gradient mb-2">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-creative p-8 lg:p-12 border border-accent/10">
          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">🌐 Website:</span> 
                  <span className="text-blue-600 font-medium">https://www.wocherbal.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">🏢 Owner:</span> 
                  <span className="text-blue-600 font-medium">Jaiswal Innovations ("we", "us", "our")</span>
                </p>
              </div>
              <p className="text-foreground leading-relaxed">
                Before using our website, please read these Terms and Conditions ("Terms", "Terms of Service") carefully. When you access or use any part of our site, you agree to follow these Terms and all the other rules mentioned in them.
              </p>
            </div>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-6">1. General Conditions</h2>
              <div className="space-y-4">
                {[
                  'You must be at least the legal age to use this website. If you are not, you must have permission from a parent or guardian.',
                  'We have the right to say no to anyone, at any time, for any reason.',
                  'These Terms shall also be applicable to any new features or tools that are added to the current store.'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-6">12. Prohibited Uses</h2>
              <p className="mb-4 text-muted-foreground">You are prohibited from using the website or its content, and any further violations will result in legal action:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'For unlawful objectives.',
                  'To violate any laws or regulations.',
                  'To infringe upon intellectual property rights.',
                  'To submit false information.',
                  'To upload viruses or malware.',
                  'To spam, phish, or scrape the site.',
                  'To disrupt security functions or the standard functionality of the website'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-red-500 font-bold">⚠️</span>
                    <span className="text-sm text-red-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive font-medium">Termination of service may be the result of a violation.</p>
              </div>
            </section>

            <section className="card-creative rounded-xl p-6 border border-accent/20">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gradient mb-4">20. Contact Information</h2>
              <div className="bg-gradient-to-br from-accent-light to-secondary p-6 rounded-xl border border-accent/30">
                <p className="text-foreground text-center">
                  If you have any questions or concerns about these terms and conditions, please Contact us on our email Id care@wocherbal.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;