import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "ORD" + Date.now();

  console.log("location.state?.orderId", location.state);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />

          <h1 className="text-3xl font-playfair font-bold text-foreground mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-muted-foreground mb-8">
            Thank you for your order. We've received your order and will process
            it shortly.
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Order ID:</span>
                  <span className="text-primary font-mono">{orderId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <span className="text-green-600">Confirmed</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Estimated Delivery:</span>
                  <span>3-5 Business Days</span>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    You will receive an email confirmation and tracking
                    information shortly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
