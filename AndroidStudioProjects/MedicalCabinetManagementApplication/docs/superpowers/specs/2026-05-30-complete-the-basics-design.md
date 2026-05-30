# Complete the Basics — Design Spec

**Date:** 2026-05-30
**Project:** MedicalCabinetManagementApplication (Android, Java, SQLite, Material 3)
**Scope:** Fill obvious functional gaps in the existing app: edit/delete, search, patient detail screen, date/time pickers, sort, empty states, confirm dialogs.

Out of scope (possible follow-ups): undo snackbars, multi-select, settings screen, dark-mode toggle, sort menu, medical-history fields, notifications, MVVM/Room migration.

## Goals

- Patients and appointments can be edited and deleted, not just added.
- Users can find a patient or appointment quickly via search.
- Tapping a patient opens a screen showing their info and their appointments.
- Date and time on appointments use native pickers, not free-text entry.
- Appointments display in chronological order (upcoming first).
- Lists never show a blank screen — empty states explain what to do.
- Destructive actions always confirm; patient deletion clearly states the cascade impact.

## Non-Goals

- No data-model schema change (column additions, new tables) in this upgrade.
- No architectural refactor: stays on Activities + SQLiteOpenHelper. No Fragments, ViewModel, Room, or Kotlin migration.
- No new patient fields beyond name/phone/email.
- No undo for deletes.

## Architecture Overview

The app keeps its current shape: `MainActivity` with a `TabLayout` switching one `RecyclerView` between patients and appointments; `AddPatientActivity` and `AddAppointmentActivity` for entry; `DatabaseHelper` as the SQLite gateway. This upgrade:

1. Adds methods to `DatabaseHelper` for read-one, update, delete, cascade delete, and per-patient queries.
2. Reuses the two existing "Add" activities as dual-mode add/edit activities via an `EXTRA_EDIT_ID` intent extra.
3. Adds one new `PatientDetailActivity` that shows patient info + their appointments.
4. Adds swipe-to-delete to every list via `ItemTouchHelper`.
5. Adds a `SearchView` to the main toolbar via a new menu resource.
6. Adds an empty-state include layout used in every list.
7. Replaces date/time `TextInputEditText`s with read-only fields that launch `MaterialDatePicker` / `MaterialTimePicker` on tap.

## Detailed Design

### 1. DatabaseHelper

No schema change. Added methods:

- `Patient getPatient(int id)` — returns null if not found.
- `Appointment getAppointment(int id)` — returns null if not found. Joins on patients to populate `patientName`.
- `int updatePatient(Patient p)` — returns rows affected.
- `int updateAppointment(Appointment a)` — returns rows affected.
- `int deleteAppointment(int id)` — returns rows affected.
- `int deletePatient(int id)` — runs a transaction: deletes from `appointments WHERE patient_id = id`, then from `patients WHERE id = id`. Returns rows affected on the patients delete.
- `List<Appointment> getAppointmentsForPatient(int patientId)` — same join shape as `getAllAppointments`, filtered + ordered by date, time ASC.
- `int countAppointmentsForPatient(int patientId)` — used in cascade confirm dialog message.

Read queries updated:

- `getAllPatients()`: `ORDER BY name COLLATE NOCASE ASC`.
- `getAllAppointments()`: `ORDER BY date ASC, time ASC`.

### 2. Add/Edit activities (reuse pattern)

Both `AddPatientActivity` and `AddAppointmentActivity` adopt this pattern:

- Read `int editId = getIntent().getIntExtra("EXTRA_EDIT_ID", -1)`.
- If `editId == -1`: ADD mode — current behavior. Toolbar title "Add Patient" / "Add Appointment". Save button "Save". On save, call `dbHelper.addPatient(...)` / `addAppointment(...)`.
- If `editId != -1`: EDIT mode. Fetch the record, pre-fill fields. Toolbar title becomes "Edit Patient" / "Edit Appointment". Save button label becomes "Update". On save, call `updatePatient` / `updateAppointment` with `id = editId`.

`AddAppointmentActivity` in edit mode pre-selects the patient in the autocomplete by name.

The string resources `title_add_patient`, `title_edit_patient`, `title_add_appointment`, `title_edit_appointment`, `action_save`, `action_update` are added to `strings.xml`.

### 3. PatientDetailActivity (new)

Layout `activity_patient_detail.xml`:

- `MaterialToolbar` with back arrow and overflow menu (Edit, Delete).
- Patient info card: large name, phone row (icon + value), email row (icon + value). Reuses existing `ic_phone`, `ic_email` drawables.
- Section header "Appointments".
- `RecyclerView` reusing `AppointmentAdapter` to list this patient's appointments only. Each item still shows date/time/description; patient-name field is hidden or empty since context is implicit.
- Empty-state include shown when the patient has no appointments: "No appointments for this patient yet."
- `FloatingActionButton` at bottom-end: opens `AddAppointmentActivity` pre-linked to this patient (`EXTRA_PATIENT_ID`).

Behavior:

- Launched from `MainActivity` when a patient row is tapped: `intent.putExtra("EXTRA_PATIENT_ID", patient.getId())`.
- `onResume()` reloads patient + appointments so edits reflect.
- Toolbar **Edit** → starts `AddPatientActivity` with `EXTRA_EDIT_ID`.
- Toolbar **Delete** → confirm dialog (see §6) → on confirm, calls `dbHelper.deletePatient(id)` and `finish()`s back to `MainActivity`.
- Tapping an appointment row in this list → opens `AddAppointmentActivity` in edit mode.
- Swipe-to-delete on each appointment row works the same as in §4.

### 4. Swipe-to-delete

Applied via `ItemTouchHelper.SimpleCallback(0, LEFT)` attached to:

- The main RecyclerView on `MainActivity` (works for both patients and appointments tabs — the callback dispatches based on which adapter is currently set).
- The appointments RecyclerView on `PatientDetailActivity`.

Visuals while swiping: red background drawable, white trash icon aligned right, drawn in `onChildDraw`. New drawable: `bg_swipe_delete.xml`, new icon: `ic_delete.xml` (white tint).

On swipe release:

1. Show confirm dialog (see §6).
2. **Cancel** → call `adapter.notifyItemChanged(position)` to spring the row back.
3. **Confirm** → call the appropriate `dbHelper.delete…(id)`, then reload the list (`updateUI()` or equivalent).

### 5. Search

- New menu resource `menu_main.xml`: one `SearchView` item with `app:actionViewClass="androidx.appcompat.widget.SearchView"` and `app:showAsAction="always|collapseActionView"`. Hint: "Search".
- `MainActivity.onCreateOptionsMenu` inflates it. `setOnQueryTextListener` calls `adapter.filter(query)` on text change.
- `PatientAdapter` and `AppointmentAdapter` each gain:
  - An internal `originalList` (full data) and `filteredList` (displayed).
  - `filter(String query)`: case-insensitive `contains` on patient name. For `AppointmentAdapter` additionally matches description.
- Switching tabs resets the search (collapse the SearchView, clear query) so each tab starts unfiltered.
- When the filtered list is empty *and* the original list is non-empty, the empty state shows "No matches for '<query>'." (different copy from the bare empty state).

### 6. Date & time pickers

In `activity_add_appointment.xml`:

- Date field and time field become `TextInputEditText` with `android:focusable="false"`, `android:clickable="true"`, `android:cursorVisible="false"`, `android:inputType="none"`.
- In `AddAppointmentActivity`:
  - Date field `OnClickListener` → `MaterialDatePicker.Builder.datePicker()…build()`; on positive selection, format with `SimpleDateFormat("yyyy-MM-dd", Locale.US)` and `setText` on the field. Initial selection = currently-shown value if present, else today.
  - Time field `OnClickListener` → `MaterialTimePicker.Builder()…setTimeFormat(CLOCK_24H)…build()`; on positive selection, format `"%02d:%02d"` and `setText`. Initial selection = currently-shown value if present, else current time.
- Storage format unchanged (`yyyy-MM-dd` and `HH:mm` as TEXT) — no migration needed.

### 7. Empty states

New include layout `layout_empty_state.xml`: a centered vertical `LinearLayout` with an `ImageView` (large tinted icon), a headline `TextView`, a subtext `TextView`. Visibility toggled in code.

Placement:

- `activity_main.xml`: empty-state included as a sibling of the RecyclerView; shown when the current adapter's filtered list is empty.
- `activity_patient_detail.xml`: same pattern for the appointments list.

Strings:

- `empty_patients_title` = "No patients yet"
- `empty_patients_subtitle` = "Tap + to add your first patient."
- `empty_appointments_title` = "No appointments yet"
- `empty_appointments_subtitle` = "Tap + to schedule one."
- `empty_patient_appointments` = "No appointments for this patient yet."
- `empty_search_format` = "No matches for \"%1$s\""

### 8. Confirm dialogs

Single helper on each Activity that needs deletes:

```
showConfirmDelete(title, message, onConfirm: Runnable, onCancel: Runnable)
```

Built with `MaterialAlertDialogBuilder`. Positive button "Delete" with destructive text color, negative button "Cancel". `onCancel` is used by swipe-to-delete to restore the row.

Patient cascade message uses `countAppointmentsForPatient(id)`:

- 0 appointments → "Delete Jane Doe?"
- 1 → "Delete Jane Doe? This will also delete their 1 appointment."
- N>1 → "Delete Jane Doe? This will also delete their N appointments."

## Data Flow

**Tap a patient row:**
`MainActivity.PatientAdapter.onClick` → starts `PatientDetailActivity` with `EXTRA_PATIENT_ID`.

**Tap an appointment row (either screen):**
→ starts `AddAppointmentActivity` with `EXTRA_EDIT_ID`. On finish, the caller's `onResume()` reloads.

**Tap FAB on MainActivity (patients tab):** → `AddPatientActivity` ADD mode.
**Tap FAB on MainActivity (appointments tab):** → `AddAppointmentActivity` ADD mode.
**Tap FAB on PatientDetailActivity:** → `AddAppointmentActivity` ADD mode with `EXTRA_PATIENT_ID` to pre-link.

**Swipe a row:** ItemTouchHelper → confirm dialog → delete or restore.

**Type in SearchView:** filters the current adapter's list in-memory; no DB calls.

## Files Changed

**Modified:**
- `app/src/main/java/.../DatabaseHelper.java`
- `app/src/main/java/.../MainActivity.java`
- `app/src/main/java/.../PatientAdapter.java`
- `app/src/main/java/.../AppointmentAdapter.java`
- `app/src/main/java/.../AddPatientActivity.java`
- `app/src/main/java/.../AddAppointmentActivity.java`
- `app/src/main/res/layout/activity_main.xml`
- `app/src/main/res/layout/activity_add_appointment.xml`
- `app/src/main/res/values/strings.xml`
- `app/src/main/AndroidManifest.xml` (register `PatientDetailActivity`)

**New:**
- `app/src/main/java/.../PatientDetailActivity.java`
- `app/src/main/res/layout/activity_patient_detail.xml`
- `app/src/main/res/layout/layout_empty_state.xml`
- `app/src/main/res/menu/menu_main.xml`
- `app/src/main/res/drawable/bg_swipe_delete.xml`
- `app/src/main/res/drawable/ic_delete.xml`

## Testing

Manual test checklist (no automated test infrastructure exists in this project):

- Add a patient → appears in list, sorted alphabetically.
- Tap patient → detail screen with patient info, empty appointments state visible.
- Add an appointment from detail screen → patient pre-selected.
- Add an appointment from main screen → date/time pickers open and write back correctly formatted values.
- Edit a patient via overflow menu → fields pre-filled, "Update" saves changes, returns to detail.
- Edit an appointment by tapping its row → patient pre-selected in dropdown, "Update" saves changes.
- Swipe a patient row → confirm dialog shows cascade count. Cancel restores row. Confirm deletes patient and their appointments; both tabs reflect.
- Swipe an appointment row → confirm dialog. Cancel restores. Confirm deletes only that appointment.
- Search patients tab → results filter as you type. Clear → full list returns. Empty result shows "No matches for X."
- Search appointments tab → matches against patient name and description.
- Switch tabs while searching → search clears.
- Appointments tab shows appointments ordered by date then time, earliest first.
- Empty states render correctly when DB is empty per list.

## Risks & Mitigations

- **`ItemTouchHelper` with a swappable adapter on `MainActivity`.** The callback must read the *currently set* adapter when handling a swipe, not a captured reference. Mitigation: dispatch on `recyclerView.getAdapter() instanceof PatientAdapter` inside `onSwiped`.
- **Cascade delete consistency.** Use `db.beginTransaction()` / `setTransactionSuccessful()` / `endTransaction()` to avoid leaving orphaned appointments if the second delete fails.
- **Search state on tab switch.** SearchView state must be cleared explicitly in the tab listener; otherwise the new adapter shows pre-filtered data.
- **Edit-mode autocomplete.** `AddAppointmentActivity` populates the patient dropdown asynchronously in some cases — ensure pre-selection runs after the adapter is set.