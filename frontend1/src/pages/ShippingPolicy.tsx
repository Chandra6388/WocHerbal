import { ArrowLeft, Truck, Clock, CreditCard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/terms">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Terms
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">Shipping Policy</h1>
          <p className="text-muted-foreground">Last updated: 2024</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <p>
            Thanks so much for shopping with WOC Herbal, a brand of Jaiswal Innovations. Our commitment: to provide you with a shopping experience that is smooth, safe, and enjoyable. It is very important that you read our Shopping Policy carefully before you send us your order.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-accent" />
              1. Order Processing
            </h2>
            <p>
              All orders are processed within 1-5 business days excluding sundays and public holidays after payment is confirmed. You will receive an order confirmation after successfully order placed. Once your order ships, you will receive a shipping confirmation with tracking details of your shipment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
              <Truck className="w-6 h-6 mr-2 text-accent" />
              2. Shipping & Delivery
            </h2>
            <p>
              We use well-known courier services to deliver our products throughout India. Delivery generally takes between 4-7 business days. The exact timeframe depends on the recipient's location and the weather conditions.
            </p>
            <p>
              Shipping charges are waived or calculated at the point of purchase. Delays may occur during periods of high demand, such as any special offer, peak seasons or festivals, or in the event of unexpected logistical challenges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cancellation Policy</h2>
            <p>
              You may only cancel orders before we process them for dispatch. To cancel an order, email us immediately. Send the email to care@wocherbal.com. Be sure to include your order number with all your contact details.
            </p>
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <p className="font-semibold text-destructive">
                Once the product is shipped, canceling or modifying an order is not possible from our side.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Return & Refund Policy</h2>
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mb-4">
              <p className="font-semibold text-destructive">
                Once the product has been delivered, it cannot be returned under any circumstances.
              </p>
            </div>
            <p>
              If you receive a damaged, defective, or incorrect product, please email us at care@wocherbal.com immediately within 24 hours with videos of the first unboxing. We will review refund requests and approve or reject them after verifying the issue. Authorized reimbursements will be issued via our preferred payment method within 7–10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-accent" />
              5. Payment Methods
            </h2>
            <p>We accept secure online payments through following mediums:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Credit Cards / Debit Cards</li>
              <li>UPI</li>
              <li>Net Banking</li>
              <li>Cash on Delivery (if enabled)</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-accent" />
                <strong>Note:</strong> All transactions are encrypted and processed securely via our payment partners our banking partner is Canara Bank.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Pricing & Taxes</h2>
            <p>
              All product prices are listed in Indian rupees (INR). INR stands for Indian rupee. The currency symbol for INR is ₹. Prices are either exclusive or inclusive of GST, as mentioned. We reserve the right to change product pricing. Prior notice is not required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Product Availability</h2>
            <p>
              All listed products are subject to availability. Please confirm the availability of the product you are interested in before making your purchase. If an item becomes unavailable after you place your order, we will contact you to offer a refund or replacement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Customer Support</h2>
            <p>For any order-related questions or assistance, please contact us at:</p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Email:</strong> care@wocherbal.com</p>
              <p><strong>📞 Phone:</strong> 08878875006</p>
              <p><strong>Support hours:</strong> 11:00 a.m. – 6:00 p.m. (Mon–Sat)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;