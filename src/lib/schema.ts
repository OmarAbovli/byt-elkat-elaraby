import { pgTable, serial, text, boolean, integer, decimal, timestamp, jsonb, uuid, primaryKey } from 'drizzle-orm/pg-core';

export const settings = pgTable("settings", {
    id: serial("id").primaryKey(),
    siteName: text("site_name").default("بيت الخط العربي"),
    supportEmail: text("support_email").default("support@bytek.com"),
    maintenanceMode: boolean("maintenance_mode").default(false),
    enableStripe: boolean("enable_stripe").default(true),
    enablePaypal: boolean("enable_paypal").default(false),
    enableManualPayment: boolean("enable_manual_payment").default(false),
    manualPaymentInstructions: text("manual_payment_instructions").default(""),
    enableVodafoneCash: boolean("enable_vodafone_cash").default(false),
    vodafoneCashNumber: text("vodafone_cash_number").default(""),
    stripePublicKey: text("stripe_public_key"),
    stripeSecretKey: text("stripe_secret_key"),
    stripeWebhookSecret: text("stripe_webhook_secret"),
    paypalClientId: text("paypal_client_id"),
    paypalSecret: text("paypal_secret"),
    paypalMode: text("paypal_mode").default("sandbox"), // sandbox or live
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const profiles = pgTable('profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id'), // Made nullable
    username: text('username').unique(),
    password: text('password'),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    email: text('email'), // Added email
    phone: text('phone'),
    skillLevel: text('skill_level').default('beginner'),
    role: text('role').default('student'),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const courses = pgTable('courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    titleEn: text('title_en'),
    slug: text('slug').unique().notNull(),
    description: text('description'),
    descriptionEn: text('description_en'),
    instructorId: uuid('instructor_id').references(() => profiles.id),
    coverImage: text('cover_image'),
    level: text('level').default('beginner'),
    durationHours: integer('duration_hours').default(0),
    isPublished: boolean('is_published').default(false),
    isFree: boolean('is_free').default(false),
    price: decimal('price', { precision: 10, scale: 2 }).default('0'),
    currency: text('currency').default('USD'),
    studentsCount: integer('students_count').default(0),
    rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const packages = pgTable('packages', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    nameEn: text('name_en'),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
    currency: text('currency').default('USD'),
    durationDays: integer('duration_days'),
    isFree: boolean('is_free').default(false),
    isPublished: boolean('is_published').default(true),
    features: jsonb('features').default([]),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const packageCourses = pgTable('package_courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    packageId: uuid('package_id').references(() => packages.id).notNull(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
});

export const packageLessons = pgTable('package_lessons', {
    id: uuid('id').defaultRandom().primaryKey(),
    packageId: uuid('package_id').references(() => packages.id).notNull(),
    lessonId: uuid('lesson_id').references(() => lessons.id).notNull(),
});

export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').default('USD'),
    paymentType: text('payment_type'),
    referenceId: uuid('reference_id'),
    stripePaymentId: text('stripe_payment_id'),
    status: text('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const enrollments = pgTable('enrollments', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    courseId: uuid('course_id').references(() => courses.id),
    packageId: uuid('package_id').references(() => packages.id),
    pathId: uuid('path_id').references(() => paths.id),
    enrolledAt: timestamp('enrolled_at').defaultNow(),
    expiresAt: timestamp('expires_at'),
    progressPercent: integer('progress_percent').default(0),
    completedAt: timestamp('completed_at'),
});

export const certificates = pgTable('certificates', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    courseId: uuid('course_id').references(() => courses.id),
    certificateNumber: text('certificate_number').unique().notNull(),
    issuedAt: timestamp('issued_at').defaultNow(),
    pdfUrl: text('pdf_url'),
    qrCode: text('qr_code'),
});

export const lessons = pgTable('lessons', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    content: text('content'),
    videoUrl: text('video_url'),
    duration: integer('duration').default(0), // in minutes
    isPublished: boolean('is_published').default(false),
    isFree: boolean('is_free').default(false), // Added isFree for lesson previews
    order: integer('order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const paths = pgTable('paths', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    image: text('image'),
    price: decimal('price', { precision: 10, scale: 2 }).default('0'),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const pathCourses = pgTable('path_courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    pathId: uuid('path_id').references(() => paths.id).notNull(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
});

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
    currency: text('currency').default('USD'),
    stock: integer('stock').default(0),
    images: jsonb('images').default([]),
    isPublished: boolean('is_published').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const posts = pgTable('posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    content: text('content'),
    excerpt: text('excerpt'),
    coverImage: text('cover_image'),
    videoUrl: text('video_url'),
    authorId: uuid('author_id').references(() => profiles.id),
    category: text('category').default('general'),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject'),
    message: text('message').notNull(),
    status: text('status').default('unread'), // unread, read, replied
    createdAt: timestamp('created_at').defaultNow(),
});
