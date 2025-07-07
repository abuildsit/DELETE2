# RemitMatch - Product Requirements Document

## Overview

**Product**: RemitMatch  
**Version**: 1.0 MVP  
**Target Launch**: Q2 2025  
**Team**: Solo founder + contractors  

### Problem Statement

Small-to-medium businesses using Xero receive remittance advice documents (PDFs) that reference multiple invoices. Manually matching these payments to invoices in Xero is time-consuming and error-prone, often taking 10-30 minutes per remittance.

### Solution

An AI-powered web application that automatically extracts payment data from remittance PDFs and creates matching payments in Xero, reducing reconciliation time from minutes to seconds.

### Success Metrics

- **Primary**: Time to reconcile remittance reduced from 15+ minutes to <2 minutes
- **Adoption**: 50 paying organizations within 6 months
- **Accuracy**: >85% AI extraction accuracy requiring minimal manual override
- **Revenue**: $5K MRR by month 6

---

## User Personas

### Primary: Finance Manager (Sarah)
- Uses Xero daily for bookkeeping
- Processes 10-50 remittances per month
- Values accuracy and audit trails
- Willing to pay $30-50/month for time savings

### Secondary: Business Owner (Mike)
- Reviews reconciliations but doesn't process them
- Needs visibility into payment status
- Cost-conscious but values efficiency
- May delegate to bookkeeper

---

## Core User Journey

```
1. Upload remittance PDF → 2. AI extracts data → 3. Review/approve → 4. Sync to Xero
   (30 seconds)              (1-2 minutes)      (30 seconds)     (automatic)
```

**Current state**: Manual data entry takes 15-30 minutes  
**Future state**: Automated flow takes 2-4 minutes total

---

## MVP Feature Set

### 🔐 Authentication & Onboarding
- Email + password signup
- OAuth login via Xero (required for setup)
- Single organization per user initially
- Automatic Xero connection on signup

### 🏢 Organization Setup
- Auto-create organization from Xero tenant data
- Select default bank account for payments
- Basic organization settings

### 📄 Remittance Processing

**Upload Flow**:
1. Drag-and-drop PDF upload
2. File stored in Supabase Storage
3. Automatic AI processing triggered
4. Status updates in real-time

**AI Extraction**:
- Extract: payment date, total amount, reference, invoice details
- Return structured JSON with confidence score
- Automatic matching against Xero invoices
- Flag unmatched items for manual review

**Manual Review**:
- Side-by-side PDF viewer and data table
- Override AI-selected invoices via dropdown
- Edit payment amounts per invoice
- Approve when satisfied

**Xero Integration**:
- Create payment in Xero on approval
- Link payment to correct invoices
- Handle Xero API errors gracefully
- Daily sync to check reconciliation status

### 📊 Dashboard & Monitoring
- Summary counts: pending approval, unmatched, reconciled
- Recent remittances list with status
- Simple filters: date range, status
- Manual "Refresh from Xero" button

### 👥 User Management (Simplified)
- **Admin**: Full access, can invite users
- **User**: Can process remittances, cannot invite others
- Email invitations to join organization

---

## Technical Implementation Status

### Completed Frontend Implementation
- ✅ Complete UI component library using shadcn/ui + Tailwind CSS
- ✅ Responsive design system with consistent spacing and typography
- ✅ Dashboard with summary metrics and navigation
- ✅ Comprehensive remittances list with advanced filtering
- ✅ Full-featured remittance detail modal with PDF viewer
- ✅ Settings pages for organization and account management
- ✅ Authentication pages with OAuth placeholders
- ✅ Onboarding flow for Xero connection and account setup
- ✅ Toast notification system for user feedback
- ✅ Organization switcher with multi-tenant support

### Ready for Backend Integration
The frontend is architected to easily connect to backend APIs:
- Mock data structures match the planned database schema
- Component props designed for real API data
- State management ready for React Query integration
- Error handling patterns established

### Frontend Stack (Implemented)
- **Framework**: Next.js 14 with App Router ✅
- **Hosting**: Vercel (configured) ✅ 
- **Styling**: Tailwind CSS + shadcn/ui component library ✅
- **State**: React hooks with planned Zustand integration
- **Data Fetching**: Ready for React Query integration

### Backend Stack (Planned)
- **API**: FastAPI (Python)
- **Hosting**: Render.com
- **AI**: OpenAI Assistant API
- **Scheduling**: Background tasks for Xero sync

### Database & Storage
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **File Storage**: Supabase Storage
- **Security**: Row-Level Security (RLS)

### Integrations
- **Xero API**: OAuth + REST API
- **OpenAI**: Assistant API for PDF processing
- **Stripe**: Subscription billing

---

## Data Models

### Core Tables

**organizations**
```sql
id, name, xero_tenant_id, default_bank_account_id, subscription_tier
```

**organization_members**
```sql
id, user_id, organization_id, role, invited_at, joined_at
```

**remittances**
```sql
id, organization_id, filename, status, payment_date, total_amount, 
reference, confidence_score, created_at, updated_at
```

**remittance_lines**
```sql
id, remittance_id, invoice_number, ai_paid_amount, manual_paid_amount,
ai_invoice_id, override_invoice_id
```

### Status Flow
```
Uploaded → Data Retrieved → Awaiting Approval → Exported to Xero → Reconciled
                         ↘ Error - Unmatched ↗
```

---

## API Design

### Read Operations (Supabase Direct)
- `GET /remittances` - List with filters and pagination
- `GET /remittance/:id` - Detail view with lines
- `GET /dashboard/summary` - Counts for dashboard

### Write Operations (Backend API)
- `POST /remittance/:id/approve` - Approve and sync to Xero
- `POST /remittance/:id/save-overrides` - Save manual changes
- `POST /remittance/:id/retry-ai` - Re-run AI extraction
- `POST /xero/sync-all` - Manual refresh from Xero

### Session Context
Every write operation includes `organization_id` for validation:
```typescript
{
  remittance_id: "rem_123",
  organization_id: "org_456",
  // ... other data
}
```

---

## User Interface

### Page Structure
1. **Dashboard** - Summary tiles + recent activity
2. **Remittances** - List view with filters + detail modal
3. **Settings** - Xero connection + team management
4. **Account** - User profile and billing

### Key UX Principles
- **Immediate feedback**: Optimistic updates with error rollback
- **Progressive disclosure**: Show complexity only when needed
- **Familiar patterns**: Table lists, modal details, clear CTAs
- **Mobile consideration**: Responsive but desktop-first

### Critical UI Elements
- Organization switcher (header)
- Upload dropzone with progress
- Status badges with clear color coding
- PDF viewer with zoom/navigation
- Invoice matching table with inline editing

---

## Subscription Model

### Tiers
- **Free**: 5 remittances/month
- **Business**: $25/month, 50 remittances
- **Pro**: $50/month, 150 remittances

### Usage Enforcement
- Soft limits with upgrade prompts
- Hard caps at tier limits
- Grace period for billing failures

### Billing Implementation
- Stripe Customer Portal
- Organization-level subscriptions
- Usage tracking per remittance processed

---

## Security & Compliance

### Multi-Tenant Security
- All database queries filtered by organization membership
- RLS policies on all tables
- Backend validation of organization context

### Data Protection
- PDF files auto-deleted after 90 days
- Audit logs for all changes
- Secure file URLs with expiration

### API Security
- Supabase JWT validation
- Rate limiting on upload endpoints
- Input validation and sanitization

---

## Error Handling

### AI Processing Failures
- Automatic retry with fallback method
- Manual retry button in UI
- Clear error messages with next steps

### Xero Integration Failures
- Graceful degradation with status updates
- Retry mechanism for transient failures
- Support contact for persistent issues

### User Experience
- Loading states for all async operations
- Optimistic updates with rollback
- Toast notifications for success/error

---

## Performance Considerations

### File Processing
- 10MB file size limit
- 5-page PDF limit
- Async processing with status updates

### Database Optimization
- Proper indexing on filtered columns
- Pagination for large data sets
- Caching for frequently accessed data

### API Rate Limiting
- Xero API: Batch operations where possible
- OpenAI: Queue processing to manage costs
- Upload: Per-user rate limits

---

## Launch Strategy

### Phase 1: Technical MVP (Month 1-2)
- Core upload → AI → Xero flow
- Basic authentication and organization setup
- Essential error handling

### Phase 2: UX Polish (Month 3)
- Dashboard with proper metrics
- Improved manual override interface
- User management and invitations

### Phase 3: Scale Preparation (Month 4)
- Subscription integration
- Performance optimization
- Customer feedback integration

### Go-to-Market
- Target Xero user communities
- Content marketing around reconciliation pain points
- Free tier to drive adoption

---

## Success Criteria

### Technical Milestones
- [ ] 95% uptime
- [ ] <3 second page load times
- [ ] 85%+ AI extraction accuracy
- [ ] Zero data loss incidents

### Business Milestones
- [ ] 100 trial signups in first month
- [ ] 20% trial to paid conversion
- [ ] $5K MRR by month 6
- [ ] Net Promoter Score >50

### User Experience Goals
- [ ] <2 minute average reconciliation time
- [ ] <5% user-reported errors
- [ ] 80%+ feature adoption rate
- [ ] Positive customer interviews

---

## Risk Mitigation

### Technical Risks
- **AI accuracy**: Multiple extraction methods + manual override
- **Xero API changes**: Comprehensive error handling + monitoring
- **Scale issues**: Performance testing + gradual rollout

### Business Risks
- **Competition**: Focus on Xero integration depth + user experience
- **Customer acquisition**: Free tier + content marketing
- **Unit economics**: Monitor AI costs + adjust pricing

### Operational Risks
- **Solo founder**: Document everything + automate where possible
- **Support burden**: In-app help + comprehensive error messages
- **Security**: Regular audits + Supabase security features

---

## Future Roadmap (Post-MVP)

### Q3 2025: Enhanced Features
- Email submission of remittances
- Multi-organization user support
- Advanced user roles and permissions
- Automated approval based on confidence scores

### Q4 2025: Platform Expansion
- Support for additional accounting software
- API for third-party integrations
- Advanced reporting and analytics
- Mobile app

### 2026: Market Expansion
- Multi-currency support
- International accounting standards
- Enterprise features
- White-label solutions

---

## Dependencies & Constraints

### External Dependencies
- Xero API stability and rate limits
- OpenAI service availability and pricing
- Supabase platform reliability

### Technical Constraints
- PDF processing limited to text-based documents
- Xero subscription level affects API access
- Browser compatibility for PDF viewing

### Resource Constraints
- Single developer initially
- Bootstrap budget for first 6 months
- Customer support handled by founder

---

*This PRD will be updated monthly based on user feedback and technical learnings.*