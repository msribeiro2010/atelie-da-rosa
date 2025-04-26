import { useQuery } from "@tanstack/react-query";
import { Star, StarHalf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  id: number;
  text: string;
  rating: number;
  user: {
    firstName: string;
    lastName: string;
    createdAt: string;
  };
};

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-rose-500 text-rose-500" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-rose-500 text-rose-500" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-rose-500" />);
    }

    return stars;
  };

  // Format date as "desde YYYY"
  const formatDate = (dateString: string) => {
    const year = new Date(dateString).getFullYear();
    return `Cliente desde ${year}`;
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 font-playfair sm:text-4xl">
            O que nossos clientes dizem
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Depoimentos de quem já experimentou nossos produtos e serviços.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {testimonials.map((testimonial: Testimonial) => (
              <Card key={testimonial.id} className="flex flex-col overflow-hidden">
                <CardContent className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="flex text-rose-500">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm italic">"{testimonial.text}"</p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{testimonial.user.firstName} {testimonial.user.lastName}</span>
                      <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                        {testimonial.user.firstName.charAt(0)}{testimonial.user.lastName.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {testimonial.user.firstName} {testimonial.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(testimonial.user.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center py-8">
            <p className="text-gray-500">Ainda não temos depoimentos de clientes.</p>
          </div>
        )}
      </div>
    </section>
  );
}
