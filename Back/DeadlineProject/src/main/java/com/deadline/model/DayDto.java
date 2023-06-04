package com.deadline.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DayDto {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private Integer busyHours;
    private Integer requiredHours;


}
