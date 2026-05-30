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
