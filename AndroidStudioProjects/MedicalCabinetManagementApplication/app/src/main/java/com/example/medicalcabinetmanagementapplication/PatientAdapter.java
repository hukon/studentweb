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
