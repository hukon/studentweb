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
        editTextDescription = findViewById(R.id.editTextDescription);

        setupPatientDropdown();

        buttonDate.setOnClickListener(v -> showDatePicker());
        buttonTime.setOnClickListener(v -> showTimePicker());
        findViewById(R.id.buttonSaveAppointment).setOnClickListener(v -> saveAppointment());
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
