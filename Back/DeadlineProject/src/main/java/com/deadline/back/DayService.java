package com.deadline.back;

import com.deadline.model.DayDto;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Service
public class DayService {

    public Integer calculateRequiredHours(Integer busyHours, Integer remainingHours) {
        Integer requiredHours;

        if (busyHours > 11) {
            requiredHours = 0;
        } else if (busyHours <= 11 && busyHours >= 1) {
            requiredHours = 24 - busyHours - 8 - 4;
        } else {
            requiredHours = 12;
        }

        return Math.min(requiredHours, remainingHours);
    }

}
