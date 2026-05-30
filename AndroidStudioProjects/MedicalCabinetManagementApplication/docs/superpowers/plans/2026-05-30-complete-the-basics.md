# Complete the Basics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add edit/delete, search, patient detail screen, sort, empty states, and confirm dialogs to the Medical Cabinet Management app, without changing the database schema or app architecture.

**Architecture:** Stay on Java + Activities + `SQLiteOpenHelper`. Reuse existing `AddPatientActivity` / `AddAppointmentActivity` as dual add-or-edit screens via an `EXTRA_EDIT_ID` intent extra. Add one new `PatientDetailActivity`. Swipe-to-delete via `ItemTouchHelper`. Filtering done in-adapter. No schema migration.

**Tech Stack:** Java 11, Android SDK 24-36, Material Components, SQLite, ConstraintLayout, RecyclerView.

**Notes that diverge from the spec (verified against actual code):**

- Date format stored is `d/M/yyyy` (e.g., `15/5/2026`), not ISO. We keep this format. `AppointmentAdapter` already parses it.
- Appointments cannot be sorted by `ORDER BY date` (strings don't sort chronologically in `d/M/yyyy`). Sort in Java after fetch via a `Comparator` that parses both date and time.
- Date/time pickers already exist (`DatePickerDialog` / `TimePickerDialog` launched from buttons). No picker replacement needed — only pre-population in edit mode.

---

## File Structure

**Modified:**
- `app/src/main/java/com/example/medicalcabinetmanagementapplication/DatabaseHelper.java` — add read-one / update / delete / cascade-delete / per-patient / count methods; alphabetize patients.
- `app/src/main/java/com/example/medicalcabinetmanagementapplication/MainActivity.java` — tap-row navigation, swipe-to-delete, empty state, SearchView, sort appointments in Java.
- `app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientAdapter.java` — click listener, filtering.
- `app/src/main/java/com/example/medicalcabinetmanagementapplication/AppointmentAdapter.java` — click listener, filtering.
- `app/src/main/java/com/example/medicalcabinetmanagementapplication/AddPatientActivity.java` — edit mode via `EXTRA_EDIT_ID`.
- `app/src/main/java/com/example/medicalcabinetmanagementapplication/AddAppointmentActivity.java` — edit mode via `EXTRA_EDIT_ID`; pre-link via `EXTRA_PATIENT_ID`.
- `app/src/main/res/layout/activity_main.xml` — include empty-state layout under RecyclerView.
- `app/src/main/res/values/strings.xml` — new strings for titles, actions, dialogs, empty states.
- `app/src/main/AndroidManifest.xml` — register `PatientDetailActivity`.

**New:**
- `app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientDetailActivity.java`
- `app/src/main/res/layout/activity_patient_detail.xml`
- `app/src/main/res/layout/layout_empty_state.xml`
- `app/src/main/res/menu/menu_main.xml`
- `app/src/main/res/drawable/bg_swipe_delete.xml`
- `app/src/main/res/drawable/ic_delete.xml`

---

## How to verify each task

This project has no unit/instrumentation tests configured for app code, so after each task we **build** and **manually verify** on emulator/device.

Build with: `./gradlew assembleDebug`
Install with: `./gradlew installDebug` (requires running emulator or attached device)

Each task ends with a manual-verify checklist.

---

## Task 1: Extend DatabaseHelper with read-one, update, delete, cascade delete, per-patient queries

**Files:**
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/DatabaseHelper.java`

- [ ] **Step 1: Open `DatabaseHelper.java` and replace its full contents with the version below.**

```java
package com.example.medicalcabinetmanagementapplication;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.ArrayList;
import java.util.List;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "MedicalCabinet.db";
    private static final int DATABASE_VERSION = 1;

    // Patient table
    private static final String TABLE_PATIENTS = "patients";
    private static final String COLUMN_PATIENT_ID = "id";
    private static final String COLUMN_PATIENT_NAME = "name";
    private static final String COLUMN_PATIENT_PHONE = "phone";
    private static final String COLUMN_PATIENT_EMAIL = "email";

    // Appointment table
    private static final String TABLE_APPOINTMENTS = "appointments";
    private static final String COLUMN_APP_ID = "id";
    private static final String COLUMN_APP_PATIENT_ID = "patient_id";
    private static final String COLUMN_APP_DATE = "date";
    private static final String COLUMN_APP_TIME = "time";
    private static final String COLUMN_APP_DESCRIPTION = "description";

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String CREATE_PATIENTS_TABLE = "CREATE TABLE " + TABLE_PATIENTS + "("
                + COLUMN_PATIENT_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + COLUMN_PATIENT_NAME + " TEXT,"
                + COLUMN_PATIENT_PHONE + " TEXT,"
                + COLUMN_PATIENT_EMAIL + " TEXT" + ")";
        db.execSQL(CREATE_PATIENTS_TABLE);

        String CREATE_APPOINTMENTS_TABLE = "CREATE TABLE " + TABLE_APPOINTMENTS + "("
                + COLUMN_APP_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + COLUMN_APP_PATIENT_ID + " INTEGER,"
                + COLUMN_APP_DATE + " TEXT,"
                + COLUMN_APP_TIME + " TEXT,"
                + COLUMN_APP_DESCRIPTION + " TEXT,"
                + "FOREIGN KEY(" + COLUMN_APP_PATIENT_ID + ") REFERENCES " + TABLE_PATIENTS + "(" + COLUMN_PATIENT_ID + ")" + ")";
        db.execSQL(CREATE_APPOINTMENTS_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_PATIENTS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_APPOINTMENTS);
        onCreate(db);
    }

    // ===== Patient CRUD =====

    public long addPatient(Patient patient) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_PATIENT_NAME, patient.getName());
        values.put(COLUMN_PATIENT_PHONE, patient.getPhone());
        values.put(COLUMN_PATIENT_EMAIL, patient.getEmail());
        long id = db.insert(TABLE_PATIENTS, null, values);
        db.close();
        return id;
    }

    public Patient getPatient(int id) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_PATIENTS, null,
                COLUMN_PATIENT_ID + "=?", new String[]{String.valueOf(id)},
                null, null, null);
        Patient patient = null;
        if (cursor.moveToFirst()) {
            patient = new Patient(
                    cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_ID)),
                    cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_NAME)),
                    cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_PHONE)),
                    cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_EMAIL))
            );
        }
        cursor.close();
        db.close();
        return patient;
    }

    public int updatePatient(Patient patient) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_PATIENT_NAME, patient.getName());
        values.put(COLUMN_PATIENT_PHONE, patient.getPhone());
        values.put(COLUMN_PATIENT_EMAIL, patient.getEmail());
        int rows = db.update(TABLE_PATIENTS, values,
                COLUMN_PATIENT_ID + "=?", new String[]{String.valueOf(patient.getId())});
        db.close();
        return rows;
    }

    /** Deletes the patient AND all of their appointments in a single transaction. */
    public int deletePatient(int id) {
        SQLiteDatabase db = this.getWritableDatabase();
        int rows;
        db.beginTransaction();
        try {
            db.delete(TABLE_APPOINTMENTS,
                    COLUMN_APP_PATIENT_ID + "=?", new String[]{String.valueOf(id)});
            rows = db.delete(TABLE_PATIENTS,
                    COLUMN_PATIENT_ID + "=?", new String[]{String.valueOf(id)});
            db.setTransactionSuccessful();
        } finally {
            db.endTransaction();
        }
        db.close();
        return rows;
    }

    public List<Patient> getAllPatients() {
        List<Patient> patientList = new ArrayList<>();
        String selectQuery = "SELECT * FROM " + TABLE_PATIENTS +
                " ORDER BY " + COLUMN_PATIENT_NAME + " COLLATE NOCASE ASC";
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);
        if (cursor.moveToFirst()) {
            do {
                Patient patient = new Patient(
                        cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_ID)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_NAME)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_PHONE)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_EMAIL))
                );
                patientList.add(patient);
            } while (cursor.moveToNext());
        }
        cursor.close();
        db.close();
        return patientList;
    }

    public int countAppointmentsForPatient(int patientId) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(
                "SELECT COUNT(*) FROM " + TABLE_APPOINTMENTS + " WHERE " + COLUMN_APP_PATIENT_ID + "=?",
                new String[]{String.valueOf(patientId)});
        int count = 0;
        if (cursor.moveToFirst()) count = cursor.getInt(0);
        cursor.close();
        db.close();
        return count;
    }

    // ===== Appointment CRUD =====

    public long addAppointment(Appointment appointment) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_APP_PATIENT_ID, appointment.getPatientId());
        values.put(COLUMN_APP_DATE, appointment.getDate());
        values.put(COLUMN_APP_TIME, appointment.getTime());
        values.put(COLUMN_APP_DESCRIPTION, appointment.getDescription());
        long id = db.insert(TABLE_APPOINTMENTS, null, values);
        db.close();
        return id;
    }

    public Appointment getAppointment(int id) {
        SQLiteDatabase db = this.getReadableDatabase();
        String selectQuery = "SELECT a.*, p." + COLUMN_PATIENT_NAME + " FROM " + TABLE_APPOINTMENTS + " a " +
                "JOIN " + TABLE_PATIENTS + " p ON a." + COLUMN_APP_PATIENT_ID + " = p." + COLUMN_PATIENT_ID + " " +
                "WHERE a." + COLUMN_APP_ID + "=?";
        Cursor cursor = db.rawQuery(selectQuery, new String[]{String.valueOf(id)});
        Appointment appointment = null;
        if (cursor.moveToFirst()) {
            appointment = new Appointment(
                    cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_APP_ID)),
                    cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_APP_PATIENT_ID)),
                    cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_DATE)),
                    cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_TIME)),
                    cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_DESCRIPTION))
            );
            appointment.setPatientName(cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_NAME)));
        }
        cursor.close();
        db.close();
        return appointment;
    }

    public int updateAppointment(Appointment appointment) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_APP_PATIENT_ID, appointment.getPatientId());
        values.put(COLUMN_APP_DATE, appointment.getDate());
        values.put(COLUMN_APP_TIME, appointment.getTime());
        values.put(COLUMN_APP_DESCRIPTION, appointment.getDescription());
        int rows = db.update(TABLE_APPOINTMENTS, values,
                COLUMN_APP_ID + "=?", new String[]{String.valueOf(appointment.getId())});
        db.close();
        return rows;
    }

    public int deleteAppointment(int id) {
        SQLiteDatabase db = this.getWritableDatabase();
        int rows = db.delete(TABLE_APPOINTMENTS,
                COLUMN_APP_ID + "=?", new String[]{String.valueOf(id)});
        db.close();
        return rows;
    }

    public List<Appointment> getAllAppointments() {
        List<Appointment> appointmentList = new ArrayList<>();
        String selectQuery = "SELECT a.*, p." + COLUMN_PATIENT_NAME + " FROM " + TABLE_APPOINTMENTS + " a " +
                "JOIN " + TABLE_PATIENTS + " p ON a." + COLUMN_APP_PATIENT_ID + " = p." + COLUMN_PATIENT_ID;
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);
        if (cursor.moveToFirst()) {
            do {
                Appointment appointment = new Appointment(
                        cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_APP_ID)),
                        cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_APP_PATIENT_ID)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_DATE)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_TIME)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_DESCRIPTION))
                );
                appointment.setPatientName(cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_NAME)));
                appointmentList.add(appointment);
            } while (cursor.moveToNext());
        }
        cursor.close();
        db.close();
        AppointmentSort.sortByDateTimeAsc(appointmentList);
        return appointmentList;
    }

    public List<Appointment> getAppointmentsForPatient(int patientId) {
        List<Appointment> appointmentList = new ArrayList<>();
        String selectQuery = "SELECT a.*, p." + COLUMN_PATIENT_NAME + " FROM " + TABLE_APPOINTMENTS + " a " +
                "JOIN " + TABLE_PATIENTS + " p ON a." + COLUMN_APP_PATIENT_ID + " = p." + COLUMN_PATIENT_ID + " " +
                "WHERE a." + COLUMN_APP_PATIENT_ID + "=?";
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, new String[]{String.valueOf(patientId)});
        if (cursor.moveToFirst()) {
            do {
                Appointment appointment = new Appointment(
                        cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_APP_ID)),
                        cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_APP_PATIENT_ID)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_DATE)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_TIME)),
                        cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_APP_DESCRIPTION))
                );
                appointment.setPatientName(cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PATIENT_NAME)));
                appointmentList.add(appointment);
            } while (cursor.moveToNext());
        }
        cursor.close();
        db.close();
        AppointmentSort.sortByDateTimeAsc(appointmentList);
        return appointmentList;
    }
}
```

- [ ] **Step 2: Create `AppointmentSort.java` — the comparator that sorts `d/M/yyyy HH:mm` strings chronologically.**

Create `app/src/main/java/com/example/medicalcabinetmanagementapplication/AppointmentSort.java`:

```java
package com.example.medicalcabinetmanagementapplication;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/** Sorts appointments chronologically. Storage format is d/M/yyyy and HH:mm. */
final class AppointmentSort {

    private AppointmentSort() {}

    static void sortByDateTimeAsc(List<Appointment> list) {
        Collections.sort(list, new Comparator<Appointment>() {
            private final SimpleDateFormat fmt = new SimpleDateFormat("d/M/yyyy HH:mm", Locale.US);

            @Override
            public int compare(Appointment a, Appointment b) {
                long ta = parse(a.getDate(), a.getTime());
                long tb = parse(b.getDate(), b.getTime());
                return Long.compare(ta, tb);
            }

            private long parse(String date, String time) {
                if (date == null || date.isEmpty()) return Long.MAX_VALUE;
                String t = (time == null || time.isEmpty()) ? "00:00" : time;
                try {
                    Date d = fmt.parse(date + " " + t);
                    return d == null ? Long.MAX_VALUE : d.getTime();
                } catch (ParseException e) {
                    return Long.MAX_VALUE;
                }
            }
        });
    }
}
```

- [ ] **Step 3: Build to verify it compiles.**

Run: `./gradlew assembleDebug`
Expected: `BUILD SUCCESSFUL`. No new behavior visible yet — the methods are added but not called.

- [ ] **Step 4: Commit.**

```bash
git add app/src/main/java/com/example/medicalcabinetmanagementapplication/DatabaseHelper.java app/src/main/java/com/example/medicalcabinetmanagementapplication/AppointmentSort.java
git commit -m "feat(db): add update/delete/cascade/per-patient methods and appointment sort"
```

---

## Task 2: Shared resources — strings, drawables, menu, empty-state layout

**Files:**
- Modify: `app/src/main/res/values/strings.xml`
- Create: `app/src/main/res/drawable/bg_swipe_delete.xml`
- Create: `app/src/main/res/drawable/ic_delete.xml`
- Create: `app/src/main/res/menu/menu_main.xml`
- Create: `app/src/main/res/layout/layout_empty_state.xml`

- [ ] **Step 1: Replace `app/src/main/res/values/strings.xml`.**

```xml
<resources>
    <string name="app_name">Medical Cabinet Management Application</string>

    <!-- Titles -->
    <string name="title_add_patient">Add Patient</string>
    <string name="title_edit_patient">Edit Patient</string>
    <string name="title_add_appointment">Add Appointment</string>
    <string name="title_edit_appointment">Edit Appointment</string>
    <string name="title_patient_detail">Patient</string>

    <!-- Actions -->
    <string name="action_save">Save</string>
    <string name="action_update">Update</string>
    <string name="action_delete">Delete</string>
    <string name="action_cancel">Cancel</string>
    <string name="action_edit">Edit</string>
    <string name="action_search">Search</string>

    <!-- Confirm delete -->
    <string name="confirm_delete_patient_none">Delete %1$s?</string>
    <string name="confirm_delete_patient_one">Delete %1$s? This will also delete their 1 appointment.</string>
    <string name="confirm_delete_patient_many">Delete %1$s? This will also delete their %2$d appointments.</string>
    <string name="confirm_delete_appointment">Delete this appointment?</string>

    <!-- Empty states -->
    <string name="empty_patients_title">No patients yet</string>
    <string name="empty_patients_subtitle">Tap + to add your first patient.</string>
    <string name="empty_appointments_title">No appointments yet</string>
    <string name="empty_appointments_subtitle">Tap + to schedule one.</string>
    <string name="empty_patient_appointments">No appointments for this patient yet.</string>
    <string name="empty_search_format">No matches for "%1$s"</string>

    <!-- Patient detail -->
    <string name="section_appointments">Appointments</string>

    <!-- Errors / validation -->
    <string name="error_fill_name_phone">Please fill in name and phone</string>
    <string name="error_no_patients">Please add a patient first</string>
    <string name="error_select_date_time">Please select date and time</string>
</resources>
```

- [ ] **Step 2: Create `app/src/main/res/drawable/bg_swipe_delete.xml`.**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="#E53935" />
</shape>
```

- [ ] **Step 3: Create `app/src/main/res/drawable/ic_delete.xml`.**

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24"
    android:tint="#FFFFFF">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M6,19c0,1.1 0.9,2 2,2h8c1.1,0 2,-0.9 2,-2L18,7L6,7v12zM19,4h-3.5l-1,-1h-5l-1,1L5,4v2h14L19,4z"/>
</vector>
```

- [ ] **Step 4: Create `app/src/main/res/menu/menu_main.xml`.**

```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">
    <item
        android:id="@+id/action_search"
        android:title="@string/action_search"
        android:icon="@android:drawable/ic_menu_search"
        app:actionViewClass="androidx.appcompat.widget.SearchView"
        app:showAsAction="always|collapseActionView" />
</menu>
```

- [ ] **Step 5: Create `app/src/main/res/layout/layout_empty_state.xml`.**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/emptyState"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical"
    android:padding="32dp"
    android:visibility="gone">

    <ImageView
        android:id="@+id/emptyIcon"
        android:layout_width="96dp"
        android:layout_height="96dp"
        android:alpha="0.5"
        app:srcCompat="@drawable/ic_person"
        app:tint="@color/colorSecondary" />

    <TextView
        android:id="@+id/emptyTitle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="@string/empty_patients_title"
        android:textColor="@color/colorOnSurface"
        android:textSize="18sp"
        android:textStyle="bold" />

    <TextView
        android:id="@+id/emptySubtitle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:gravity="center"
        android:text="@string/empty_patients_subtitle"
        android:textColor="@color/colorSecondary"
        android:textSize="14sp" />

</LinearLayout>
```

- [ ] **Step 6: Build to verify resources compile.**

Run: `./gradlew assembleDebug`
Expected: `BUILD SUCCESSFUL`.

- [ ] **Step 7: Commit.**

```bash
git add app/src/main/res/values/strings.xml app/src/main/res/drawable/bg_swipe_delete.xml app/src/main/res/drawable/ic_delete.xml app/src/main/res/menu/menu_main.xml app/src/main/res/layout/layout_empty_state.xml
git commit -m "feat(res): add strings, swipe-delete drawables, search menu, empty-state layout"
```

---

## Task 3: Edit mode in AddPatientActivity

**Files:**
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/AddPatientActivity.java`

Intent contract:
- `EXTRA_EDIT_ID` (int, optional): when present and `> 0`, screen is in EDIT mode.

- [ ] **Step 1: Replace `AddPatientActivity.java`.**

```java
package com.example.medicalcabinetmanagementapplication;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

public class AddPatientActivity extends AppCompatActivity {

    public static final String EXTRA_EDIT_ID = "EXTRA_EDIT_ID";

    private TextInputEditText editTextName, editTextPhone, editTextEmail;
    private DatabaseHelper dbHelper;
    private int editId = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_patient);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar ab = getSupportActionBar();
        if (ab != null) ab.setDisplayHomeAsUpEnabled(true);

        dbHelper = new DatabaseHelper(this);

        editTextName = findViewById(R.id.editTextName);
        editTextPhone = findViewById(R.id.editTextPhone);
        editTextEmail = findViewById(R.id.editTextEmail);

        MaterialButton saveButton = findViewById(R.id.buttonSave);
        editId = getIntent().getIntExtra(EXTRA_EDIT_ID, -1);

        if (editId > 0) {
            Patient existing = dbHelper.getPatient(editId);
            if (existing == null) {
                Toast.makeText(this, "Patient not found", Toast.LENGTH_SHORT).show();
                finish();
                return;
            }
            toolbar.setTitle(R.string.title_edit_patient);
            saveButton.setText(R.string.action_update);
            editTextName.setText(existing.getName());
            editTextPhone.setText(existing.getPhone());
            editTextEmail.setText(existing.getEmail());
        } else {
            toolbar.setTitle(R.string.title_add_patient);
            saveButton.setText(R.string.action_save);
        }

        saveButton.setOnClickListener(v -> savePatient());
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void savePatient() {
        String name = editTextName.getText() == null ? "" : editTextName.getText().toString().trim();
        String phone = editTextPhone.getText() == null ? "" : editTextPhone.getText().toString().trim();
        String email = editTextEmail.getText() == null ? "" : editTextEmail.getText().toString().trim();

        if (name.isEmpty() || phone.isEmpty()) {
            Toast.makeText(this, R.string.error_fill_name_phone, Toast.LENGTH_SHORT).show();
            return;
        }

        if (editId > 0) {
            Patient patient = new Patient(editId, name, phone, email);
            int rows = dbHelper.updatePatient(patient);
            if (rows > 0) {
                Toast.makeText(this, "Patient updated", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(this, "Error updating patient", Toast.LENGTH_SHORT).show();
            }
        } else {
            Patient patient = new Patient(name, phone, email);
            long id = dbHelper.addPatient(patient);
            if (id != -1) {
                Toast.makeText(this, "Patient saved successfully", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(this, "Error saving patient", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
```

- [ ] **Step 2: Build to confirm it compiles.**

Run: `./gradlew assembleDebug`
Expected: `BUILD SUCCESSFUL`.

- [ ] **Step 3: Manual verify (install and run).**

Run: `./gradlew installDebug`
Steps:
- Open the app, tap + on Patients tab → "Add Patient" title, "Save" button, blank fields. Add a test patient.
- (Edit mode isn't reachable from the UI yet — verified later in Task 7. Skip for now.)

- [ ] **Step 4: Commit.**

```bash
git add app/src/main/java/com/example/medicalcabinetmanagementapplication/AddPatientActivity.java
git commit -m "feat(patient): support edit mode via EXTRA_EDIT_ID"
```

---

## Task 4: Edit mode + pre-link patient in AddAppointmentActivity

**Files:**
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/AddAppointmentActivity.java`

Intent contract:
- `EXTRA_EDIT_ID` (int, optional): if present and `> 0`, edit existing appointment.
- `EXTRA_PATIENT_ID` (int, optional): if present and `> 0` AND not in edit mode, pre-select that patient in the dropdown.

- [ ] **Step 1: Replace `AddAppointmentActivity.java`.**

```java
package com.example.medicalcabinetmanagementapplication;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.MaterialAutoCompleteTextView;
import com.google.android.material.textfield.TextInputEditText;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class AddAppointmentActivity extends AppCompatActivity {

    public static final String EXTRA_EDIT_ID = "EXTRA_EDIT_ID";
    public static final String EXTRA_PATIENT_ID = "EXTRA_PATIENT_ID";

    private MaterialAutoCompleteTextView autoCompletePatient;
    private MaterialButton buttonDate, buttonTime;
    private TextInputEditText editTextDescription;
    private DatabaseHelper dbHelper;
    private List<Patient> patientList;
    private String selectedDate = "", selectedTime = "";
    private int selectedPatientIndex = 0;
    private int editId = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_appointment);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar ab = getSupportActionBar();
        if (ab != null) ab.setDisplayHomeAsUpEnabled(true);

        dbHelper = new DatabaseHelper(this);
        patientList = dbHelper.getAllPatients();

        autoCompletePatient = findViewById(R.id.autoCompletePatient);
        buttonDate = findViewById(R.id.buttonDate);
        buttonTime = findViewById(R.id.buttonTime);
        editTextDescription = findViewById(R.id.editTextDescription);
        MaterialButton saveButton = findViewById(R.id.buttonSaveAppointment);

        setupPatientDropdown();

        editId = getIntent().getIntExtra(EXTRA_EDIT_ID, -1);
        int preselectPatientId = getIntent().getIntExtra(EXTRA_PATIENT_ID, -1);

        if (editId > 0) {
            Appointment existing = dbHelper.getAppointment(editId);
            if (existing == null) {
                Toast.makeText(this, "Appointment not found", Toast.LENGTH_SHORT).show();
                finish();
                return;
            }
            toolbar.setTitle(R.string.title_edit_appointment);
            saveButton.setText(R.string.action_update);
            preselectPatientByName(existing.getPatientName());
            selectedDate = existing.getDate() == null ? "" : existing.getDate();
            selectedTime = existing.getTime() == null ? "" : existing.getTime();
            if (!selectedDate.isEmpty()) buttonDate.setText(selectedDate);
            if (!selectedTime.isEmpty()) buttonTime.setText(selectedTime);
            editTextDescription.setText(existing.getDescription());
        } else {
            toolbar.setTitle(R.string.title_add_appointment);
            saveButton.setText(R.string.action_save);
            if (preselectPatientId > 0) {
                preselectPatientById(preselectPatientId);
            }
        }

        buttonDate.setOnClickListener(v -> showDatePicker());
        buttonTime.setOnClickListener(v -> showTimePicker());
        saveButton.setOnClickListener(v -> saveAppointment());
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void setupPatientDropdown() {
        List<String> names = new ArrayList<>();
        for (Patient p : patientList) names.add(p.getName());
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, names);
        autoCompletePatient.setAdapter(adapter);
        if (!names.isEmpty()) {
            autoCompletePatient.setText(names.get(0), false);
            selectedPatientIndex = 0;
        }
        autoCompletePatient.setOnItemClickListener((parent, view, position, id) -> selectedPatientIndex = position);
    }

    private void preselectPatientById(int patientId) {
        for (int i = 0; i < patientList.size(); i++) {
            if (patientList.get(i).getId() == patientId) {
                autoCompletePatient.setText(patientList.get(i).getName(), false);
                selectedPatientIndex = i;
                return;
            }
        }
    }

    private void preselectPatientByName(String name) {
        if (name == null) return;
        for (int i = 0; i < patientList.size(); i++) {
            if (name.equals(patientList.get(i).getName())) {
                autoCompletePatient.setText(name, false);
                selectedPatientIndex = i;
                return;
            }
        }
    }

    private void showDatePicker() {
        Calendar c = Calendar.getInstance();
        // Initialize from existing date if present
        if (!selectedDate.isEmpty()) {
            String[] parts = selectedDate.split("/");
            if (parts.length == 3) {
                try {
                    c.set(Calendar.DAY_OF_MONTH, Integer.parseInt(parts[0]));
                    c.set(Calendar.MONTH, Integer.parseInt(parts[1]) - 1);
                    c.set(Calendar.YEAR, Integer.parseInt(parts[2]));
                } catch (NumberFormatException ignored) {}
            }
        }
        new DatePickerDialog(this, (view, year, month, dayOfMonth) -> {
            selectedDate = dayOfMonth + "/" + (month + 1) + "/" + year;
            buttonDate.setText(selectedDate);
        }, c.get(Calendar.YEAR), c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH)).show();
    }

    private void showTimePicker() {
        Calendar c = Calendar.getInstance();
        if (!selectedTime.isEmpty()) {
            String[] parts = selectedTime.split(":");
            if (parts.length == 2) {
                try {
                    c.set(Calendar.HOUR_OF_DAY, Integer.parseInt(parts[0]));
                    c.set(Calendar.MINUTE, Integer.parseInt(parts[1]));
                } catch (NumberFormatException ignored) {}
            }
        }
        new TimePickerDialog(this, (view, hourOfDay, minute) -> {
            selectedTime = String.format("%02d:%02d", hourOfDay, minute);
            buttonTime.setText(selectedTime);
        }, c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE), true).show();
    }

    private void saveAppointment() {
        if (patientList.isEmpty()) {
            Toast.makeText(this, R.string.error_no_patients, Toast.LENGTH_SHORT).show();
            return;
        }
        if (selectedDate.isEmpty() || selectedTime.isEmpty()) {
            Toast.makeText(this, R.string.error_select_date_time, Toast.LENGTH_SHORT).show();
            return;
        }

        int patientId = patientList.get(selectedPatientIndex).getId();
        String desc = editTextDescription.getText() == null ? "" : editTextDescription.getText().toString();

        if (editId > 0) {
            Appointment app = new Appointment(editId, patientId, selectedDate, selectedTime, desc);
            int rows = dbHelper.updateAppointment(app);
            if (rows > 0) {
                Toast.makeText(this, "Appointment updated", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(this, "Error updating appointment", Toast.LENGTH_SHORT).show();
            }
        } else {
            Appointment app = new Appointment(patientId, selectedDate, selectedTime, desc);
            long id = dbHelper.addAppointment(app);
            if (id != -1) {
                Toast.makeText(this, "Appointment saved", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(this, "Error saving appointment", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
```

- [ ] **Step 2: Build to confirm it compiles.**

Run: `./gradlew assembleDebug`
Expected: `BUILD SUCCESSFUL`.

- [ ] **Step 3: Manual verify.**

- Add an appointment with date 5/6/2026 and another with 1/1/2026.
- Reopen the app and check the Appointments tab: they should be in chronological order (1/1/2026 before 5/6/2026). This validates Task 1's sort.

- [ ] **Step 4: Commit.**

```bash
git add app/src/main/java/com/example/medicalcabinetmanagementapplication/AddAppointmentActivity.java
git commit -m "feat(appointment): support edit mode and pre-link patient"
```

---

## Task 5: PatientDetailActivity — new screen + layout + manifest registration

**Files:**
- Create: `app/src/main/res/layout/activity_patient_detail.xml`
- Create: `app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientDetailActivity.java`
- Modify: `app/src/main/AndroidManifest.xml`

Intent contract:
- `EXTRA_PATIENT_ID` (int, required): the patient to show.

- [ ] **Step 1: Create `app/src/main/res/layout/activity_patient_detail.xml`.**

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/colorBackground">

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@color/colorPrimary"
        app:elevation="4dp">

        <com.google.android.material.appbar.MaterialToolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="@color/colorPrimary"
            app:menu="@menu/menu_patient_detail"
            app:navigationIconTint="@android:color/white"
            app:title="@string/title_patient_detail"
            app:titleTextColor="@android:color/white" />
    </com.google.android.material.appbar.AppBarLayout>

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">

        <com.google.android.material.card.MaterialCardView
            android:id="@+id/patientCard"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_margin="12dp"
            app:cardCornerRadius="12dp"
            app:cardElevation="3dp"
            app:layout_constraintTop_toTopOf="parent">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <TextView
                    android:id="@+id/textPatientName"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:textColor="@color/colorOnSurface"
                    android:textSize="20sp"
                    android:textStyle="bold"
                    tools:text="Jane Doe"
                    xmlns:tools="http://schemas.android.com/tools" />

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:gravity="center_vertical"
                    android:orientation="horizontal">

                    <ImageView
                        android:layout_width="16dp"
                        android:layout_height="16dp"
                        app:srcCompat="@drawable/ic_phone"
                        app:tint="@color/colorSecondary" />

                    <TextView
                        android:id="@+id/textPatientPhone"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_marginStart="8dp"
                        android:textColor="@color/colorSecondary"
                        android:textSize="14sp" />
                </LinearLayout>

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="4dp"
                    android:gravity="center_vertical"
                    android:orientation="horizontal">

                    <ImageView
                        android:layout_width="16dp"
                        android:layout_height="16dp"
                        app:srcCompat="@drawable/ic_email"
                        app:tint="@color/colorSecondary" />

                    <TextView
                        android:id="@+id/textPatientEmail"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_marginStart="8dp"
                        android:textColor="@color/colorSecondary"
                        android:textSize="14sp" />
                </LinearLayout>
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <TextView
            android:id="@+id/sectionHeader"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginHorizontal="16dp"
            android:layout_marginTop="8dp"
            android:text="@string/section_appointments"
            android:textColor="@color/colorOnSurface"
            android:textSize="16sp"
            android:textStyle="bold"
            app:layout_constraintTop_toBottomOf="@id/patientCard" />

        <FrameLayout
            android:id="@+id/listContainer"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintTop_toBottomOf="@id/sectionHeader">

            <androidx.recyclerview.widget.RecyclerView
                android:id="@+id/recyclerAppointments"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:clipToPadding="false"
                android:paddingBottom="88dp" />

            <include
                android:id="@+id/emptyStateInclude"
                layout="@layout/layout_empty_state" />
        </FrameLayout>
    </androidx.constraintlayout.widget.ConstraintLayout>

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fabAddAppointment"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_margin="16dp"
        android:contentDescription="Add appointment"
        app:backgroundTint="@color/colorAccent"
        app:srcCompat="@android:drawable/ic_input_add"
        app:tint="@android:color/white" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

- [ ] **Step 2: Create `app/src/main/res/menu/menu_patient_detail.xml`.**

```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">
    <item
        android:id="@+id/action_edit"
        android:title="@string/action_edit"
        app:showAsAction="never" />
    <item
        android:id="@+id/action_delete"
        android:title="@string/action_delete"
        app:showAsAction="never" />
</menu>
```

- [ ] **Step 3: Create `app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientDetailActivity.java`.**

```java
package com.example.medicalcabinetmanagementapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

public class PatientDetailActivity extends AppCompatActivity {

    public static final String EXTRA_PATIENT_ID = "EXTRA_PATIENT_ID";

    private DatabaseHelper dbHelper;
    private int patientId = -1;
    private TextView textName, textPhone, textEmail;
    private RecyclerView recyclerView;
    private View emptyState;
    private AppointmentAdapter appointmentAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_patient_detail);

        patientId = getIntent().getIntExtra(EXTRA_PATIENT_ID, -1);
        if (patientId <= 0) { finish(); return; }

        dbHelper = new DatabaseHelper(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        toolbar.setNavigationIcon(androidx.appcompat.R.drawable.abc_ic_ab_back_material);
        toolbar.setNavigationOnClickListener(v -> finish());
        toolbar.setOnMenuItemClickListener(this::onToolbarMenuClick);

        textName = findViewById(R.id.textPatientName);
        textPhone = findViewById(R.id.textPatientPhone);
        textEmail = findViewById(R.id.textPatientEmail);

        recyclerView = findViewById(R.id.recyclerAppointments);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        emptyState = findViewById(R.id.emptyStateInclude);
        TextView emptyTitle = emptyState.findViewById(R.id.emptyTitle);
        TextView emptySubtitle = emptyState.findViewById(R.id.emptySubtitle);
        emptyTitle.setText(R.string.empty_patient_appointments);
        emptySubtitle.setVisibility(View.GONE);

        FloatingActionButton fab = findViewById(R.id.fabAddAppointment);
        fab.setOnClickListener(v -> {
            Intent i = new Intent(this, AddAppointmentActivity.class);
            i.putExtra(AddAppointmentActivity.EXTRA_PATIENT_ID, patientId);
            startActivity(i);
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        Patient patient = dbHelper.getPatient(patientId);
        if (patient == null) {
            Toast.makeText(this, "Patient not found", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        textName.setText(patient.getName());
        textPhone.setText(patient.getPhone() == null ? "" : patient.getPhone());
        textEmail.setText(patient.getEmail() == null ? "" : patient.getEmail());

        List<Appointment> appointments = dbHelper.getAppointmentsForPatient(patientId);
        if (appointmentAdapter == null) {
            appointmentAdapter = new AppointmentAdapter(appointments);
            recyclerView.setAdapter(appointmentAdapter);
        } else {
            appointmentAdapter.updateData(appointments);
        }
        emptyState.setVisibility(appointments.isEmpty() ? View.VISIBLE : View.GONE);
        recyclerView.setVisibility(appointments.isEmpty() ? View.GONE : View.VISIBLE);
    }

    private boolean onToolbarMenuClick(@NonNull MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_edit) {
            Intent i = new Intent(this, AddPatientActivity.class);
            i.putExtra(AddPatientActivity.EXTRA_EDIT_ID, patientId);
            startActivity(i);
            return true;
        } else if (id == R.id.action_delete) {
            confirmDeletePatient();
            return true;
        }
        return false;
    }

    private void confirmDeletePatient() {
        Patient patient = dbHelper.getPatient(patientId);
        if (patient == null) { finish(); return; }
        int count = dbHelper.countAppointmentsForPatient(patientId);
        String message;
        if (count == 0) {
            message = getString(R.string.confirm_delete_patient_none, patient.getName());
        } else if (count == 1) {
            message = getString(R.string.confirm_delete_patient_one, patient.getName());
        } else {
            message = getString(R.string.confirm_delete_patient_many, patient.getName(), count);
        }
        new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.action_delete)
                .setMessage(message)
                .setNegativeButton(R.string.action_cancel, null)
                .setPositiveButton(R.string.action_delete, (d, w) -> {
                    dbHelper.deletePatient(patientId);
                    Toast.makeText(this, "Patient deleted", Toast.LENGTH_SHORT).show();
                    finish();
                })
                .show();
    }
}
```

- [ ] **Step 4: Register `PatientDetailActivity` in `AndroidManifest.xml`.**

In `app/src/main/AndroidManifest.xml`, add this `<activity>` element inside `<application>`, after the existing `AddAppointmentActivity` entry:

```xml
        <activity
            android:name=".PatientDetailActivity"
            android:label="@string/title_patient_detail"
            android:parentActivityName=".MainActivity" />
```

- [ ] **Step 5: Build to verify it compiles.**

Run: `./gradlew assembleDebug`
Expected: `BUILD SUCCESSFUL`.

- [ ] **Step 6: Commit.**

```bash
git add app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientDetailActivity.java app/src/main/res/layout/activity_patient_detail.xml app/src/main/res/menu/menu_patient_detail.xml app/src/main/AndroidManifest.xml
git commit -m "feat(patient-detail): new screen with patient info, appointments, edit/delete"
```

---

## Task 6: Add empty-state include + click listener wiring in PatientAdapter and AppointmentAdapter, plus filtering

**Files:**
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientAdapter.java`
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/AppointmentAdapter.java`

- [ ] **Step 1: Replace `PatientAdapter.java`.**

```java
package com.example.medicalcabinetmanagementapplication;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class PatientAdapter extends RecyclerView.Adapter<PatientAdapter.PatientViewHolder> {

    public interface OnPatientClickListener {
        void onPatientClick(Patient patient);
    }

    private List<Patient> originalList;
    private List<Patient> filteredList;
    private final OnPatientClickListener listener;
    private String currentQuery = "";

    public PatientAdapter(List<Patient> patientList, OnPatientClickListener listener) {
        this.originalList = new ArrayList<>(patientList);
        this.filteredList = new ArrayList<>(patientList);
        this.listener = listener;
    }

    @NonNull
    @Override
    public PatientViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_patient, parent, false);
        return new PatientViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PatientViewHolder holder, int position) {
        Patient patient = filteredList.get(position);
        holder.textViewName.setText(patient.getName());
        holder.textViewPhone.setText(patient.getPhone());
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onPatientClick(patient);
        });
    }

    @Override
    public int getItemCount() {
        return filteredList.size();
    }

    public void updateData(List<Patient> newPatients) {
        this.originalList = new ArrayList<>(newPatients);
        applyFilter();
    }

    public void filter(String query) {
        this.currentQuery = query == null ? "" : query;
        applyFilter();
    }

    public Patient getItemAt(int position) {
        return filteredList.get(position);
    }

    public boolean hasOriginalData() {
        return !originalList.isEmpty();
    }

    public String getCurrentQuery() {
        return currentQuery;
    }

    private void applyFilter() {
        if (currentQuery.isEmpty()) {
            filteredList = new ArrayList<>(originalList);
        } else {
            String q = currentQuery.toLowerCase(Locale.ROOT);
            List<Patient> result = new ArrayList<>();
            for (Patient p : originalList) {
                String name = p.getName() == null ? "" : p.getName().toLowerCase(Locale.ROOT);
                if (name.contains(q)) result.add(p);
            }
            filteredList = result;
        }
        notifyDataSetChanged();
    }

    static class PatientViewHolder extends RecyclerView.ViewHolder {
        TextView textViewName, textViewPhone;

        public PatientViewHolder(@NonNull View itemView) {
            super(itemView);
            textViewName = itemView.findViewById(R.id.textViewName);
            textViewPhone = itemView.findViewById(R.id.textViewPhone);
        }
    }
}
```

- [ ] **Step 2: Replace `AppointmentAdapter.java`.**

```java
package com.example.medicalcabinetmanagementapplication;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class AppointmentAdapter extends RecyclerView.Adapter<AppointmentAdapter.AppointmentViewHolder> {

    public interface OnAppointmentClickListener {
        void onAppointmentClick(Appointment appointment);
    }

    private static final String[] MONTHS = {
        "JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"
    };

    private List<Appointment> originalList;
    private List<Appointment> filteredList;
    private final OnAppointmentClickListener listener;
    private final boolean showPatientName;
    private String currentQuery = "";

    public AppointmentAdapter(List<Appointment> appointmentList) {
        this(appointmentList, null, true);
    }

    public AppointmentAdapter(List<Appointment> appointmentList,
                              OnAppointmentClickListener listener,
                              boolean showPatientName) {
        this.originalList = new ArrayList<>(appointmentList);
        this.filteredList = new ArrayList<>(appointmentList);
        this.listener = listener;
        this.showPatientName = showPatientName;
    }

    @NonNull
    @Override
    public AppointmentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_appointment, parent, false);
        return new AppointmentViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AppointmentViewHolder holder, int position) {
        Appointment appointment = filteredList.get(position);
        if (showPatientName) {
            holder.textViewPatientName.setText(appointment.getPatientName() == null ? "" : appointment.getPatientName());
            holder.textViewPatientName.setVisibility(View.VISIBLE);
        } else {
            holder.textViewPatientName.setVisibility(View.GONE);
        }
        String date = appointment.getDate() == null ? "" : appointment.getDate();
        String time = appointment.getTime() == null ? "" : appointment.getTime();
        holder.textViewDateTime.setText(date + "  " + time);
        holder.textViewDescription.setText(appointment.getDescription() == null ? "" : appointment.getDescription());

        String[] parts = date.split("/");
        if (parts.length >= 2) {
            holder.textViewDay.setText(parts[0]);
            try {
                int monthIdx = Integer.parseInt(parts[1]) - 1;
                holder.textViewMonth.setText((monthIdx >= 0 && monthIdx < 12) ? MONTHS[monthIdx] : "");
            } catch (NumberFormatException e) {
                holder.textViewMonth.setText("");
            }
        } else {
            holder.textViewDay.setText("");
            holder.textViewMonth.setText("");
        }

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onAppointmentClick(appointment);
        });
    }

    @Override
    public int getItemCount() {
        return filteredList.size();
    }

    public void updateData(List<Appointment> newAppointments) {
        this.originalList = new ArrayList<>(newAppointments);
        applyFilter();
    }

    public void filter(String query) {
        this.currentQuery = query == null ? "" : query;
        applyFilter();
    }

    public Appointment getItemAt(int position) {
        return filteredList.get(position);
    }

    public boolean hasOriginalData() {
        return !originalList.isEmpty();
    }

    public String getCurrentQuery() {
        return currentQuery;
    }

    private void applyFilter() {
        if (currentQuery.isEmpty()) {
            filteredList = new ArrayList<>(originalList);
        } else {
            String q = currentQuery.toLowerCase(Locale.ROOT);
            List<Appointment> result = new ArrayList<>();
            for (Appointment a : originalList) {
                String name = a.getPatientName() == null ? "" : a.getPatientName().toLowerCase(Locale.ROOT);
                String desc = a.getDescription() == null ? "" : a.getDescription().toLowerCase(Locale.ROOT);
                if (name.contains(q) || desc.contains(q)) result.add(a);
            }
            filteredList = result;
        }
        notifyDataSetChanged();
    }

    static class AppointmentViewHolder extends RecyclerView.ViewHolder {
        TextView textViewPatientName, textViewDateTime, textViewDescription;
        TextView textViewDay, textViewMonth;

        public AppointmentViewHolder(@NonNull View itemView) {
            super(itemView);
            textViewPatientName = itemView.findViewById(R.id.textViewPatientName);
            textViewDateTime = itemView.findViewById(R.id.textViewDateTime);
            textViewDescription = itemView.findViewById(R.id.textViewDescription);
            textViewDay = itemView.findViewById(R.id.textViewDay);
            textViewMonth = itemView.findViewById(R.id.textViewMonth);
        }
    }
}
```

- [ ] **Step 3: Build to verify it compiles.**

Run: `./gradlew assembleDebug`
Expected: **BUILD FAILS** — `MainActivity` and `PatientDetailActivity` constructors of `PatientAdapter`/`AppointmentAdapter` changed. We fix MainActivity in the next task, and PatientDetailActivity here.

- [ ] **Step 4: Update `PatientDetailActivity` to use the new `AppointmentAdapter` constructor and click listener.**

In `PatientDetailActivity.onResume()`, replace the adapter init block:

```java
        if (appointmentAdapter == null) {
            appointmentAdapter = new AppointmentAdapter(appointments,
                    appointment -> {
                        Intent i = new Intent(this, AddAppointmentActivity.class);
                        i.putExtra(AddAppointmentActivity.EXTRA_EDIT_ID, appointment.getId());
                        startActivity(i);
                    },
                    false);
            recyclerView.setAdapter(appointmentAdapter);
        } else {
            appointmentAdapter.updateData(appointments);
        }
```

- [ ] **Step 5: Build again — it still fails on MainActivity, which is expected. Move on to Task 7.**

Run: `./gradlew assembleDebug`
Expected: build fails with `PatientAdapter`/`AppointmentAdapter` constructor errors in `MainActivity.java`. We fix those in Task 7.

- [ ] **Step 6: Stage these changes but don't commit yet — combine with Task 7 to avoid a broken commit.**

Run: `git add -p` and stage `PatientAdapter.java`, `AppointmentAdapter.java`, `PatientDetailActivity.java` (or just `git add` those three files). Do not commit.

---

## Task 7: MainActivity — click navigation, empty state, sort, search, swipe-to-delete

**Files:**
- Modify: `app/src/main/res/layout/activity_main.xml`
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/MainActivity.java`

- [ ] **Step 1: Modify `app/src/main/res/layout/activity_main.xml` — wrap the RecyclerView and empty-state include in a `FrameLayout`.**

Replace the existing `<androidx.recyclerview.widget.RecyclerView ... />` block (lines 40-47) with:

```xml
    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">

        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/recyclerViewMain"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:background="@color/colorBackground"
            android:clipToPadding="false"
            android:paddingBottom="80dp" />

        <include
            android:id="@+id/emptyStateInclude"
            layout="@layout/layout_empty_state" />
    </FrameLayout>
```

- [ ] **Step 2: Replace `MainActivity.java`.**

```java
package com.example.medicalcabinetmanagementapplication;

import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.MenuItemCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.tabs.TabLayout;

import java.util.List;

public class MainActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private PatientAdapter patientAdapter;
    private AppointmentAdapter appointmentAdapter;
    private DatabaseHelper dbHelper;
    private boolean showingPatients = true;

    private TabLayout tabLayout;
    private FloatingActionButton fabAdd;
    private View emptyState;
    private TextView emptyTitle, emptySubtitle;
    private SearchView searchView;
    private android.view.MenuItem searchMenuItem;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        View mainView = findViewById(R.id.main);
        if (mainView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(mainView, (v, insets) -> {
                Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
                return insets;
            });
        }

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        dbHelper = new DatabaseHelper(this);

        tabLayout = findViewById(R.id.tabLayout);
        recyclerView = findViewById(R.id.recyclerViewMain);
        fabAdd = findViewById(R.id.fabAdd);
        emptyState = findViewById(R.id.emptyStateInclude);
        emptyTitle = emptyState.findViewById(R.id.emptyTitle);
        emptySubtitle = emptyState.findViewById(R.id.emptySubtitle);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        tabLayout.addTab(tabLayout.newTab().setText("Patients").setIcon(R.drawable.ic_person));
        tabLayout.addTab(tabLayout.newTab().setText("Appointments").setIcon(R.drawable.ic_event));

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                showingPatients = (tab.getPosition() == 0);
                if (searchMenuItem != null && searchMenuItem.isActionViewExpanded()) {
                    searchMenuItem.collapseActionView();
                }
                updateUI();
            }
            @Override public void onTabUnselected(TabLayout.Tab tab) {}
            @Override public void onTabReselected(TabLayout.Tab tab) {}
        });

        fabAdd.setOnClickListener(v -> {
            if (showingPatients) {
                startActivity(new Intent(MainActivity.this, AddPatientActivity.class));
            } else {
                startActivity(new Intent(MainActivity.this, AddAppointmentActivity.class));
            }
        });

        new ItemTouchHelper(swipeCallback).attachToRecyclerView(recyclerView);

        updateUI();
    }

    @Override
    public boolean onCreateOptionsMenu(@NonNull Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        searchMenuItem = menu.findItem(R.id.action_search);
        searchView = (SearchView) MenuItemCompat.getActionView(searchMenuItem);
        searchView.setQueryHint(getString(R.string.action_search));
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override public boolean onQueryTextSubmit(String query) { return false; }
            @Override
            public boolean onQueryTextChange(String newText) {
                if (showingPatients && patientAdapter != null) {
                    patientAdapter.filter(newText);
                    updateEmptyState();
                } else if (!showingPatients && appointmentAdapter != null) {
                    appointmentAdapter.filter(newText);
                    updateEmptyState();
                }
                return true;
            }
        });
        MenuItemCompat.setOnActionExpandListener(searchMenuItem, new MenuItemCompat.OnActionExpandListener() {
            @Override public boolean onMenuItemActionExpand(@NonNull android.view.MenuItem item) { return true; }
            @Override public boolean onMenuItemActionCollapse(@NonNull android.view.MenuItem item) {
                if (patientAdapter != null) patientAdapter.filter("");
                if (appointmentAdapter != null) appointmentAdapter.filter("");
                updateEmptyState();
                return true;
            }
        });
        return true;
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateUI();
    }

    private void updateUI() {
        if (showingPatients) {
            List<Patient> patients = dbHelper.getAllPatients();
            if (patientAdapter == null) {
                patientAdapter = new PatientAdapter(patients, patient -> {
                    Intent i = new Intent(MainActivity.this, PatientDetailActivity.class);
                    i.putExtra(PatientDetailActivity.EXTRA_PATIENT_ID, patient.getId());
                    startActivity(i);
                });
            } else {
                patientAdapter.updateData(patients);
            }
            recyclerView.setAdapter(patientAdapter);
        } else {
            List<Appointment> appointments = dbHelper.getAllAppointments();
            if (appointmentAdapter == null) {
                appointmentAdapter = new AppointmentAdapter(appointments,
                        appointment -> {
                            Intent i = new Intent(MainActivity.this, AddAppointmentActivity.class);
                            i.putExtra(AddAppointmentActivity.EXTRA_EDIT_ID, appointment.getId());
                            startActivity(i);
                        },
                        true);
            } else {
                appointmentAdapter.updateData(appointments);
            }
            recyclerView.setAdapter(appointmentAdapter);
        }
        updateEmptyState();
    }

    private void updateEmptyState() {
        boolean isEmpty;
        boolean hasData;
        String query;
        if (showingPatients && patientAdapter != null) {
            isEmpty = patientAdapter.getItemCount() == 0;
            hasData = patientAdapter.hasOriginalData();
            query = patientAdapter.getCurrentQuery();
        } else if (!showingPatients && appointmentAdapter != null) {
            isEmpty = appointmentAdapter.getItemCount() == 0;
            hasData = appointmentAdapter.hasOriginalData();
            query = appointmentAdapter.getCurrentQuery();
        } else {
            isEmpty = true; hasData = false; query = "";
        }

        if (!isEmpty) {
            emptyState.setVisibility(View.GONE);
            return;
        }
        emptyState.setVisibility(View.VISIBLE);
        if (hasData && !query.isEmpty()) {
            emptyTitle.setText(getString(R.string.empty_search_format, query));
            emptySubtitle.setVisibility(View.GONE);
        } else if (showingPatients) {
            emptyTitle.setText(R.string.empty_patients_title);
            emptySubtitle.setText(R.string.empty_patients_subtitle);
            emptySubtitle.setVisibility(View.VISIBLE);
        } else {
            emptyTitle.setText(R.string.empty_appointments_title);
            emptySubtitle.setText(R.string.empty_appointments_subtitle);
            emptySubtitle.setVisibility(View.VISIBLE);
        }
    }

    private final ItemTouchHelper.SimpleCallback swipeCallback = new ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.LEFT) {

        private final ColorDrawable background = new ColorDrawable(0xFFE53935);
        private final Drawable icon = ContextCompat.getDrawable(MainActivity.this, R.drawable.ic_delete);
        private final int iconMargin = 32;

        @Override
        public boolean onMove(@NonNull RecyclerView rv, @NonNull RecyclerView.ViewHolder vh, @NonNull RecyclerView.ViewHolder t) {
            return false;
        }

        @Override
        public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
            int position = viewHolder.getAdapterPosition();
            if (showingPatients) {
                Patient patient = patientAdapter.getItemAt(position);
                confirmDeletePatient(patient, position);
            } else {
                Appointment appointment = appointmentAdapter.getItemAt(position);
                confirmDeleteAppointment(appointment, position);
            }
        }

        @Override
        public void onChildDraw(@NonNull Canvas c, @NonNull RecyclerView rv,
                                @NonNull RecyclerView.ViewHolder vh,
                                float dX, float dY, int actionState, boolean isCurrentlyActive) {
            View itemView = vh.itemView;
            background.setBounds(itemView.getRight() + (int) dX, itemView.getTop(),
                    itemView.getRight(), itemView.getBottom());
            background.draw(c);
            if (icon != null) {
                int iconTop = itemView.getTop() + (itemView.getHeight() - icon.getIntrinsicHeight()) / 2;
                int iconBottom = iconTop + icon.getIntrinsicHeight();
                int iconRight = itemView.getRight() - iconMargin;
                int iconLeft = iconRight - icon.getIntrinsicWidth();
                icon.setBounds(iconLeft, iconTop, iconRight, iconBottom);
                icon.draw(c);
            }
            super.onChildDraw(c, rv, vh, dX, dY, actionState, isCurrentlyActive);
        }
    };

    private void confirmDeletePatient(Patient patient, int position) {
        int count = dbHelper.countAppointmentsForPatient(patient.getId());
        String message;
        if (count == 0) {
            message = getString(R.string.confirm_delete_patient_none, patient.getName());
        } else if (count == 1) {
            message = getString(R.string.confirm_delete_patient_one, patient.getName());
        } else {
            message = getString(R.string.confirm_delete_patient_many, patient.getName(), count);
        }
        new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.action_delete)
                .setMessage(message)
                .setNegativeButton(R.string.action_cancel, (d, w) -> patientAdapter.notifyItemChanged(position))
                .setOnCancelListener(d -> patientAdapter.notifyItemChanged(position))
                .setPositiveButton(R.string.action_delete, (d, w) -> {
                    dbHelper.deletePatient(patient.getId());
                    updateUI();
                })
                .show();
    }

    private void confirmDeleteAppointment(Appointment appointment, int position) {
        new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.action_delete)
                .setMessage(R.string.confirm_delete_appointment)
                .setNegativeButton(R.string.action_cancel, (d, w) -> appointmentAdapter.notifyItemChanged(position))
                .setOnCancelListener(d -> appointmentAdapter.notifyItemChanged(position))
                .setPositiveButton(R.string.action_delete, (d, w) -> {
                    dbHelper.deleteAppointment(appointment.getId());
                    updateUI();
                })
                .show();
    }
}
```

- [ ] **Step 3: Build to verify everything now compiles.**

Run: `./gradlew assembleDebug`
Expected: `BUILD SUCCESSFUL`. The Task 6 + Task 7 changes are now consistent.

- [ ] **Step 4: Install and manually verify the end-to-end app.**

Run: `./gradlew installDebug`
Verification checklist (work through it on the device):
- Fresh launch with empty DB → Patients tab shows "No patients yet" empty state. Appointments tab shows "No appointments yet."
- Tap + → AddPatient. Add three patients (out of alphabetical order). They appear sorted A-Z.
- Tap a patient row → PatientDetailActivity opens with name/phone/email and "No appointments for this patient yet."
- Tap FAB on detail → AddAppointment with that patient pre-selected. Add an appointment. Back to detail → it shows. Back to main → Appointments tab shows it with the patient's name.
- Add a second appointment for a different patient on an earlier date → Appointments tab shows them in chronological order (earlier date first).
- In Patients tab, swipe left on a patient row → red background with trash icon visible → confirm dialog. Cancel → row springs back. Confirm → patient and their appointments disappear. Appointments tab confirms cascade.
- In Appointments tab, swipe left on an appointment row → confirm. Confirm → only that appointment disappears.
- Tap the search icon in the toolbar (Patients tab) → type part of a name → list filters. Clear → list returns. Type something that matches nothing → "No matches for "xxx"" empty state.
- Switch to Appointments tab while search is open → search collapses, full list returns.
- In Appointments tab, search by description text → filters. Search by patient name → filters.
- In Patient detail, tap overflow → Edit → AddPatient opens in Edit mode with fields filled and "Update" button. Change phone, tap Update → detail screen reflects.
- In Patient detail, tap overflow → Delete with N appointments → dialog message reads "Delete <name>? This will also delete their N appointments." Confirm → back to main, patient and their appointments are gone.
- Tap an appointment row anywhere → AddAppointment opens in Edit mode with patient/date/time/description pre-filled and "Update" button.

- [ ] **Step 5: Commit Task 6 + Task 7 changes together.**

```bash
git add app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientAdapter.java app/src/main/java/com/example/medicalcabinetmanagementapplication/AppointmentAdapter.java app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientDetailActivity.java app/src/main/java/com/example/medicalcabinetmanagementapplication/MainActivity.java app/src/main/res/layout/activity_main.xml
git commit -m "feat(main): tap-to-detail, swipe-to-delete, search, empty states, click handlers"
```

---

## Task 8: Swipe-to-delete on PatientDetailActivity appointment list

**Files:**
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientDetailActivity.java`

- [ ] **Step 1: In `PatientDetailActivity`, attach an `ItemTouchHelper` to the appointments RecyclerView.**

At the top of the class, add the field:

```java
    private boolean swipeHelperAttached = false;
```

At the end of `onCreate(...)`, after `setOnClickListener` for the FAB, add:

```java
        attachSwipeToDelete();
```

Then add these methods at the end of the class:

```java
    private void attachSwipeToDelete() {
        if (swipeHelperAttached) return;
        swipeHelperAttached = true;
        new androidx.recyclerview.widget.ItemTouchHelper(
                new androidx.recyclerview.widget.ItemTouchHelper.SimpleCallback(
                        0, androidx.recyclerview.widget.ItemTouchHelper.LEFT) {

                    private final android.graphics.drawable.ColorDrawable background =
                            new android.graphics.drawable.ColorDrawable(0xFFE53935);
                    private final android.graphics.drawable.Drawable icon =
                            androidx.core.content.ContextCompat.getDrawable(
                                    PatientDetailActivity.this, R.drawable.ic_delete);

                    @Override
                    public boolean onMove(@NonNull androidx.recyclerview.widget.RecyclerView rv,
                                          @NonNull androidx.recyclerview.widget.RecyclerView.ViewHolder vh,
                                          @NonNull androidx.recyclerview.widget.RecyclerView.ViewHolder t) {
                        return false;
                    }

                    @Override
                    public void onSwiped(@NonNull androidx.recyclerview.widget.RecyclerView.ViewHolder viewHolder, int direction) {
                        int pos = viewHolder.getAdapterPosition();
                        Appointment a = appointmentAdapter.getItemAt(pos);
                        confirmDeleteAppointment(a, pos);
                    }

                    @Override
                    public void onChildDraw(@NonNull android.graphics.Canvas c,
                                            @NonNull androidx.recyclerview.widget.RecyclerView rv,
                                            @NonNull androidx.recyclerview.widget.RecyclerView.ViewHolder vh,
                                            float dX, float dY, int actionState, boolean isCurrentlyActive) {
                        View itemView = vh.itemView;
                        background.setBounds(itemView.getRight() + (int) dX, itemView.getTop(),
                                itemView.getRight(), itemView.getBottom());
                        background.draw(c);
                        if (icon != null) {
                            int iconTop = itemView.getTop() + (itemView.getHeight() - icon.getIntrinsicHeight()) / 2;
                            int iconBottom = iconTop + icon.getIntrinsicHeight();
                            int iconRight = itemView.getRight() - 32;
                            int iconLeft = iconRight - icon.getIntrinsicWidth();
                            icon.setBounds(iconLeft, iconTop, iconRight, iconBottom);
                            icon.draw(c);
                        }
                        super.onChildDraw(c, rv, vh, dX, dY, actionState, isCurrentlyActive);
                    }
                }).attachToRecyclerView(recyclerView);
    }

    private void confirmDeleteAppointment(Appointment appointment, int position) {
        new com.google.android.material.dialog.MaterialAlertDialogBuilder(this)
                .setTitle(R.string.action_delete)
                .setMessage(R.string.confirm_delete_appointment)
                .setNegativeButton(R.string.action_cancel, (d, w) -> appointmentAdapter.notifyItemChanged(position))
                .setOnCancelListener(d -> appointmentAdapter.notifyItemChanged(position))
                .setPositiveButton(R.string.action_delete, (d, w) -> {
                    dbHelper.deleteAppointment(appointment.getId());
                    List<Appointment> remaining = dbHelper.getAppointmentsForPatient(patientId);
                    appointmentAdapter.updateData(remaining);
                    emptyState.setVisibility(remaining.isEmpty() ? View.VISIBLE : View.GONE);
                    recyclerView.setVisibility(remaining.isEmpty() ? View.GONE : View.VISIBLE);
                })
                .show();
    }
```

- [ ] **Step 2: Build to verify it compiles.**

Run: `./gradlew assembleDebug`
Expected: `BUILD SUCCESSFUL`.

- [ ] **Step 3: Manual verify.**

- Open a patient with appointments.
- Swipe an appointment left → red background with icon → confirm dialog.
- Cancel → row restores.
- Confirm → appointment removed from this list and from the main Appointments tab.

- [ ] **Step 4: Commit.**

```bash
git add app/src/main/java/com/example/medicalcabinetmanagementapplication/PatientDetailActivity.java
git commit -m "feat(patient-detail): swipe-to-delete appointments"
```

---

## Self-Review Notes (already incorporated above)

- **Spec coverage:** Every section of the spec maps to a task: DB methods → Task 1; strings/menu/empty state/drawables → Task 2; patient edit mode → Task 3; appointment edit + pre-link → Task 4; PatientDetailActivity → Task 5; adapter click + filter → Task 6; MainActivity wiring (tap, swipe, search, empty state, sort surface) → Task 7; detail-screen swipe → Task 8.
- **Spec divergence resolved:**
  - Date format is `d/M/yyyy`, not ISO — keep existing format, sort in Java via `AppointmentSort` (Task 1).
  - Pickers already exist as `DatePickerDialog`/`TimePickerDialog`; Task 4 only pre-populates them in edit mode rather than replacing them.
- **Type consistency:** `PatientAdapter(List, OnPatientClickListener)` is the only public constructor used (Task 6, Task 7). `AppointmentAdapter` keeps the single-arg constructor for back-compat but the 3-arg variant is what every call site uses. `EXTRA_EDIT_ID` and `EXTRA_PATIENT_ID` are declared as constants on the activities that own them and referenced by name everywhere.
- **No placeholders:** every step shows the actual code or command. The only intentional cross-task dependency is the deliberate broken state at the end of Task 6 → fixed at the end of Task 7, called out explicitly.