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
