import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 mt-12">
      <div className="container mx-auto px-6 ">
        <div className="mb-8">
          <Link to="/terms">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Terms
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">Refund Policy</h1>
          <p className="text-muted-foreground">Last updated: 2024</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <p>
            At Wocherbal.com, we promise to deliver high-quality Ayurvedic products with care and honesty. The following policy should be reviewed to understand how returns, refunds, cancellations, and product issues are handled.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Return Policy</h2>
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <p className="font-semibold text-destructive">We have a no-return policy.</p>
            </div>
            <p className="mt-4">
              Due to the nature of our Ayurvedic and personal care products, which are non-reusable and hygiene-sensitive, products cannot be returned once they have been delivered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellation Policy</h2>
            <p>Your order may only be cancelled before it has been processed for dispatch. To request a cancellation, please contact our customer support team.</p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Contact us as soon as possible at:</strong> 📧 care@wocherbal.com</p>
            </div>
            <p className="mt-4 text-destructive font-medium">
              You cannot cancel an order if it has already been dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Products that are damaged, defective or the wrong ones</h2>
            <p>
              We take the utmost care in packaging and shipping. If you receive an order that is Damaged, Leaked, Broken, Incorrect, incomplete or defective.
            </p>
            <p>
              <strong>Please contact us within 24 hours of delivery</strong> at care@wocherbal.com with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your Order ID.</li>
              <li>A clear video of the product at the time of unboxing when received.</li>
              <li>A brief description of the issue.</li>
            </ul>
            <p className="mt-4">
              A review of the case will be conducted, and, depending on eligibility, a replacement or refund will be arranged at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refunds (If Applicable)</h2>
            <p>Refunds are only issued in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>If the product is received damaged or defective</li>
              <li>If the wrong item is delivered</li>
              <li>If the order is cancelled before dispatch</li>
            </ul>
            <p className="mt-4">
              Once approval is granted, the processing of refunds will be completed through our convenience (UPI/bank transfer), with a typical turnaround time of 7–15 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact us</h2>
            <p>If you have any questions about cancellations, damages, or other order-related concerns, please contact us.</p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Email:</strong> care@wocherbal.com</p>
              <p><strong>Phone/WhatsApp:</strong> 08878875006</p>
              <p><strong>Support hours:</strong> Monday to Saturday, 11 a.m. to 5 p.m.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Jaiswal Innovations</strong></p>
              <p><strong>Address:</strong> 33A, Jaiswal Innovation, Mpidc Industrial Area Badiyakhedi, Sehore, MP, Pin Code- 466001.</p>
              <p><strong>Customer Care:</strong> 08878875006</p>
              <p><strong>Email:</strong> care@wocherbal.com</p>
              <p><strong>Website:</strong> Wocherbal.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">DISCLAIMER</h2>
            <div className="bg-accent-light p-4 rounded-lg text-sm space-y-2">
              <p>The product contains natural ingredients & may change color and smell without losing its effectiveness.</p>
              <p>Even natural ingredients can cause allergies. A patch test is recommended before use.</p>
              <p>If you have a rash or allergic reaction, please consult a healthcare professional.</p>
              <p>All images/videos shown are intended to illustrate only and actual results may vary.</p>
              <p>This product is for external use only.</p>
              <p>Store in a cool & dry place.</p>
            </div>
          </section>

          <div className="text-center mt-8 p-6 bg-accent-light rounded-lg">
            <p className="text-lg font-medium">
              Your trust means everything to us, and we are committed to working with you to ensure it is always protected. We are always here to help. Our goal is to ensure you have a positive experience with Jaiswal Innovation's products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;