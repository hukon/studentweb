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
