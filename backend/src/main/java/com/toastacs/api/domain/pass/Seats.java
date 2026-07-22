package com.toastacs.api.domain.pass;

import java.util.ArrayList;
import java.util.List;

public final class Seats {

    public static final int ROWS = 2;
    public static final int COLS = 8;
    public static final List<String> ALL = buildAll();

    private Seats() {
    }

    public static boolean isValid(String seat) {
        return seat != null && ALL.contains(seat);
    }

    private static List<String> buildAll() {
        List<String> seats = new ArrayList<>(ROWS * COLS);
        for (int row = 0; row < ROWS; row++) {
            for (int col = 1; col <= COLS; col++) {
                seats.add("%c%d".formatted((char) ('A' + row), col));
            }
        }
        return List.copyOf(seats);
    }
}
