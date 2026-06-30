import type {
  AppSettings,
  Service,
  IndustryItem,
  WhyChooseItem,
  ProcessStep,
  CmsPage,
} from "./types";

export const FALLBACK_SETTINGS: AppSettings = {
  siteName: "QuickFleet Workforce Solutions",
  tagline: "Reliable Workforce & Technical Solutions for Growing Businesses",
  contactEmail: "info@quickfleet.in",
  contactPhone: "+91 98765 43210",
  contactPhoneSecondary: "+91 80-1234 5678",
  address:
    "2nd Floor, Corporate Tower, MG Road, Bengaluru, Karnataka 560001, India",
};

export const FALLBACK_SERVICES: Service[] = [
  {
    id: "1",
    slug: "delivery-rider-recruitment",
    title: "Delivery Rider Recruitment",
    summary:
      "End-to-end rider recruitment, verification, onboarding, and deployment for e-commerce, food delivery, and logistics operations.",
    description:
      "We provide verified, trained, and reliable delivery riders to businesses across India. Our comprehensive service includes rider sourcing, document verification, background checks, driving tests, safety training, deployment support, and replacement guarantee. Serving 100+ clients with 5000+ active riders across multiple cities.",
    features:
      "Rider Sourcing & Screening;Document Verification (DL/Aadhaar/PAN);Background Checks & Police Verification;Driving Skills Assessment;Safety & Customer Service Training;Rapid Deployment (18-20 days);24-48 Hour Replacement;Multiple Hiring Models (Permanent/Contract/Temporary/Bulk);Payroll & Compliance Management;Performance Monitoring",
    status: "PUBLISHED",
    featured: true,
  },
  {
    id: "2",
    slug: "workforce-solutions",
    title: "Workforce Solutions",
    summary:
      "End-to-end staffing, contract, and permanent workforce deployment across India.",
    description:
      "We provide skilled and semi-skilled manpower for diverse industries including logistics, warehousing, and manufacturing. Our workforce solutions are customized to meet your specific business needs with rapid deployment timelines.",
    features:
      "Contract Staffing;Permanent Placement;Payroll Management;Compliance & ESI/PF;Background Verification",
    status: "PUBLISHED",
    featured: true,
  },
  {
    id: "3",
    slug: "it-infrastructure-support",
    title: "IT Infrastructure Support",
    summary:
      "Comprehensive IT setup, networking, server management, and helpdesk support.",
    description:
      "Our IT infrastructure team delivers complete technology solutions from hardware procurement to network setup, server configuration, and round-the-clock helpdesk support for businesses of all sizes.",
    features:
      "Network Setup & Management;Server Administration;Hardware Procurement;IT Helpdesk;Cybersecurity Solutions",
    status: "PUBLISHED",
    featured: false,
  },
  {
    id: "4",
    slug: "cctv-security-solutions",
    title: "CCTV & Security Solutions",
    summary:
      "Professional CCTV installation, access control systems, and security management.",
    description:
      "We design and install comprehensive CCTV and security systems tailored to your premises. From IP cameras to biometric access control, our security solutions ensure complete protection.",
    features:
      "IP CCTV Installation;Biometric Access Control;Security Guards;Video Analytics;Remote Monitoring",
    status: "PUBLISHED",
    featured: false,
  },
];

export const FALLBACK_INDUSTRIES: IndustryItem[] = [
  { id: "1", name: "E-commerce", icon: "shopping-cart", description: "Product delivery and returns management" },
  { id: "2", name: "Food Delivery", icon: "utensils", description: "Restaurant partnerships and cloud kitchens" },
  { id: "3", name: "Logistics", icon: "truck", description: "Delivery and supply chain staffing" },
  { id: "4", name: "Warehousing", icon: "package", description: "End-to-end warehouse operations workforce" },
  { id: "5", name: "Manufacturing", icon: "settings", description: "Skilled workers for production facilities" },
  { id: "6", name: "Healthcare", icon: "activity", description: "Medical support and pharmacy delivery" },
  { id: "7", name: "Retail", icon: "shopping-bag", description: "Retail floor and management staff" },
  { id: "8", name: "Corporate", icon: "briefcase", description: "Office and IT professionals" },
  { id: "9", name: "Quick Commerce", icon: "zap", description: "Instant delivery and hyperlocal services" },
  { id: "10", name: "Courier Services", icon: "mail", description: "Document and parcel delivery" },
];

export const FALLBACK_WHY_CHOOSE: WhyChooseItem[] = [
  { id: "1", title: "5000+ Active Riders", icon: "users", description: "Largest verified rider network across India", order: 1 },
  { id: "2", title: "Quick Deployment", icon: "zap", description: "Rider deployment within 18-20 days, emergency in 48 hours", order: 2 },
  { id: "3", title: "100% Verified", icon: "shield-check", description: "Complete document & background verification guaranteed", order: 3 },
  { id: "4", title: "PAN India Service", icon: "map-pin", description: "Presence in 50+ cities across India", order: 4 },
  { id: "5", title: "Replacement Guarantee", icon: "refresh-cw", description: "24-48 hour replacement for any rider", order: 5 },
  { id: "6", title: "24/7 Support", icon: "headphones", description: "Round-the-clock client support team", order: 6 },
  { id: "7", title: "Compliance Ready", icon: "file-check", description: "Full statutory compliance: ESI, PF, Labour laws", order: 7 },
  { id: "8", title: "Flexible Hiring", icon: "sliders", description: "Permanent, Contract, Temporary & Bulk hiring models", order: 8 },
];

export const FALLBACK_PROCESS: ProcessStep[] = [
  { id: "1", step: 1, title: "Submit Inquiry", description: "Fill out our contact form with your workforce requirements" },
  { id: "2", step: 2, title: "Requirement Analysis", description: "Our team analyses your needs and prepares a tailored proposal" },
  { id: "3", step: 3, title: "Workforce Deployment", description: "Rapid deployment of vetted, trained professionals" },
  { id: "4", step: 4, title: "Ongoing Support", description: "Continuous performance monitoring and client support" },
];

export const FALLBACK_STATS = [
  { value: "5,000+", label: "Active Riders" },
  { value: "12,000+", label: "Workforce Deployed" },
  { value: "350+", label: "Business Clients" },
  { value: "98%", label: "Client Satisfaction" },
];

export const FALLBACK_HOME_PAGE: CmsPage = {
  slug: "home",
  sections: [
    {
      sectionType: "HERO",
      heading: "Reliable Delivery Riders & Workforce Solutions",
      subheading: "5000+ Verified Riders | Fast Deployment | PAN India Coverage",
      buttonLabel: "Hire Riders Now",
    },
    {
      sectionType: "STATS",
      extraData: JSON.stringify({
        riders: "5,000+",
        workforce: "12,000+",
        clients: "350+",
        satisfaction: "98%",
      }),
    },
    {
      sectionType: "ABOUT",
      heading: "About QuickFleet",
      body: "QuickFleet Workforce Solutions is India's leading B2B provider of verified delivery riders and workforce solutions. We specialize in rider recruitment for e-commerce, food delivery, logistics, and quick commerce. With 5000+ active riders and 350+ clients across 50+ cities, we deliver rapid deployment, complete verification, and ongoing support with full statutory compliance.",
    },
  ],
};
