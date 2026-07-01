import { pgTable, serial, text, integer, boolean, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Rider Applications Table
 * Stores all rider job applications with rider-specific fields
 */
export const riderApplicationsTable = pgTable("rider_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id"), // References career_jobs table from backend
  
  // Personal Information
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  
  // Rider-specific Information
  drivingLicenseNumber: text("driving_license_number").notNull(),
  licenseExpiryDate: date("license_expiry_date").notNull(),
  licenseType: text("license_type").notNull(), // TWO_WHEELER, FOUR_WHEELER
  aadhaarNumber: text("aadhaar_number").notNull(),
  panNumber: text("pan_number").notNull(),
  
  // Vehicle Information
  vehicleOwnership: text("vehicle_ownership").notNull(), // OWN, RENTAL, COMPANY_PROVIDED, NONE
  vehicleType: text("vehicle_type"), // BIKE, SCOOTER, BICYCLE, NONE
  vehicleRegistrationNumber: text("vehicle_registration_number"),
  vehicleMake: text("vehicle_make"),
  vehicleModel: text("vehicle_model"),
  vehicleInsuranceExpiry: date("vehicle_insurance_expiry"),
  
  // Experience & Skills
  deliveryExperienceMonths: integer("delivery_experience_months").default(0),
  previousCompanies: text("previous_companies"), // Comma-separated
  navigationAppProficiency: text("navigation_app_proficiency").default("BEGINNER"), // BEGINNER, INTERMEDIATE, ADVANCED
  knownLanguages: text("known_languages"), // Comma-separated
  areaKnowledge: text("area_knowledge"), // Zones/areas they know well
  
  // Preferences
  shiftPreference: text("shift_preference"), // DAY, NIGHT, ROTATIONAL, FLEXIBLE
  preferredZones: jsonb("preferred_zones"), // Array of zone IDs or names
  willingToWorkWeekends: boolean("willing_to_work_weekends").default(true),
  expectedSalary: integer("expected_salary"),
  
  // Hiring Model
  hiringType: text("hiring_type").notNull().default("PERMANENT"), // PERMANENT, CONTRACT, TEMPORARY, BULK
  availableFrom: date("available_from"),
  
  // Verification Status
  documentsVerified: boolean("documents_verified").default(false),
  documentsVerifiedBy: integer("documents_verified_by"), // Admin user ID
  documentsVerifiedAt: timestamp("documents_verified_at"),
  
  backgroundCheckStatus: text("background_check_status").default("PENDING"), // PENDING, IN_PROGRESS, COMPLETED, FAILED
  backgroundCheckCompletedAt: timestamp("background_check_completed_at"),
  backgroundCheckNotes: text("background_check_notes"),
  
  policeVerificationStatus: text("police_verification_status").default("NOT_REQUIRED"), // NOT_REQUIRED, PENDING, COMPLETED, FAILED
  policeVerificationCompletedAt: timestamp("police_verification_completed_at"),
  
  eligibilityStatus: text("eligibility_status").default("PENDING_REVIEW"), // ELIGIBLE, NOT_ELIGIBLE, PENDING_REVIEW
  eligibilityNotes: text("eligibility_notes"),
  
  // Application Status
  applicationStatus: text("application_status").default("SUBMITTED"), // SUBMITTED, SCREENING, INTERVIEW_SCHEDULED, SELECTED, REJECTED, ONBOARDING, DEPLOYED
  rejectionReason: text("rejection_reason"),
  
  // Interview Details
  interviewScheduledAt: timestamp("interview_scheduled_at"),
  interviewCompletedAt: timestamp("interview_completed_at"),
  interviewRating: integer("interview_rating"), // 1-5
  interviewNotes: text("interview_notes"),
  interviewedBy: integer("interviewed_by"), // Admin user ID
  
  // Documents
  resumeUrl: text("resume_url"),
  photoUrl: text("photo_url"),
  
  // Metadata
  sourceChannel: text("source_channel"), // WEBSITE, MOBILE_APP, REFERRAL, WALK_IN, JOB_PORTAL
  referredBy: text("referred_by"),
  assignedTo: integer("assigned_to"), // Recruiter user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Rider Documents Table
 * Stores uploaded documents with verification status
 */
export const riderDocumentsTable = pgTable("rider_documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(), // References rider_applications
  
  documentType: text("document_type").notNull(), // DL_FRONT, DL_BACK, AADHAAR_FRONT, AADHAAR_BACK, PAN, PHOTO, VEHICLE_RC, INSURANCE, BANK_PASSBOOK, ADDRESS_PROOF, EDUCATION_CERT
  documentUrl: text("document_url").notNull(),
  documentNumber: text("document_number"), // Extracted document number
  
  verificationStatus: text("verification_status").default("PENDING"), // PENDING, VERIFIED, REJECTED, EXPIRED
  verifiedBy: integer("verified_by"), // Admin user ID
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
  
  expiryDate: date("expiry_date"), // For documents with expiry (DL, insurance, etc.)
  
  metadata: jsonb("metadata"), // Additional extracted data
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Background Verification Logs Table
 * Audit trail for verification activities
 */
export const backgroundVerificationLogsTable = pgTable("background_verification_logs", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  
  verificationType: text("verification_type").notNull(), // DOCUMENT, ADDRESS, EMPLOYMENT, REFERENCE, POLICE, CRIMINAL_RECORD
  status: text("status").notNull(), // INITIATED, IN_PROGRESS, COMPLETED, FAILED
  
  verificationAgency: text("verification_agency"), // Third-party agency name
  referenceNumber: text("reference_number"), // Agency reference number
  
  initiatedBy: integer("initiated_by"), // User ID
  initiatedAt: timestamp("initiated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  
  result: text("result"), // CLEAR, DISCREPANCY, NEGATIVE
  findings: text("findings"), // Detailed findings
  attachments: jsonb("attachments"), // Array of document URLs
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Onboarding Tasks Table
 * Tracks onboarding checklist for selected riders
 */
export const onboardingTasksTable = pgTable("onboarding_tasks", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  
  taskName: text("task_name").notNull(), // Documentation Complete, Training Scheduled, Uniform Issued, App Access Given, etc.
  taskDescription: text("task_description"),
  taskCategory: text("task_category"), // DOCUMENTATION, TRAINING, EQUIPMENT, SYSTEM_ACCESS, COMPLIANCE
  taskOrder: integer("task_order").default(0),
  
  status: text("status").default("PENDING"), // PENDING, IN_PROGRESS, COMPLETED, SKIPPED, BLOCKED
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at"),
  completedBy: integer("completed_by"), // Admin user ID
  
  notes: text("notes"),
  attachments: jsonb("attachments"), // Array of document URLs
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Rider Profiles Table
 * Stores deployed rider information post-onboarding
 */
export const riderProfilesTable = pgTable("rider_profiles", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().unique(),
  riderId: text("rider_id").notNull().unique(), // QF-RDR-2026-0001
  
  // Personal Info (copied from application)
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  
  // Employment Details
  employmentType: text("employment_type").notNull(), // PERMANENT, CONTRACT, TEMPORARY
  clientAssignedTo: integer("client_assigned_to"), // Client company ID
  department: text("department"),
  reportingManager: text("reporting_manager"),
  
  joiningDate: date("joining_date").notNull(),
  probationEndDate: date("probation_end_date"),
  contractEndDate: date("contract_end_date"),
  
  // Status
  status: text("status").default("ACTIVE"), // ACTIVE, ON_LEAVE, SUSPENDED, RESIGNED, TERMINATED
  
  // Performance
  performanceRating: integer("performance_rating"), // 1-5
  totalDeliveries: integer("total_deliveries").default(0),
  successfulDeliveries: integer("successful_deliveries").default(0),
  customerRating: integer("customer_rating"), // Average rating
  
  // Attendance
  totalWorkingDays: integer("total_working_days").default(0),
  daysPresent: integer("days_present").default(0),
  daysAbsent: integer("days_absent").default(0),
  
  // Compliance
  uniformIssued: boolean("uniform_issued").default(false),
  idCardIssued: boolean("id_card_issued").default(false),
  trainingCompleted: boolean("training_completed").default(false),
  
  // Exit Details
  exitDate: date("exit_date"),
  exitReason: text("exit_reason"),
  exitNotes: text("exit_notes"),
  eligibleForRehire: boolean("eligible_for_rehire"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Rider Attendance Table
 * Daily attendance tracking
 */
export const riderAttendanceTable = pgTable("rider_attendance", {
  id: serial("id").primaryKey(),
  riderId: integer("rider_id").notNull(), // References rider_profiles
  
  attendanceDate: date("attendance_date").notNull(),
  status: text("status").notNull(), // PRESENT, ABSENT, HALF_DAY, ON_LEAVE, HOLIDAY
  
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  totalHours: integer("total_hours"), // In minutes
  
  leaveType: text("leave_type"), // SICK, CASUAL, PLANNED
  leaveApproved: boolean("leave_approved"),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Replacement Requests Table
 * Tracks rider replacement requests
 */
export const replacementRequestsTable = pgTable("replacement_requests", {
  id: serial("id").primaryKey(),
  riderId: integer("rider_id").notNull(), // References rider_profiles
  clientId: integer("client_id").notNull(),
  
  reason: text("reason").notNull(), // RESIGNATION, TERMINATION, PERFORMANCE, NO_SHOW, RELOCATION
  reasonDetails: text("reason_details"),
  
  requestedBy: integer("requested_by"), // Client user or admin
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  
  urgency: text("urgency").default("NORMAL"), // URGENT, NORMAL, LOW
  requirementDetails: text("requirement_details"),
  
  status: text("status").default("PENDING"), // PENDING, IN_PROGRESS, REPLACED, CANCELLED
  
  replacementRiderId: integer("replacement_rider_id"), // References rider_profiles
  replacedAt: timestamp("replaced_at"),
  replacementNotes: text("replacement_notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// Zod Schemas for Validation
// ============================================================================

export const insertRiderApplicationSchema = createInsertSchema(riderApplicationsTable, {
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  drivingLicenseNumber: z.string().min(5),
  aadhaarNumber: z.string().length(12),
  panNumber: z.string().length(10).toUpperCase(),
  deliveryExperienceMonths: z.number().min(0).max(600),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertRiderDocumentSchema = createInsertSchema(riderDocumentsTable).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertOnboardingTaskSchema = createInsertSchema(onboardingTasksTable).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertRiderProfileSchema = createInsertSchema(riderProfilesTable).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// ============================================================================
// TypeScript Types
// ============================================================================

export type RiderApplication = typeof riderApplicationsTable.$inferSelect;
export type InsertRiderApplication = z.infer<typeof insertRiderApplicationSchema>;

export type RiderDocument = typeof riderDocumentsTable.$inferSelect;
export type InsertRiderDocument = z.infer<typeof insertRiderDocumentSchema>;

export type OnboardingTask = typeof onboardingTasksTable.$inferSelect;
export type InsertOnboardingTask = z.infer<typeof insertOnboardingTaskSchema>;

export type RiderProfile = typeof riderProfilesTable.$inferSelect;
export type InsertRiderProfile = z.infer<typeof insertRiderProfileSchema>;

export type BackgroundVerificationLog = typeof backgroundVerificationLogsTable.$inferSelect;
export type RiderAttendance = typeof riderAttendanceTable.$inferSelect;
export type ReplacementRequest = typeof replacementRequestsTable.$inferSelect;
