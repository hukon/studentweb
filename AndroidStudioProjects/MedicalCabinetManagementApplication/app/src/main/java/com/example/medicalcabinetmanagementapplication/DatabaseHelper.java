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