# Hospital Lab Test Entry System - Design Guidelines

## Design Approach

**Selected Approach:** Design System-Based (Healthcare Utility Focus)

**Rationale:** This is a utility-focused healthcare application prioritizing efficiency, accuracy, and clarity in data entry and retrieval. Drawing inspiration from modern healthcare dashboards and productivity tools like Linear and Notion, with emphasis on clean forms and structured data display.

**Core Principles:**
- Clinical clarity over decoration
- Form efficiency and validation feedback
- Scannable data presentation
- Professional trust-building aesthetics

---

## Typography

**Font Stack:**
- Primary: Inter or DM Sans (Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight
- Labels/Metadata: 500 weight, slightly smaller

**Hierarchy:**
- Page Titles: text-3xl md:text-4xl, font-semibold
- Section Headers: text-xl md:text-2xl, font-semibold
- Card Titles: text-lg, font-medium
- Form Labels: text-sm, font-medium, uppercase tracking
- Body Text: text-base
- Helper Text: text-sm
- Metadata/Timestamps: text-xs

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing: gap-2, p-2 (within form groups)
- Standard spacing: gap-4, p-4 (between form fields)
- Section spacing: gap-6, p-6 (card padding)
- Page spacing: gap-8, p-8 (between major sections)
- Generous spacing: gap-12, p-12 (page margins)

**Grid System:**
- Container: max-w-7xl mx-auto px-4 md:px-8
- Forms: max-w-2xl (single column for data entry)
- Search Results: Grid with grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Record Cards: Full-width with internal multi-column layouts

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed or sticky header, full-width with shadow
- Logo/System name on left
- Primary navigation links: "New Entry" | "Search" | "View Records"
- Active state with bottom border accent
- User info/logout on right (if applicable)

### Forms (New Patient Entry)
**Form Container:**
- Centered card with generous padding (p-8)
- White background with subtle shadow
- Organized in logical sections with dividers

**Input Fields:**
- Consistent height (h-12)
- Clear labels above inputs
- Border on all sides with focus ring
- Helper text below for validation/instructions
- Required field indicators

**Field Types:**
- Text inputs: Full-width in mobile, constrained on desktop
- Dropdowns: Custom-styled with chevron icons
- Radio/Checkbox groups: Horizontal layout with clear spacing
- Dynamic fields: Smooth appearance with fade-in animation

**Field Grouping:**
- Patient Info Section (Name, Age, Gender, ID)
- Test Selection Section (Dropdown with icon)
- Test-Specific Fields (Dynamic based on selection)
- Purpose/Notes Section
- Timestamp Display (Read-only, auto-generated)

**Submit Button:**
- Primary action: Large, full-width on mobile, inline on desktop
- Height: h-12
- Icon + text ("Save Patient Record")

### Search Interface
**Search Bar:**
- Prominent placement at top
- Large input field (h-14) with search icon
- Optional: Dropdown filter for search type (Name vs ID)
- Real-time suggestion dropdown

**Search Results:**
- Card grid layout
- Each result shows: Patient ID (prominent), Name, Age, Gender, Test Type
- Click entire card to view full details
- Empty state with helpful illustration/text

### View Records Page
**Filter Section:**
- Dropdown for test type filter
- Pill-style selected filter display
- Result count indicator

**Record Cards:**
- Horizontal card layout with structured sections
- Left: Patient info block (ID, Name, Age, Gender)
- Center: Test details and parameters
- Right: Timestamps and purpose
- Subtle separating borders between sections
- Hover state with slight elevation

**Data Display:**
- Label-value pairs in consistent format
- Monospace font for IDs and technical values
- Timestamps in relative format ("2 hours ago") with full date on hover

### Feedback & States
**Success Messages:**
- Toast notification (top-right corner)
- Check icon with success message
- Auto-dismiss after 4 seconds

**Loading States:**
- Skeleton screens for data loading
- Spinner for form submission

**Empty States:**
- Centered illustration/icon
- Helpful message
- Call-to-action button

**Error States:**
- Inline validation errors below fields
- Red text with warning icon
- Form-level errors in banner at top

### Modals/Overlays
**Full Record View (Modal):**
- Centered modal with backdrop blur
- Close button (X) top-right
- Scrollable content area
- All test details in organized sections
- Action buttons at bottom (Edit, Print, Close)

---

## Responsive Behavior

**Mobile (< 768px):**
- Single column forms
- Stacked navigation (hamburger menu)
- Full-width cards
- Bottom action buttons

**Tablet (768px - 1024px):**
- Two-column card grids
- Condensed navigation
- Form max-width maintained

**Desktop (> 1024px):**
- Three-column card grids
- Full horizontal navigation
- Generous whitespace
- Constrained form width for ergonomics

---

## Icons

**Library:** Heroicons (outline for general UI, solid for filled states)

**Usage:**
- Navigation items (test tube, search, list icons)
- Form field prefixes (user, calendar, clipboard icons)
- Test type indicators (specific medical icons)
- Success/error states (check, alert icons)
- Action buttons (save, edit, trash icons)

---

## Micro-interactions

**Minimal Animations:**
- Form field focus: Smooth border transition (200ms)
- Button hover: Slight background shift (150ms)
- Card hover: Subtle lift with shadow (200ms)
- Dynamic field appearance: Fade-in with slide-down (300ms)
- Page transitions: None (instant navigation for efficiency)

---

## Images

**No hero images required** - This is a utility application focused on data entry and retrieval. Images should be limited to:
- Empty state illustrations (simple line drawings)
- Success/confirmation icons
- Potential patient avatar placeholders (generic medical icons)

All imagery should be minimal, professional, and support functionality rather than decoration.