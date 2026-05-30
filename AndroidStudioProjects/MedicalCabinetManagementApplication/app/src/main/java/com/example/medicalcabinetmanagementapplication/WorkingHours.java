package com.example.medicalcabinetmanagementapplication;

import java.util.ArrayList;
import java.util.List;

/**
 * Clinic working hours and 20-minute slot definitions.
 * 08:00 to 16:00, 20-minute slots: 08:00, 08:20, ... 15:40 (24 slots total).
 * Last slot start is 15:40 so the appointment ends at 16:00.
 */
final class WorkingHours {

    static final int SLOT_MINUTES = 20;
    static final int START_HOUR = 8;
    static final int END_HOUR = 16;
    static final int SLOTS_PER_HOUR = 60 / SLOT_MINUTES; // 3
    static final int SLOT_COUNT = (END_HOUR - START_HOUR) * SLOTS_PER_HOUR; // 24

    private WorkingHours() {}

    /** Returns slot start times as "HH:mm" strings, e.g. ["08:00", "08:20", ..., "15:40"]. */
    static List<String> slots() {
        List<String> out = new ArrayList<>(SLOT_COUNT);
        for (int i = 0; i < SLOT_COUNT; i++) {
            int totalMin = START_HOUR * 60 + i * SLOT_MINUTES;
            out.add(String.format(java.util.Locale.US, "%02d:%02d", totalMin / 60, totalMin % 60));
        }
        return out;
    }

    /**
     * Returns the slot index nearest to the given "HH:mm" time, or -1 if the time
     * is outside working hours or unparseable. "Nearest" rounds half-up.
     */
    static int nearestSlotIndex(String time) {
        if (time == null || time.isEmpty()) return -1;
        String[] parts = time.split(":");
        if (parts.length != 2) return -1;
        int h, m;
        try {
            h = Integer.parseInt(parts[0]);
            m = Integer.parseInt(parts[1]);
        } catch (NumberFormatException e) {
            return -1;
        }
        int totalMin = h * 60 + m;
        int startMin = START_HOUR * 60;
        int endMin = END_HOUR * 60;
        if (totalMin < startMin || totalMin >= endMin) return -1;
        int offset = totalMin - startMin;
        int idx = (offset + SLOT_MINUTES / 2) / SLOT_MINUTES;
        if (idx >= SLOT_COUNT) idx = SLOT_COUNT - 1;
        return idx;
    }

    /** True if the time is already exactly aligned to a slot start. */
    static boolean isOnGrid(String time) {
        if (time == null || time.isEmpty()) return false;
        String[] parts = time.split(":");
        if (parts.length != 2) return false;
        try {
            int h = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);
            if (h < START_HOUR || h >= END_HOUR) return false;
            return m % SLOT_MINUTES == 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
