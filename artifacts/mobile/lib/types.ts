export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export interface CmsSection {
  id?: string;
  sectionType: string;
  heading?: string;
  subheading?: string;
  body?: string;
  imageUrl?: string;
  backgroundImageUrl?: string;
  buttonLabel?: string;
  buttonLink?: string;
  extraData?: string;
  order?: number;
}

export interface CmsPage {
  id?: string;
  slug: string;
  title?: string;
  sections: CmsSection[];
}

export interface AppSettings {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneSecondary?: string;
  address?: string;
  mapEmbedUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  copyrightText?: string;
  footerDescription?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  features?: string;
  bannerImageUrl?: string;
  featured?: boolean;
  status?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  imageUrl: string;
  category?: string;
  description?: string;
}

export interface Career {
  id: string;
  slug: string;
  title: string;
  location?: string;
  employmentType?: string;
  department?: string;
  summary?: string;
  description?: string;
  visible?: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  clientCompany?: string;
  testimonialText: string;
  visible?: boolean;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  visible?: boolean;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  icon?: string;
  description?: string;
  order?: number;
}

export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  description?: string;
}
