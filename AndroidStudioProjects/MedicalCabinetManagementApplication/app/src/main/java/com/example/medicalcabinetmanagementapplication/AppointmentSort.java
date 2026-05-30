package com.example.medicalcabinetmanagementapplication;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/** Sorts appointments chronologically. Storage format is d/M/yyyy and HH:mm. */
final class AppointmentSort {

    private AppointmentSort() {}

    static void sortByDateTimeAsc(List<Appointment> list) {
        Collections.sort(list, new Comparator<Appointment>() {
            private final SimpleDateFormat fmt = new SimpleDateFormat("d/M/yyyy HH:mm", Locale.US);

            @Override
            public int compare(Appointment a, Appointment b) {
                long ta = parse(a.getDate(), a.getTime());
                long tb = parse(b.getDate(), b.getTime());
                return Long.compare(ta, tb);
            }

            private long parse(String date, String time) {
                if (date == null || date.isEmpty()) return Long.MAX_VALUE;
                String t = (time == null || time.isEmpty()) ? "00:00" : time;
                try {
                    Date d = fmt.parse(date + " " + t);
                    return d == null ? Long.MAX_VALUE : d.getTime();
                } catch (ParseException e) {
                    return Long.MAX_VALUE;
                }
            }
        });
    }
}