package com.example.medicalcabinetmanagementapplication;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.GridLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.textfield.MaterialAutoCompleteTextView;
import com.google.android.material.textfield.TextInputEditText;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
            if (!selectedTime.isEmpty()) buttonTime.setText(formatTimeForButton(selectedTime));
            editTextDescription.setText(existing.getDescription());
        } else {
            toolbar.setTitle(R.string.title_add_appointment);
            saveButton.setText(R.string.action_save);
            if (preselectPatientId > 0) {
                preselectPatientById(preselectPatientId);
            }
        }

        buttonDate.setOnClickListener(v -> showDatePicker());
        buttonTime.setOnClickListener(v -> showSlotPicker());
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

    /** Time button label: shows the time, suffixing "(off-grid)" when the time doesn't sit on a slot. */
    private String formatTimeForButton(String time) {
        if (time == null || time.isEmpty()) return getString(R.string.action_save); // unused, never empty here
        if (WorkingHours.isOnGrid(time)) return time;
        return time + " " + getString(R.string.slot_offgrid_suffix);
    }

    private void showSlotPicker() {
        // Compute occupied slot indices for the chosen date, excluding the appointment being edited.
        Set<Integer> occupied = new HashSet<>();
        if (!selectedDate.isEmpty()) {
            List<Appointment> sameDay = dbHelper.getAppointmentsForDate(selectedDate);
            for (Appointment a : sameDay) {
                if (editId > 0 && a.getId() == editId) continue;
                int idx = WorkingHours.nearestSlotIndex(a.getTime());
                if (idx >= 0) occupied.add(idx);
            }
        }

        View content = LayoutInflater.from(this).inflate(R.layout.dialog_slot_picker, null);
        GridLayout grid = content.findViewById(R.id.slotGrid);

        List<String> slots = WorkingHours.slots();
        int currentIdx = WorkingHours.nearestSlotIndex(selectedTime);

        AlertDialog dialog = new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.slot_picker_title)
                .setView(content)
                .setNegativeButton(R.string.action_cancel, null)
                .create();

        int spacing = (int) (getResources().getDisplayMetrics().density * 6);
        for (int i = 0; i < slots.size(); i++) {
            final int slotIdx = i;
            final String slotText = slots.get(i);
            MaterialButton btn = new MaterialButton(this,
                    null,
                    com.google.android.material.R.attr.materialButtonOutlinedStyle);
            btn.setText(slotText);
            btn.setAllCaps(false);
            btn.setSingleLine(true);
            btn.setInsetTop(0);
            btn.setInsetBottom(0);
            btn.setMinWidth(0);
            btn.setMinimumWidth(0);
            btn.setMinHeight(0);
            btn.setMinimumHeight(0);
            int padH = (int) (getResources().getDisplayMetrics().density * 4);
            int padV = (int) (getResources().getDisplayMetrics().density * 10);
            btn.setPadding(padH, padV, padH, padV);
            btn.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 14);

            boolean booked = occupied.contains(slotIdx);
            boolean isCurrent = slotIdx == currentIdx;

            if (booked) {
                btn.setEnabled(false);
                btn.setAlpha(0.4f);
            } else if (isCurrent) {
                // Show the user's existing slot as filled instead of outlined
                btn.setBackgroundTintList(getColorStateList(R.color.colorPrimary));
                btn.setTextColor(0xFFFFFFFF);
            }

            btn.setOnClickListener(v -> {
                selectedTime = slotText;
                buttonTime.setText(slotText);
                dialog.dismiss();
            });

            GridLayout.LayoutParams lp = new GridLayout.LayoutParams();
            lp.width = 0;
            lp.height = GridLayout.LayoutParams.WRAP_CONTENT;
            lp.columnSpec = GridLayout.spec(i % 4, 1, 1f);
            lp.rowSpec = GridLayout.spec(i / 4);
            lp.setMargins(spacing, spacing, spacing, spacing);
            grid.addView(btn, lp);
        }

        dialog.show();
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
