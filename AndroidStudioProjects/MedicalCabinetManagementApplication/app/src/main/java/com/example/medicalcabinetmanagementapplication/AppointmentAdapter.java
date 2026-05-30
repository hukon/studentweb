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
