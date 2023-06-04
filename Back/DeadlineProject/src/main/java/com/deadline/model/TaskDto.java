package com.deadline.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
    private String taskName;
    private Integer hoursNeeded;
    private List<DayDto> days;
}
