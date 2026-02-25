import { Button } from "./ui/Button";
import { Card } from "./ui/cards";
import { Badge } from "./ui/badge";
import {
  Award,
  BookOpen,
  Trophy,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Star,
  Play,
  BarChart3,
  FileText,
  Clock,
  Brain,
  Sparkles,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../common/helper/AuthContext";
import PaymentGateway from "./PaymentGateway";
import AuthSelectionModal from "./AuthSelectionModal";

// Removed: interface HomeProps { ... }

export default function Home() {
  const { openLoginModal, openRegisterModal, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState(null);
  const [pendingPaymentPlan, setPendingPaymentPlan] = useState(null);
  const [showAuthSelectionModal, setShowAuthSelectionModal] = useState(false);

  useEffect(() => {
    if (user && pendingPaymentPlan) {
      setSelectedPaymentPlan(pendingPaymentPlan);
      setShowPaymentModal(true);
      setPendingPaymentPlan(null);
    }
  }, [user, pendingPaymentPlan]);

  const subjects = [
    {
      name: "IMO",
      fullName: "International Mathematics Olympiad",
      icon: "🔢",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "NSO",
      fullName: "National Science Olympiad",
      icon: "🔬",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "IEO",
      fullName: "International English Olympiad",
      icon: "📚",
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "NCO",
      fullName: "National Cyber Olympiad",
      icon: "💻",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  const stats = [
    { value: "50,000+", label: "Active Students", icon: Users },
    { value: "2M+", label: "Questions Solved", icon: FileText },
    { value: "95%", label: "Success Rate", icon: Trophy },
    { value: "4.9/5", label: "Parent Rating", icon: Star },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Smart algorithms analyze performance and create personalized study plans for each student.",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Content Library",
      description:
        "Access thousands of practice questions, video lessons, and study materials for all Olympiad exams.",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      icon: BarChart3,
      title: "Detailed Performance Analytics",
      description:
        "Track progress with interactive dashboards, detailed reports, and improvement insights.",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      icon: Target,
      title: "Adaptive Practice Tests",
      description:
        "Dynamic difficulty adjustment ensures students are always challenged at the right level.",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
    {
      icon: Clock,
      title: "Flexible Learning Schedule",
      description:
        "Study anytime, anywhere with our mobile-friendly platform and offline access.",
      color: "bg-pink-50 border-pink-200",
      iconColor: "text-pink-600",
    },
    {
      icon: Award,
      title: "Expert-Curated Content",
      description:
        "All materials reviewed and created by experienced Olympiad trainers and educators.",
      color: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-600",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Parent of IMO Gold Medalist",
      content:
        "The personalized approach helped my daughter improve from 60% to 95% in just 3 months. The analytics feature is incredible!",
      rating: 5,
      avatar: "👩",
    },
    {
      name: "Rajesh Kumar",
      role: "Parent of 2 Students",
      content:
        "Managing both my kids' preparation from one dashboard is so convenient. The AI recommendations are spot-on.",
      rating: 5,
      avatar: "👨",
    },
    {
      name: "Anita Patel",
      role: "Parent",
      content:
        "Best investment for my son's education. The practice tests mirror the actual Olympiad format perfectly.",
      rating: 5,
      avatar: "👩",
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "100 practice questions/month",
        "Basic performance tracking",
        "1 child account",
        "Community support",
      ],
      buttonText: "Start Free",
      popular: false,
    },
    {
      name: "Premium",
      price: "₹999/month",
      description: "Most popular choice",
      features: [
        "Unlimited practice questions",
        "AI-powered recommendations",
        "Up to 3 child accounts",
        "Detailed analytics & reports",
        "Video lessons & tutorials",
        "Priority support",
      ],
      buttonText: "Get Premium",
      popular: true,
    },
    {
      name: "Family",
      price: "₹1,499/month",
      description: "Best value for families",
      features: [
        "Everything in Premium",
        "Unlimited child accounts",
        "Custom test generation",
        "Parent-teacher consultation",
        "Offline access",
        "24/7 dedicated support",
      ],
      buttonText: "Go Family",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 px-4 py-2 rounded-full mb-6 border border-blue-200">
              <Sparkles className="size-4" />
              <span className="text-sm">
                Trusted by 50,000+ Students Nationwide
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 text-blue-900 leading-tight font-bold">
              Ace Your Olympiad Exams with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                AI-Powered
              </span>{" "}
              Learning
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comprehensive preparation platform for IMO, NSO, IEO & NCO. Get
              personalized study plans, adaptive practice tests, and detailed
              analytics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                onClick={openRegisterModal}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button
                onClick={openLoginModal}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-gray-300 w-full sm:w-auto"
              >
                <Play className="mr-2 size-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                <span>Money-back Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="size-8 mx-auto mb-3 opacity-90" />
                <div className="text-3xl md:text-4xl mb-2 font-bold">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-blue-900 font-bold">
              Olympiad Exams We Cover
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive preparation materials for all major Science Olympiad
              Foundation exams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {subjects.map((subject, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
              >
                <div className="text-5xl mb-4">{subject.icon}</div>
                <Badge className={`${subject.color} mb-3`}>
                  {subject.name}
                </Badge>
                <p className="text-sm text-gray-600 font-medium">
                  {subject.fullName}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-blue-900 font-bold">
              Why Parents & Students Love Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to excel in Olympiad exams, all in one
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`p-8 ${feature.color} border-2 hover:shadow-lg transition-shadow`}
              >
                <div
                  className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 border shadow-sm`}
                >
                  <feature.icon className={`size-7 ${feature.iconColor}`} />
                </div>
                <h4 className="text-blue-900 mb-3 font-bold">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-blue-900 font-bold">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="text-blue-900 mb-2 font-bold">
                Sign Up & Create Profile
              </h4>
              <p className="text-gray-600">
                Register as a parent and add your children's accounts with their
                grade levels
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="text-blue-900 mb-2 font-bold">
                Take Diagnostic Test
              </h4>
              <p className="text-gray-600">
                AI analyzes performance and creates personalized study plans for
                each subject
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="text-blue-900 mb-2 font-bold">Practice & Excel</h4>
              <p className="text-gray-600">
                Follow adaptive learning paths, track progress, and ace your
                Olympiad exams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-blue-900 font-bold">
              What Parents Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied parents and successful students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 border-2 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-blue-900 font-bold">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-blue-900 font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your family
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                onClick={() => setSelectedPlanIndex(index)}
                className={`p-8 relative cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${selectedPlanIndex === index ? "border-4 border-blue-600 shadow-xl" : "border-2 hover:border-blue-300"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <h3 className="text-2xl text-blue-900 mb-2 font-bold">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl text-blue-900 font-bold">
                    {plan.price}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={(e) => {
                    e?.stopPropagation();
                    if (!user) {
                      if (plan.price !== "Free") {
                        setPendingPaymentPlan(plan);
                        setShowAuthSelectionModal(true);
                      } else {
                        openRegisterModal();
                      }
                    } else {
                      if (plan.price === "Free") {
                        openRegisterModal();
                      } else {
                        setSelectedPaymentPlan(plan);
                        setShowPaymentModal(true);
                      }
                    }
                  }}
                  className={`w-full ${selectedPlanIndex === index ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"}`}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl mb-6 font-bold">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join 50,000+ students who are already excelling in their Olympiad
            preparation
          </p>
          <Button
            onClick={openRegisterModal}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6"
          >
            Get Started Free
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Trophy className="size-6 text-white" />
                </div>
                <span className="text-white font-bold">
                  SOF Prep Excellence
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Empowering students to excel in Science Olympiad Foundation
                exams
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white mb-4 font-bold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#subjects"
                    className="hover:text-white transition-colors"
                  >
                    Subjects
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Reviews
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white mb-4 font-bold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white mb-4 font-bold">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@sofprep.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Mon-Sat: 9 AM - 6 PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm opacity-60">
            <p>© 2026 SOF Prep Excellence. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showPaymentModal && selectedPaymentPlan && (
        <PaymentGateway
          plan={selectedPaymentPlan}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={() => {
            alert("Payment Successful!");
            setShowPaymentModal(false);
          }}
        />
      )}

      {showAuthSelectionModal && (
        <AuthSelectionModal
          onClose={() => {
            setShowAuthSelectionModal(false);
            setPendingPaymentPlan(null);
          }}
          onLogin={() => {
            setShowAuthSelectionModal(false);
            openLoginModal();
          }}
          onRegister={() => {
            setShowAuthSelectionModal(false);
            openRegisterModal();
          }}
        />
      )}
    </div>
  );
}
