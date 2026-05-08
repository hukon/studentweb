# Medical Cabinet UI Overhaul — Design Spec

**Date:** 2026-05-08
**Scope:** Full visual overhaul (Option B) — XML-only changes plus one Java wiring change for TabLayout

---

## 1. Goals

Transform the bare-bones Medical Cabinet Management app into a clean, clinical, professional-looking Android app suited for a doctor managing their own patients. No feature changes — purely visual and structural layout improvements.

---

## 2. Color Palette

Defined in `app/src/main/res/values/colors.xml`:

| Name | Hex | Role |
|---|---|---|
| `colorPrimary` | `#1565C0` | Toolbar, active tabs, buttons |
| `colorPrimaryContainer` | `#E3F2FD` | Avatar backgrounds, card borders, header banners |
| `colorBackground` | `#F8FAFB` | Screen backgrounds |
| `colorSurface` | `#FFFFFF` | Card surfaces |
| `colorOnSurface` | `#1A1A2E` | Primary text |
| `colorSecondary` | `#607D8B` | Secondary text, icons |
| `colorAccent` | `#29B6F6` | FAB, accent elements |

Wired into `themes.xml` via Material3 theme attributes. Night theme left unchanged.

---

## 3. Main Screen (`activity_main.xml`)

**Structural changes:**
- Remove the two plain `Button` views (`btnPatients`, `btnAppointments`) and the `LinearLayout` wrapping them
- Add `MaterialToolbar` pinned to the top — title "Medical Cabinet", primary blue background, white text
- Add `TabLayout` below the toolbar — two tabs: person icon + "Patients", event icon + "Appointments"; active tab underline in `#29B6F6`
- `RecyclerView` fills remaining space with `#F8FAFB` background
- `FloatingActionButton` remains bottom-right, color updated to `#29B6F6`

**Java change (`MainActivity.java`):**
- Replace `btnPatients`/`btnAppointments` click listeners and alpha logic with a `TabLayout.OnTabSelectedListener` that calls `updateUI()` based on selected tab index

---

## 4. Patient List Item (`item_patient.xml`)

- `MaterialCardView`: 12dp corner radius, 2dp stroke `#E3F2FD`, 3dp elevation
- Left: circular frame (40×40dp) with `person` icon, primary blue on `#E3F2FD` background
- Right: patient name 16sp bold `#1A1A2E`, phone with phone icon in `#607D8B` 14sp

---

## 5. Appointment List Item (`item_appointment.xml`)

- `MaterialCardView`: same card style as patient item
- Left: date badge block (48×56dp) — large day number 20sp bold primary blue, short month 11sp uppercase slate, `#E3F2FD` background, 8dp corner radius
- Left border strip: 3dp wide, primary blue, full card height (calendar-event visual cue)
- Right: patient name 16sp bold, date/time line with clock icon in slate 14sp, description 14sp italic `#9E9E9E`

---

## 6. Add Patient Screen (`activity_add_patient.xml`)

- `MaterialToolbar` at top — "Add Patient" title, back arrow, primary blue background
- Header banner below toolbar — `#E3F2FD` background, `person_outline` icon centered (48×48dp), 24dp vertical padding
- All `TextInputLayout` fields switched to `OutlinedBox` style with start icons: person (name), phone (phone), email (email)
- Save button: full-width, primary blue, 8dp corner radius, 48dp height, white bold text

---

## 7. Add Appointment Screen (`activity_add_appointment.xml`)

- `MaterialToolbar` at top — "Add Appointment" title, back arrow, primary blue background
- Header banner — `#E3F2FD` background, `event` icon centered
- Patient selector: replace `Spinner` + `TextView` label with a `MaterialAutoCompleteTextView` inside an outlined `TextInputLayout` (start icon: person)
- Date/Time buttons: replace plain buttons with outlined `MaterialButton` with calendar/clock start icons, muted style
- Description: outlined `TextInputLayout` with notes start icon
- Save button: same style as Add Patient save button

---

## 8. Out of Scope

- Dark mode customization
- New features (search, filters, patient detail screen)
- Database or logic changes beyond the TabLayout listener in MainActivity