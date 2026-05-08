package com.example.medicalcabinetmanagementapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

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
