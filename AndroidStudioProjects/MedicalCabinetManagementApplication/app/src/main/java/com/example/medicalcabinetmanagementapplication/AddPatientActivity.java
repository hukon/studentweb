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
