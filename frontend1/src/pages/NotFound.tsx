
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="text-8xl font-bold text-accent mb-4">404</div>
            <h1 className="text-2xl font-playfair font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div className="space-y-4">
              <Link to="/">
                <Button size="lg" className="w-full">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
