# Medical Cabinet UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the bare-bones Medical Cabinet app into a clean, clinical Android UI using a blue/white palette, MaterialToolbar, TabLayout, redesigned cards, and outlined form fields — no functional changes.

**Architecture:** Pure XML layout rewrites plus minimal Java wiring changes (TabLayout listener in MainActivity, AutoComplete dropdown in AddAppointmentActivity, toolbar back-navigation in both form activities). No database or business logic changes.

**Tech Stack:** Android Views (Java), Material Components 3 (`libs.material`), ConstraintLayout, CoordinatorLayout (transitive via Material dependency)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `app/src/main/res/values/colors.xml` | Modify | Define clinical blue palette |
| `app/src/main/res/values/themes.xml` | Modify | Wire palette to Material3 theme attributes |
| `app/src/main/res/drawable/ic_person.xml` | Create | Person vector icon |
| `app/src/main/res/drawable/ic_phone.xml` | Create | Phone vector icon |
| `app/src/main/res/drawable/ic_email.xml` | Create | Email vector icon |
| `app/src/main/res/drawable/ic_event.xml` | Create | Calendar event vector icon |
| `app/src/main/res/drawable/ic_access_time.xml` | Create | Clock vector icon |
| `app/src/main/res/drawable/ic_notes.xml` | Create | Notes vector icon |
| `app/src/main/res/drawable/circle_primary_container.xml` | Create | Circular background for patient avatar |
| `app/src/main/res/drawable/bg_date_badge.xml` | Create | Rounded-rect background for appointment date badge |
| `app/src/main/res/layout/activity_main.xml` | Modify | CoordinatorLayout + AppBarLayout + TabLayout |
| `app/src/main/java/.../MainActivity.java` | Modify | Replace button listeners with TabLayout listener |
| `app/src/main/res/layout/item_patient.xml` | Modify | Card with circular avatar |
| `app/src/main/res/layout/item_appointment.xml` | Modify | Card with date badge + left border strip |
| `app/src/main/java/.../AppointmentAdapter.java` | Modify | Populate new day/month badge views |
| `app/src/main/res/layout/activity_add_patient.xml` | Modify | Toolbar + header banner + outlined inputs |
| `app/src/main/java/.../AddPatientActivity.java` | Modify | Toolbar back-navigation setup |
| `app/src/main/res/layout/activity_add_appointment.xml` | Modify | Toolbar + header banner + AutoComplete + outlined inputs |
| `app/src/main/java/.../AddAppointmentActivity.java` | Modify | Replace Spinner with MaterialAutoCompleteTextView |

---

## Task 1: Color Palette & Theme

**Files:**
- Modify: `app/src/main/res/values/colors.xml`
- Modify: `app/src/main/res/values/themes.xml`

- [ ] **Step 1: Replace colors.xml**

Replace the entire file content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
    <color name="colorPrimary">#1565C0</color>
    <color name="colorPrimaryContainer">#E3F2FD</color>
    <color name="colorSecondary">#607D8B</color>
    <color name="colorOnSurface">#1A1A2E</color>
    <color name="colorSurface">#FFFFFF</color>
    <color name="colorBackground">#F8FAFB</color>
    <color name="colorAccent">#29B6F6</color>
</resources>
```

- [ ] **Step 2: Update themes.xml to wire palette into Material3**

Replace the entire file content:

```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Base.Theme.MedicalCabinetManagementApplication" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorOnPrimary">@android:color/white</item>
        <item name="colorPrimaryContainer">@color/colorPrimaryContainer</item>
        <item name="colorSecondary">@color/colorSecondary</item>
        <item name="colorSurface">@color/colorSurface</item>
        <item name="colorOnSurface">@color/colorOnSurface</item>
        <item name="android:colorBackground">@color/colorBackground</item>
    </style>

    <style name="Theme.MedicalCabinetManagementApplication" parent="Base.Theme.MedicalCabinetManagementApplication" />
</resources>
```

- [ ] **Step 3: Build and verify**

In Android Studio: **Build > Make Project**. Expect zero errors. The app background color will shift to off-white on next run.

- [ ] **Step 4: Commit**

```bash
git add app/src/main/res/values/colors.xml app/src/main/res/values/themes.xml
git commit -m "feat: add clinical blue color palette and Material3 theme wiring"
```

---

## Task 2: Icon & Shape Drawables

**Files:**
- Create: `app/src/main/res/drawable/ic_person.xml`
- Create: `app/src/main/res/drawable/ic_phone.xml`
- Create: `app/src/main/res/drawable/ic_email.xml`
- Create: `app/src/main/res/drawable/ic_event.xml`
- Create: `app/src/main/res/drawable/ic_access_time.xml`
- Create: `app/src/main/res/drawable/ic_notes.xml`
- Create: `app/src/main/res/drawable/circle_primary_container.xml`
- Create: `app/src/main/res/drawable/bg_date_badge.xml`

- [ ] **Step 1: Create ic_person.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M12,12c2.21,0 4,-1.79 4,-4s-1.79,-4 -4,-4 -4,1.79 -4,4 1.79,4 4,4zM12,14c-2.67,0 -8,1.34 -8,4v2h16v-2c0,-2.66 -5.33,-4 -8,-4z" />
</vector>
```

- [ ] **Step 2: Create ic_phone.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M6.62,10.79c1.44,2.83 3.76,5.14 6.59,6.59l2.2,-2.2c0.27,-0.27 0.67,-0.36 1.02,-0.24 1.12,0.37 2.33,0.57 3.57,0.57 0.55,0 1,0.45 1,1V20c0,0.55 -0.45,1 -1,1 -9.39,0 -17,-7.61 -17,-17 0,-0.55 0.45,-1 1,-1h3.5c0.55,0 1,0.45 1,1 0,1.25 0.2,2.45 0.57,3.57 0.11,0.35 0.03,0.74 -0.24,1.02l-2.2,2.2z" />
</vector>
```

- [ ] **Step 3: Create ic_email.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M20,4H4c-1.1,0 -1.99,0.9 -1.99,2L2,18c0,1.1 0.9,2 2,2h16c1.1,0 2,-0.9 2,-2V6c0,-1.1 -0.9,-2 -2,-2zM20,8l-8,5 -8,-5V6l8,5 8,-5v2z" />
</vector>
```

- [ ] **Step 4: Create ic_event.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M17,12h-5v5h5v-5zM16,1v2H8V1H6v2H5c-1.11,0 -1.99,0.9 -1.99,2L3,19c0,1.1 0.89,2 2,2h14c1.1,0 2,-0.9 2,-2V5c0,-1.1 -0.9,-2 -2,-2h-1V1h-2zM19,19H5V8h14v11z" />
</vector>
```

- [ ] **Step 5: Create ic_access_time.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M11.99,2C6.47,2 2,6.48 2,12s4.47,10 9.99,10C17.52,22 22,17.52 22,12S17.52,2 11.99,2zM12,20c-4.42,0 -8,-3.58 -8,-8s3.58,-8 8,-8 8,3.58 8,8 -3.58,8 -8,8zM12.5,7H11v6l5.25,3.15 0.75,-1.23 -4.5,-2.67z" />
</vector>
```

- [ ] **Step 6: Create ic_notes.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M21,11.01L3,11v2h18v-2zM3,16h12v2H3zM21,6H3v2.01L21,8z" />
</vector>
```

- [ ] **Step 7: Create circle_primary_container.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="@color/colorPrimaryContainer" />
</shape>
```

- [ ] **Step 8: Create bg_date_badge.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/colorPrimaryContainer" />
    <corners android:radius="8dp" />
</shape>
```

- [ ] **Step 9: Build and verify**

**Build > Make Project** — expect zero errors.

- [ ] **Step 10: Commit**

```bash
git add app/src/main/res/drawable/
git commit -m "feat: add vector icons and shape drawables for UI overhaul"
```

---

## Task 3: Main Screen Layout & Java

**Files:**
- Modify: `app/src/main/res/layout/activity_main.xml`
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/MainActivity.java`

- [ ] **Step 1: Replace activity_main.xml**

The root changes from `ConstraintLayout` to `CoordinatorLayout` (available transitively via `libs.material`). The two `Button` views are removed and replaced with `AppBarLayout` + `MaterialToolbar` + `TabLayout`.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/colorBackground"
    tools:context=".MainActivity">

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
            app:title="Medical Cabinet"
            app:titleTextColor="@android:color/white" />

        <com.google.android.material.tabs.TabLayout
            android:id="@+id/tabLayout"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="@color/colorPrimary"
            app:tabIconTint="@android:color/white"
            app:tabIndicatorColor="@color/colorAccent"
            app:tabIndicatorFullWidth="false"
            app:tabMode="fixed"
            app:tabSelectedTextColor="@android:color/white"
            app:tabTextColor="#B3FFFFFF" />

    </com.google.android.material.appbar.AppBarLayout>

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recyclerViewMain"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="@color/colorBackground"
        android:clipToPadding="false"
        android:paddingBottom="80dp"
        app:layout_behavior="@string/appbar_scrolling_view_behavior" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fabAdd"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_margin="16dp"
        android:clickable="true"
        android:contentDescription="Add"
        android:focusable="true"
        app:backgroundTint="@color/colorAccent"
        app:srcCompat="@android:drawable/ic_input_add"
        app:tint="@android:color/white" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

- [ ] **Step 2: Replace MainActivity.java**

Key changes: remove `Button` fields and click listeners, add `TabLayout` field wired with `OnTabSelectedListener`. The `updateUI()` method body is unchanged.

```java
package com.example.medicalcabinetmanagementapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.activity.EdgeToEdge;

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

        dbHelper = new DatabaseHelper(this);

        tabLayout = findViewById(R.id.tabLayout);
        recyclerView = findViewById(R.id.recyclerViewMain);
        fabAdd = findViewById(R.id.fabAdd);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        tabLayout.addTab(tabLayout.newTab().setText("Patients").setIcon(R.drawable.ic_person));
        tabLayout.addTab(tabLayout.newTab().setText("Appointments").setIcon(R.drawable.ic_event));

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                showingPatients = (tab.getPosition() == 0);
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

        updateUI();
    }

    private void updateUI() {
        if (showingPatients) {
            List<Patient> patients = dbHelper.getAllPatients();
            if (patientAdapter == null) {
                patientAdapter = new PatientAdapter(patients);
            } else {
                patientAdapter.updateData(patients);
            }
            recyclerView.setAdapter(patientAdapter);
        } else {
            List<Appointment> appointments = dbHelper.getAllAppointments();
            if (appointmentAdapter == null) {
                appointmentAdapter = new AppointmentAdapter(appointments);
            } else {
                appointmentAdapter.updateData(appointments);
            }
            recyclerView.setAdapter(appointmentAdapter);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateUI();
    }
}
```

- [ ] **Step 3: Build and verify**

**Build > Make Project** — expect zero errors. Run on emulator: the main screen should show a blue toolbar titled "Medical Cabinet" and two icon tabs ("Patients", "Appointments"). Tapping tabs switches the list.

- [ ] **Step 4: Commit**

```bash
git add app/src/main/res/layout/activity_main.xml \
        app/src/main/java/com/example/medicalcabinetmanagementapplication/MainActivity.java
git commit -m "feat: replace button tabs with MaterialToolbar + TabLayout on main screen"
```

---

## Task 4: Patient List Item Card

**Files:**
- Modify: `app/src/main/res/layout/item_patient.xml`

No Java changes — `PatientAdapter` already binds `textViewName` and `textViewPhone` by ID, both IDs are preserved.

- [ ] **Step 1: Replace item_patient.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginHorizontal="12dp"
    android:layout_marginVertical="6dp"
    app:cardCornerRadius="12dp"
    app:cardElevation="3dp"
    app:strokeColor="@color/colorPrimaryContainer"
    app:strokeWidth="1dp">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:padding="16dp">

        <FrameLayout
            android:id="@+id/avatarFrame"
            android:layout_width="44dp"
            android:layout_height="44dp"
            android:background="@drawable/circle_primary_container"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent">

            <ImageView
                android:layout_width="24dp"
                android:layout_height="24dp"
                android:layout_gravity="center"
                app:srcCompat="@drawable/ic_person"
                app:tint="@color/colorPrimary" />
        </FrameLayout>

        <TextView
            android:id="@+id/textViewName"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="14dp"
            android:text="Patient Name"
            android:textColor="@color/colorOnSurface"
            android:textSize="16sp"
            android:textStyle="bold"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toEndOf="@id/avatarFrame"
            app:layout_constraintTop_toTopOf="parent" />

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="14dp"
            android:layout_marginTop="4dp"
            android:gravity="center_vertical"
            android:orientation="horizontal"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toEndOf="@id/avatarFrame"
            app:layout_constraintTop_toBottomOf="@id/textViewName">

            <ImageView
                android:layout_width="14dp"
                android:layout_height="14dp"
                app:srcCompat="@drawable/ic_phone"
                app:tint="@color/colorSecondary" />

            <TextView
                android:id="@+id/textViewPhone"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginStart="4dp"
                android:text="Phone Number"
                android:textColor="@color/colorSecondary"
                android:textSize="14sp" />
        </LinearLayout>

    </androidx.constraintlayout.widget.ConstraintLayout>
</com.google.android.material.card.MaterialCardView>
```

- [ ] **Step 2: Build and verify**

**Build > Make Project** — zero errors. Run on emulator with at least one patient in the DB: each patient row shows a circular blue-tinted avatar on the left, bold name, and phone with a small phone icon.

- [ ] **Step 3: Commit**

```bash
git add app/src/main/res/layout/item_patient.xml
git commit -m "feat: redesign patient list item with circular avatar and icon row"
```

---

## Task 5: Appointment List Item Card & Adapter

**Files:**
- Modify: `app/src/main/res/layout/item_appointment.xml`
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/AppointmentAdapter.java`

The adapter gains two new ViewHolder fields (`textViewDay`, `textViewMonth`) and parses the stored date string (format: `"d/M/yyyy"`, e.g. `"15/5/2026"`) to populate the date badge.

- [ ] **Step 1: Replace item_appointment.xml**

The left border strip uses a `View` constrained top-to-top + bottom-to-bottom of the outer `ConstraintLayout`, so it fills the card height regardless of content.

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginHorizontal="12dp"
    android:layout_marginVertical="6dp"
    app:cardCornerRadius="12dp"
    app:cardElevation="3dp"
    app:strokeColor="@color/colorPrimaryContainer"
    app:strokeWidth="1dp">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:minHeight="80dp">

        <View
            android:id="@+id/leftBorder"
            android:layout_width="4dp"
            android:layout_height="0dp"
            android:background="@color/colorPrimary"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

        <LinearLayout
            android:id="@+id/dateBadge"
            android:layout_width="52dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="12dp"
            android:layout_marginTop="12dp"
            android:layout_marginBottom="12dp"
            android:background="@drawable/bg_date_badge"
            android:gravity="center"
            android:orientation="vertical"
            android:padding="6dp"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toEndOf="@id/leftBorder"
            app:layout_constraintTop_toTopOf="parent">

            <TextView
                android:id="@+id/textViewDay"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="15"
                android:textColor="@color/colorPrimary"
                android:textSize="20sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/textViewMonth"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="MAY"
                android:textAllCaps="true"
                android:textColor="@color/colorSecondary"
                android:textSize="11sp" />
        </LinearLayout>

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="12dp"
            android:layout_marginEnd="16dp"
            android:layout_marginTop="12dp"
            android:layout_marginBottom="12dp"
            android:orientation="vertical"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toEndOf="@id/dateBadge"
            app:layout_constraintTop_toTopOf="parent">

            <TextView
                android:id="@+id/textViewPatientName"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Patient Name"
                android:textColor="@color/colorOnSurface"
                android:textSize="16sp"
                android:textStyle="bold" />

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="4dp"
                android:gravity="center_vertical"
                android:orientation="horizontal">

                <ImageView
                    android:layout_width="14dp"
                    android:layout_height="14dp"
                    app:srcCompat="@drawable/ic_access_time"
                    app:tint="@color/colorSecondary" />

                <TextView
                    android:id="@+id/textViewDateTime"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginStart="4dp"
                    android:text="Date - Time"
                    android:textColor="@color/colorSecondary"
                    android:textSize="14sp" />
            </LinearLayout>

            <TextView
                android:id="@+id/textViewDescription"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="2dp"
                android:text="Description"
                android:textColor="#9E9E9E"
                android:textSize="14sp"
                android:textStyle="italic" />
        </LinearLayout>

    </androidx.constraintlayout.widget.ConstraintLayout>
</com.google.android.material.card.MaterialCardView>
```

- [ ] **Step 2: Replace AppointmentAdapter.java**

Adds `textViewDay` and `textViewMonth` to the ViewHolder and parses the `"d/M/yyyy"` date string to populate the badge.

```java
package com.example.medicalcabinetmanagementapplication;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class AppointmentAdapter extends RecyclerView.Adapter<AppointmentAdapter.AppointmentViewHolder> {

    private List<Appointment> appointmentList;
    private static final String[] MONTHS = {
        "JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"
    };

    public AppointmentAdapter(List<Appointment> appointmentList) {
        this.appointmentList = appointmentList;
    }

    @NonNull
    @Override
    public AppointmentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_appointment, parent, false);
        return new AppointmentViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AppointmentViewHolder holder, int position) {
        Appointment appointment = appointmentList.get(position);
        holder.textViewPatientName.setText(appointment.getPatientName());
        holder.textViewDateTime.setText(appointment.getDate() + "  " + appointment.getTime());
        holder.textViewDescription.setText(appointment.getDescription());

        String[] parts = appointment.getDate().split("/");
        if (parts.length >= 2) {
            holder.textViewDay.setText(parts[0]);
            try {
                int monthIdx = Integer.parseInt(parts[1]) - 1;
                holder.textViewMonth.setText((monthIdx >= 0 && monthIdx < 12) ? MONTHS[monthIdx] : "");
            } catch (NumberFormatException e) {
                holder.textViewMonth.setText("");
            }
        }
    }

    @Override
    public int getItemCount() {
        return appointmentList.size();
    }

    public void updateData(List<Appointment> newAppointments) {
        this.appointmentList = newAppointments;
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

- [ ] **Step 3: Build and verify**

**Build > Make Project** — zero errors. Run on emulator with at least one appointment: each row shows a primary-blue left border, date badge (day + month abbreviation), patient name, clock icon + date/time, italic description.

- [ ] **Step 4: Commit**

```bash
git add app/src/main/res/layout/item_appointment.xml \
        app/src/main/java/com/example/medicalcabinetmanagementapplication/AppointmentAdapter.java
git commit -m "feat: redesign appointment card with date badge and left border strip"
```

---

## Task 6: Add Patient Screen

**Files:**
- Modify: `app/src/main/res/layout/activity_add_patient.xml`
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/AddPatientActivity.java`

All existing `editTextName`, `editTextPhone`, `editTextEmail`, and `buttonSave` IDs are preserved — `savePatient()` logic is unchanged.

- [ ] **Step 1: Replace activity_add_patient.xml**

Root changes from `ConstraintLayout` to a vertical `LinearLayout` to accommodate the toolbar + banner at the top.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/colorBackground"
    android:orientation="vertical">

    <com.google.android.material.appbar.MaterialToolbar
        android:id="@+id/toolbar"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        android:background="@color/colorPrimary"
        android:elevation="4dp"
        app:navigationIconTint="@android:color/white"
        app:title="Add Patient"
        app:titleTextColor="@android:color/white" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="80dp"
        android:background="@color/colorPrimaryContainer"
        android:gravity="center"
        android:orientation="vertical">

        <ImageView
            android:layout_width="48dp"
            android:layout_height="48dp"
            app:srcCompat="@drawable/ic_person"
            app:tint="@color/colorPrimary" />
    </LinearLayout>

    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">

            <com.google.android.material.textfield.TextInputLayout
                android:id="@+id/layoutName"
                style="@style/Widget.Material3.TextInputLayout.OutlinedBox"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Full Name"
                app:startIconDrawable="@drawable/ic_person">

                <com.google.android.material.textfield.TextInputEditText
                    android:id="@+id/editTextName"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
            </com.google.android.material.textfield.TextInputLayout>

            <com.google.android.material.textfield.TextInputLayout
                android:id="@+id/layoutPhone"
                style="@style/Widget.Material3.TextInputLayout.OutlinedBox"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="12dp"
                android:hint="Phone Number"
                app:startIconDrawable="@drawable/ic_phone">

                <com.google.android.material.textfield.TextInputEditText
                    android:id="@+id/editTextPhone"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:inputType="phone" />
            </com.google.android.material.textfield.TextInputLayout>

            <com.google.android.material.textfield.TextInputLayout
                android:id="@+id/layoutEmail"
                style="@style/Widget.Material3.TextInputLayout.OutlinedBox"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="12dp"
                android:hint="Email Address"
                app:startIconDrawable="@drawable/ic_email">

                <com.google.android.material.textfield.TextInputEditText
                    android:id="@+id/editTextEmail"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:inputType="textEmailAddress" />
            </com.google.android.material.textfield.TextInputLayout>

            <com.google.android.material.button.MaterialButton
                android:id="@+id/buttonSave"
                android:layout_width="match_parent"
                android:layout_height="48dp"
                android:layout_marginTop="24dp"
                android:text="Save Patient"
                android:textStyle="bold"
                app:backgroundTint="@color/colorPrimary"
                app:cornerRadius="8dp" />

        </LinearLayout>
    </androidx.core.widget.NestedScrollView>

</LinearLayout>
```

- [ ] **Step 2: Update AddPatientActivity.java**

Add toolbar setup and back-navigation. All existing field bindings and `savePatient()` logic are preserved.

```java
package com.example.medicalcabinetmanagementapplication;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.textfield.TextInputEditText;

public class AddPatientActivity extends AppCompatActivity {

    private TextInputEditText editTextName, editTextPhone, editTextEmail;
    private DatabaseHelper dbHelper;

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

        findViewById(R.id.buttonSave).setOnClickListener(v -> savePatient());
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
        String name = editTextName.getText().toString().trim();
        String phone = editTextPhone.getText().toString().trim();
        String email = editTextEmail.getText().toString().trim();

        if (name.isEmpty() || phone.isEmpty()) {
            Toast.makeText(this, "Please fill in name and phone", Toast.LENGTH_SHORT).show();
            return;
        }

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
```

- [ ] **Step 3: Build and verify**

**Build > Make Project** — zero errors. Run on emulator: tap the FAB on the Patients tab. Expect a blue toolbar with a back arrow, a light-blue banner with a person icon, then three outlined fields (name, phone, email) each with a leading icon.

- [ ] **Step 4: Commit**

```bash
git add app/src/main/res/layout/activity_add_patient.xml \
        app/src/main/java/com/example/medicalcabinetmanagementapplication/AddPatientActivity.java
git commit -m "feat: redesign Add Patient screen with toolbar, banner, and outlined inputs"
```

---

## Task 7: Add Appointment Screen

**Files:**
- Modify: `app/src/main/res/layout/activity_add_appointment.xml`
- Modify: `app/src/main/java/com/example/medicalcabinetmanagementapplication/AddAppointmentActivity.java`

The `Spinner` + `TextView` label are replaced by a `MaterialAutoCompleteTextView` inside an outlined `TextInputLayout`. The selected patient index is tracked via `OnItemClickListener`. `buttonDate` and `buttonTime` IDs are preserved so the existing `DatePickerDialog`/`TimePickerDialog` logic still works.

- [ ] **Step 1: Replace activity_add_appointment.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/colorBackground"
    android:orientation="vertical">

    <com.google.android.material.appbar.MaterialToolbar
        android:id="@+id/toolbar"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        android:background="@color/colorPrimary"
        android:elevation="4dp"
        app:navigationIconTint="@android:color/white"
        app:title="Add Appointment"
        app:titleTextColor="@android:color/white" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="80dp"
        android:background="@color/colorPrimaryContainer"
        android:gravity="center"
        android:orientation="vertical">

        <ImageView
            android:layout_width="48dp"
            android:layout_height="48dp"
            app:srcCompat="@drawable/ic_event"
            app:tint="@color/colorPrimary" />
    </LinearLayout>

    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">

            <com.google.android.material.textfield.TextInputLayout
                android:id="@+id/layoutPatient"
                style="@style/Widget.Material3.TextInputLayout.OutlinedBox.ExposedDropdownMenu"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Select Patient"
                app:startIconDrawable="@drawable/ic_person">

                <com.google.android.material.textfield.MaterialAutoCompleteTextView
                    android:id="@+id/autoCompletePatient"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:inputType="none" />
            </com.google.android.material.textfield.TextInputLayout>

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="12dp"
                android:orientation="horizontal">

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/buttonDate"
                    style="@style/Widget.Material3.Button.OutlinedButton"
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:text="Select Date"
                    app:icon="@drawable/ic_event" />

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/buttonTime"
                    style="@style/Widget.Material3.Button.OutlinedButton"
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:layout_marginStart="8dp"
                    android:text="Select Time"
                    app:icon="@drawable/ic_access_time" />
            </LinearLayout>

            <com.google.android.material.textfield.TextInputLayout
                android:id="@+id/layoutDescription"
                style="@style/Widget.Material3.TextInputLayout.OutlinedBox"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="12dp"
                android:hint="Description"
                app:startIconDrawable="@drawable/ic_notes">

                <com.google.android.material.textfield.TextInputEditText
                    android:id="@+id/editTextDescription"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
            </com.google.android.material.textfield.TextInputLayout>

            <com.google.android.material.button.MaterialButton
                android:id="@+id/buttonSaveAppointment"
                android:layout_width="match_parent"
                android:layout_height="48dp"
                android:layout_marginTop="24dp"
                android:text="Save Appointment"
                android:textStyle="bold"
                app:backgroundTint="@color/colorPrimary"
                app:cornerRadius="8dp" />

        </LinearLayout>
    </androidx.core.widget.NestedScrollView>

</LinearLayout>
```

- [ ] **Step 2: Replace AddAppointmentActivity.java**

`Spinner` is replaced by `MaterialAutoCompleteTextView`. The selected patient index is tracked in `selectedPatientIndex`. `showDatePicker()`, `showTimePicker()`, and the save logic are unchanged except that `spinnerPatients.getSelectedItemPosition()` becomes `selectedPatientIndex`.

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

    private MaterialAutoCompleteTextView autoCompletePatient;
    private MaterialButton buttonDate, buttonTime;
    private TextInputEditText editTextDescription;
    private DatabaseHelper dbHelper;
    private List<Patient> patientList;
    private String selectedDate = "", selectedTime = "";
    private int selectedPatientIndex = 0;

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
        findViewById(R.id.buttonSaveAppointment).setOnClickListener(v -> saveAppointment());
        editTextDescription = findViewById(R.id.editTextDescription);

        setupPatientDropdown();

        buttonDate.setOnClickListener(v -> showDatePicker());
        buttonTime.setOnClickListener(v -> showTimePicker());
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
        if (!names.isEmpty()) autoCompletePatient.setText(names.get(0), false);
        autoCompletePatient.setOnItemClickListener((parent, view, position, id) -> selectedPatientIndex = position);
    }

    private void showDatePicker() {
        Calendar c = Calendar.getInstance();
        new DatePickerDialog(this, (view, year, month, dayOfMonth) -> {
            selectedDate = dayOfMonth + "/" + (month + 1) + "/" + year;
            buttonDate.setText(selectedDate);
        }, c.get(Calendar.YEAR), c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH)).show();
    }

    private void showTimePicker() {
        Calendar c = Calendar.getInstance();
        new TimePickerDialog(this, (view, hourOfDay, minute) -> {
            selectedTime = String.format("%02d:%02d", hourOfDay, minute);
            buttonTime.setText(selectedTime);
        }, c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE), true).show();
    }

    private void saveAppointment() {
        if (patientList.isEmpty()) {
            Toast.makeText(this, "Please add a patient first", Toast.LENGTH_SHORT).show();
            return;
        }
        if (selectedDate.isEmpty() || selectedTime.isEmpty()) {
            Toast.makeText(this, "Please select date and time", Toast.LENGTH_SHORT).show();
            return;
        }

        int patientId = patientList.get(selectedPatientIndex).getId();
        String desc = editTextDescription.getText().toString();

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
```

- [ ] **Step 3: Build and verify**

**Build > Make Project** — zero errors. Run on emulator: tap the FAB on the Appointments tab. Expect a blue toolbar with back arrow, light-blue calendar banner, an outlined dropdown with patient names, outlined date/time buttons with icons, outlined description field, and a blue save button. Saving an appointment and returning to the list should show it with the date badge populated correctly.

- [ ] **Step 4: Commit**

```bash
git add app/src/main/res/layout/activity_add_appointment.xml \
        app/src/main/java/com/example/medicalcabinetmanagementapplication/AddAppointmentActivity.java
git commit -m "feat: redesign Add Appointment screen with toolbar, banner, autocomplete dropdown, and outlined inputs"
```
