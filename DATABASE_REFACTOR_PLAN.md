# Database Refactor Plan - Scalable Architecture

## 🎯 Goals

1. **Global Dictionary**: Single source of truth for all vocabulary words
2. **User Progress Tracking**: Separate user learning progress from word definitions
3. **Payment Integration Ready**: Subscription management with Stripe/PayPal compatibility
4. **Admin Controls**: Full user management, role changes, subscription management
5. **Audit Logging**: Track all critical actions for security and analytics
6. **Performance Optimization**: Proper indexing, caching strategies
7. **Data Integrity**: Referential integrity, cascading deletes, constraints

---

## 📊 New Database Schema

### **1. Global Vocabulary (Master Dictionary)**

```typescript
// Collection: vocabularies
{
  _id: ObjectId,
  word: string,                    // UNIQUE, lowercase, indexed
  normalizedWord: string,          // Searchable normalized form

  // Core Definition
  meaning: string,
  meaningBn?: string,
  partOfSpeech: string,            // noun, verb, adjective, etc.

  // Pronunciation
  phonetic?: string,
  phoneticAudio?: string,

  // Examples & Context
  exampleSentences: [
    {
      sentence: string,
      source?: string,
      addedBy?: ObjectId           // User who added this example
    }
  ],

  // Related Words
  synonyms: [string],
  antonyms: [string],

  // Classification
  difficulty: 'easy' | 'medium' | 'hard',
  topicTags: [string],
  cefr?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',  // Language proficiency level
  frequency?: number,              // Word frequency rank (1-10000)

  // Metadata
  sourceUrl?: string,
  sourceType: 'user' | 'dictionary_api' | 'admin' | 'ai_generated',

  // AI Enhancement Data (cached)
  aiEnhancement?: {
    enhancedMeaning: string,
    memoryTips: [string],
    usageNotes: string,
    lastEnhanced: Date
  },

  // Statistics
  totalLearners: number,           // How many users have this word
  averageRating?: number,          // User ratings
  timesSearched: number,           // Popularity metric

  // Audit
  createdBy: ObjectId,             // Reference to User
  createdAt: Date,
  updatedAt: Date,
  lastVerified?: Date,             // When admin last verified accuracy

  // Soft Delete
  isActive: boolean,
  isVerified: boolean,             // Admin verified
  reportCount: number              // User reports for incorrect data
}

Indexes:
- { word: 1 } - UNIQUE
- { normalizedWord: 1 }
- { difficulty: 1, topicTags: 1 }
- { totalLearners: -1 }
- { createdAt: -1 }
- { isActive: 1, isVerified: 1 }
```

### **2. User Learning Progress (Personalized Data)**

```typescript
// Collection: user_vocabulary_progress
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  vocabularyId: ObjectId,          // Reference to Global Vocabulary

  // Learning Status
  status: 'new' | 'learning' | 'reviewing' | 'mastered',
  proficiencyLevel: 0-100,         // Calculated score

  // Practice History
  reviewCount: number,
  correctCount: number,
  incorrectCount: number,
  lastReviewedAt: Date,
  nextReviewDate: Date,            // Spaced repetition

  // User Customizations
  personalNotes?: string,
  userRating?: 1-5,
  isFavorite: boolean,
  customTags: [string],

  // Practice Performance
  practiceHistory: [
    {
      practiceType: 'flashcard' | 'quiz' | 'sentence' | 'listening',
      score: number,
      timeSpent: number,           // seconds
      timestamp: Date,
      aiFeedbackUsed: boolean
    }
  ],

  // Spaced Repetition Algorithm Data
  easeFactor: number,              // SM-2 algorithm
  interval: number,                // Days until next review
  repetitions: number,

  // Metadata
  addedToListAt: Date,
  firstMasteredAt?: Date,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { userId: 1, vocabularyId: 1 } - UNIQUE COMPOUND
- { userId: 1, status: 1 }
- { userId: 1, nextReviewDate: 1 }
- { userId: 1, isFavorite: 1 }
```

### **3. Enhanced User Model**

```typescript
// Collection: users
{
  _id: ObjectId,

  // Basic Info
  name: string,
  email: string,                   // UNIQUE, indexed
  password?: string,               // bcrypt hashed

  // OAuth
  googleId?: string,               // UNIQUE, sparse index
  avatar?: string,

  // Role & Permissions
  role: 'user' | 'premium' | 'admin' | 'super_admin',
  permissions: [string],           // ['manage_users', 'verify_words', etc.]

  // Subscription Management
  subscription: {
    tier: 'free' | 'premium' | 'lifetime',
    status: 'active' | 'cancelled' | 'expired' | 'trial',
    startDate?: Date,
    endDate?: Date,
    cancelledAt?: Date,
    autoRenew: boolean,

    // Payment Integration Ready
    stripeCustomerId?: string,
    stripeSubscriptionId?: string,
    paymentMethod?: 'stripe' | 'paypal' | 'manual',
    lastPaymentDate?: Date,
    nextBillingDate?: Date,
    billingHistory: [
      {
        amount: number,
        currency: string,
        status: string,
        invoiceId: string,
        paidAt: Date
      }
    ]
  },

  // AI Usage Tracking
  aiQuota: {
    tier: 'free' | 'premium',
    dailyLimit: number,
    requestsRemaining: number,
    tokensUsed: number,
    resetDate: Date,
    lifetimeRequests: number,
    lifetimeTokens: number
  },

  // Learning Preferences
  preferences: {
    dailyGoal: number,             // Words per day
    reminderTime?: string,         // HH:MM
    reminderEnabled: boolean,
    language: 'en' | 'bn',
    theme: 'light' | 'dark' | 'system',
    practiceTypes: [string],       // Preferred practice modes
    difficultyPreference: 'easy' | 'medium' | 'hard' | 'mixed'
  },

  // Learning Statistics
  statistics: {
    totalWordsLearned: number,
    wordsInProgress: number,
    wordsMastered: number,
    currentStreak: number,
    longestStreak: number,
    lastActiveDate: Date,
    totalPracticeTime: number,     // minutes
    averageAccuracy: number,       // percentage
    weeklyProgress: [
      {
        week: Date,
        wordsAdded: number,
        practicesCompleted: number,
        accuracy: number
      }
    ]
  },

  // Account Status
  isActive: boolean,
  isVerified: boolean,             // Email verified
  isBlocked: boolean,
  blockReason?: string,

  // Metadata
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  loginCount: number,

  // Security
  passwordChangedAt?: Date,
  failedLoginAttempts: number,
  lockedUntil?: Date
}

Indexes:
- { email: 1 } - UNIQUE
- { googleId: 1 } - UNIQUE, SPARSE
- { 'subscription.tier': 1, 'subscription.status': 1 }
- { role: 1 }
- { isActive: 1, isBlocked: 1 }
- { 'aiQuota.resetDate': 1 }
```

### **4. Practice Sessions**

```typescript
// Collection: practice_sessions
{
  _id: ObjectId,
  userId: ObjectId,

  // Session Details
  sessionType: 'flashcard' | 'quiz' | 'sentence' | 'mixed',
  startTime: Date,
  endTime: Date,
  duration: number,                // seconds

  // Performance
  totalWords: number,
  correctAnswers: number,
  incorrectAnswers: number,
  skippedWords: number,
  accuracy: number,

  // Words Practiced
  wordsPracticed: [
    {
      vocabularyId: ObjectId,
      word: string,
      isCorrect: boolean,
      timeSpent: number,
      aiFeedbackUsed: boolean,
      aiFeedbackRating?: number
    }
  ],

  // AI Usage
  aiRequestsUsed: number,
  tokensConsumed: number,

  createdAt: Date
}

Indexes:
- { userId: 1, createdAt: -1 }
- { userId: 1, sessionType: 1 }
```

### **5. AI Usage Logs**

```typescript
// Collection: ai_usage_logs
{
  _id: ObjectId,
  userId: ObjectId,

  // Request Details
  endpoint: string,                // '/enhance-vocab', '/practice-feedback'
  requestType: 'enhance' | 'feedback' | 'suggestion',

  // Input/Output
  inputData: {
    word?: string,
    vocabularyId?: ObjectId,
    userAnswer?: string
  },

  // AI Response
  success: boolean,
  tokensUsed: number,
  responseTime: number,            // milliseconds
  model: string,                   // 'gemini-2.0-flash'

  // Quota Status
  quotaBefore: number,
  quotaAfter: number,

  // Error Handling
  error?: {
    message: string,
    code: string,
    timestamp: Date
  },

  // Metadata
  requestTimestamp: Date,
  userAgent?: string,
  ipAddress?: string
}

Indexes:
- { userId: 1, requestTimestamp: -1 }
- { requestTimestamp: -1 }
- { success: 1 }
```

### **6. Audit Logs (Admin Actions)**

```typescript
// Collection: audit_logs
{
  _id: ObjectId,

  // Actor
  performedBy: ObjectId,           // Admin user
  performedByEmail: string,
  performedByRole: string,

  // Action
  action: string,                  // 'user_blocked', 'subscription_changed', 'role_updated'
  actionType: 'create' | 'update' | 'delete' | 'access',
  resource: 'user' | 'vocabulary' | 'subscription' | 'system',
  resourceId?: ObjectId,

  // Target (if user management)
  targetUserId?: ObjectId,
  targetUserEmail?: string,

  // Changes
  changes: {
    before?: any,
    after?: any,
    diff?: any
  },

  // Context
  reason?: string,
  notes?: string,

  // Metadata
  ipAddress: string,
  userAgent: string,
  timestamp: Date,

  // Severity
  severity: 'low' | 'medium' | 'high' | 'critical'
}

Indexes:
- { performedBy: 1, timestamp: -1 }
- { action: 1, timestamp: -1 }
- { targetUserId: 1, timestamp: -1 }
- { timestamp: -1 }
```

### **7. Word Reports (User Feedback)**

```typescript
// Collection: word_reports
{
  _id: ObjectId,
  vocabularyId: ObjectId,
  reportedBy: ObjectId,

  // Report Details
  reportType: 'incorrect_meaning' | 'incorrect_example' | 'duplicate' | 'inappropriate' | 'other',
  description: string,
  suggestedCorrection?: string,

  // Status
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected',
  reviewedBy?: ObjectId,
  reviewedAt?: Date,
  reviewNotes?: string,
  actionTaken?: string,

  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { vocabularyId: 1, status: 1 }
- { reportedBy: 1, createdAt: -1 }
- { status: 1, createdAt: -1 }
```

### **8. System Settings (Configuration)**

```typescript
// Collection: system_settings
{
  _id: ObjectId,
  key: string,                     // UNIQUE
  value: any,

  // Metadata
  description: string,
  category: string,                // 'ai', 'subscription', 'features', 'limits'
  dataType: 'string' | 'number' | 'boolean' | 'json',
  isPublic: boolean,               // Can be accessed by frontend

  // Audit
  lastModifiedBy: ObjectId,
  lastModifiedAt: Date,
  createdAt: Date
}

Example Settings:
- ai_free_daily_limit: 100
- ai_premium_daily_limit: 500
- ai_model: 'gemini-2.0-flash'
- subscription_price: 3.99
- subscription_currency: 'USD'
- feature_ai_enabled: true
- max_vocabulary_per_user: 10000
```

---

## 🔄 Data Migration Strategy

### Phase 1: Backup Current Data

```bash
# Export existing data
mongodump --uri="mongodb://..." --db=EnglishPrep --out=./backup

# Or using script
npm run db:backup
```

### Phase 2: Create Global Vocabulary

```typescript
// Migrate existing vocabularies to global dictionary
// 1. Aggregate all unique words from all users
// 2. Merge duplicates (keep best definition)
// 3. Create master vocabulary entries
// 4. Assign proper createdBy, sourceType
```

### Phase 3: Create User Progress Links

```typescript
// For each user's vocabulary:
// 1. Find or create global vocabulary entry
// 2. Create user_vocabulary_progress entry
// 3. Copy personal notes, status, review data
// 4. Maintain timestamps
```

### Phase 4: Update User Model

```typescript
// 1. Add new fields with defaults
// 2. Populate aiQuota from existing data
// 3. Set subscription data
// 4. Calculate statistics from existing progress
```

### Phase 5: Migrate Practice Data

```typescript
// 1. Group existing practices into sessions
// 2. Calculate session metrics
// 3. Update user statistics
```

---

## 🎨 Admin Dashboard Features

### User Management

- ✅ View all users (paginated, searchable, filterable)
- ✅ View user details (profile, stats, activity)
- ✅ Change user role (user → premium → admin)
- ✅ Change subscription status (active/cancelled/expired)
- ✅ Block/Unblock users
- ✅ Reset user password
- ✅ View user's vocabulary list
- ✅ View user's practice history
- ✅ View AI usage by user
- ✅ Manual subscription override (grant premium)
- ✅ Refund/credit management

### Vocabulary Management

- ✅ View all words in global dictionary
- ✅ Add new words manually
- ✅ Edit existing words
- ✅ Merge duplicate words
- ✅ Verify word accuracy (set isVerified)
- ✅ View word statistics (learners, searches)
- ✅ Review user-reported words
- ✅ Bulk import words (CSV/JSON)
- ✅ Delete/deactivate words

### System Monitoring

- ✅ View AI usage statistics (requests, tokens, costs)
- ✅ View system health metrics
- ✅ View error logs
- ✅ View audit logs (admin actions)
- ✅ View popular words
- ✅ View user growth metrics
- ✅ View subscription revenue
- ✅ Configure system settings

### Reports & Analytics

- ✅ User acquisition report
- ✅ Subscription conversion report
- ✅ AI usage cost analysis
- ✅ User engagement metrics
- ✅ Word popularity report
- ✅ Practice effectiveness analysis

---

## 🔐 Security & Permissions

### Role-Based Access Control (RBAC)

#### **User (Free)**

- ✅ View own profile
- ✅ Add words to personal list (from global dictionary)
- ✅ Practice own words
- ✅ Use AI (100 requests/day)
- ✅ View own statistics

#### **Premium User**

- ✅ All User permissions
- ✅ Use AI (500 requests/day)
- ✅ Access premium features
- ✅ Priority support
- ✅ Export vocabulary data

#### **Admin**

- ✅ All Premium permissions
- ✅ View all users
- ✅ Manage users (block, role change, subscription)
- ✅ Verify words
- ✅ Review reports
- ✅ View system analytics
- ✅ Configure settings

#### **Super Admin**

- ✅ All Admin permissions
- ✅ Manage admins
- ✅ Access audit logs
- ✅ System configuration
- ✅ Database operations

---

## 💳 Payment Integration Readiness

### Stripe Integration Points

```typescript
// webhook handlers needed
POST / api / webhooks / stripe -
  checkout.session.completed -
  customer.subscription.created -
  customer.subscription.updated -
  customer.subscription.deleted -
  invoice.payment_succeeded -
  invoice.payment_failed;

// payment endpoints
POST / api / payments / create - checkout - session;
POST / api / payments / create - portal - session;
GET / api / payments / subscription - status;
POST / api / payments / cancel - subscription;
```

### Subscription Lifecycle

1. **Trial Start**: User signs up → Free tier
2. **Upgrade**: User clicks upgrade → Stripe Checkout
3. **Success**: Webhook → Update user subscription
4. **Renewal**: Automatic via Stripe
5. **Cancellation**: Portal or API → Cancel at period end
6. **Expiry**: Webhook → Downgrade to free
7. **Reactivation**: User can resubscribe

---

## 📈 Performance Optimizations

### Database Indexing

- Compound indexes on frequently queried fields
- Sparse indexes for optional fields
- Text indexes for search functionality

### Caching Strategy

- Redis for:
  - User session data
  - AI quota tracking
  - Popular words cache
  - System settings cache
- Cache TTL: 5 minutes for volatile data, 1 hour for static

### Query Optimization

- Use aggregation pipelines
- Limit returned fields (projection)
- Paginate all lists
- Use `lean()` for read-only queries
- Batch operations where possible

### API Rate Limiting

- Per-user rate limits
- Per-IP rate limits for auth endpoints
- Separate limits for AI endpoints

---

## 🧪 Testing Strategy

### Unit Tests

- Model validators
- Service functions
- Utility functions
- Permission checks

### Integration Tests

- API endpoints
- Database operations
- AI service integration
- Payment webhook handling

### E2E Tests

- User registration → vocabulary → practice → upgrade
- Admin user management flows
- Payment flows (test mode)

---

## 📦 Migration Scripts Needed

1. `migrate-to-global-dictionary.ts` - Create global vocabulary
2. `migrate-user-progress.ts` - Create user progress links
3. `migrate-user-model.ts` - Update user schema
4. `migrate-practice-sessions.ts` - Group practices into sessions
5. `seed-admin.ts` - Create initial admin user
6. `seed-system-settings.ts` - Initialize system configuration
7. `calculate-user-statistics.ts` - Populate user stats
8. `verify-data-integrity.ts` - Validate migration

---

## ✅ Implementation Checklist

### Phase 1: Database Schema (2-3 days)

- [ ] Create new models
- [ ] Add validators and middleware
- [ ] Create indexes
- [ ] Write migration scripts
- [ ] Test migrations on dev data

### Phase 2: Backend API (3-4 days)

- [ ] Update vocabulary endpoints (global dictionary)
- [ ] Update user progress endpoints
- [ ] Create admin management endpoints
- [ ] Update AI usage tracking
- [ ] Add audit logging
- [ ] Update authentication/authorization

### Phase 3: Admin Dashboard (2-3 days)

- [ ] User management UI
- [ ] Vocabulary management UI
- [ ] Analytics dashboard
- [ ] Audit log viewer
- [ ] Settings configurator

### Phase 4: Frontend Updates (2-3 days)

- [ ] Update vocabulary flow (global + personal)
- [ ] Update practice flow
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Update user profile
- [ ] Add admin routes

### Phase 5: Payment Integration (3-4 days)

- [ ] Stripe account setup
- [ ] Checkout flow
- [ ] Webhook handlers
- [ ] Subscription management
- [ ] Billing portal
- [ ] Invoice emails

### Phase 6: Testing & QA (2-3 days)

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] Security audit

### Phase 7: Data Migration (1 day)

- [ ] Backup production data
- [ ] Run migration scripts
- [ ] Verify data integrity
- [ ] Test production

### Phase 8: Deployment (1 day)

- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure webhooks
- [ ] Monitor logs
- [ ] Announce to users

---

## 🚀 Benefits of New Architecture

1. **Scalability**: Global dictionary scales better than per-user copies
2. **Data Quality**: Single source of truth, easier to maintain accuracy
3. **Performance**: Reduced data duplication, faster queries
4. **Analytics**: Better insights with aggregated data
5. **AI Optimization**: Cache AI enhancements for all users
6. **Payment Ready**: Subscription system ready for Stripe integration
7. **Admin Control**: Comprehensive management capabilities
8. **Audit Trail**: Complete history of admin actions
9. **User Experience**: Faster search, better recommendations
10. **Cost Efficiency**: Reduced database storage, optimized AI usage

---

## 📋 Next Steps

1. **Review & Approve** this plan
2. **Prioritize features** (MVP vs future)
3. **Create JIRA tickets** for each task
4. **Set sprint goals** (2-week sprints)
5. **Start with Phase 1** (Database Schema)

---

## 🤔 Questions to Answer

1. Should we keep old vocabulary data or migrate completely?
2. What's the timeline for payment integration?
3. Do we need multi-language support beyond Bengali?
4. What analytics are most important for MVP?
5. Should we implement caching from day 1?
6. What's the backup/disaster recovery strategy?
7. Do we need a staging environment?
8. What's the budget for Stripe fees (2.9% + $0.30)?

---

**Estimated Total Time**: 16-23 days for full implementation
**Priority**: High
**Complexity**: Medium-High
**Risk**: Medium (data migration is sensitive)
