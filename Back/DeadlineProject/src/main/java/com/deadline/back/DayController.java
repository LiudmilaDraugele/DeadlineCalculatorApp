package com.deadline.back;

import com.deadline.model.DayDto;
import com.deadline.model.TaskDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;


@CrossOrigin(origins = {"http://localhost:3000","http://127.0.0.1:3000"})
@RestController
@RequestMapping("deadline/api")
public class DayController {

    private final DayService dayService;

    @Autowired
    public DayController(DayService dayService) {
        this.dayService = dayService;
    }

    @PostMapping("/days")
    public ResponseEntity<List<DayDto>> calculateHours(@RequestBody TaskDto taskInfo) {
        int totalRequiredHours = 0;
        int remainingHours = taskInfo.getHoursNeeded();

        for (DayDto day : taskInfo.getDays()) {
            Integer requiredHours = dayService.calculateRequiredHours(day.getBusyHours(), remainingHours);
            day.setRequiredHours(requiredHours);
            System.out.println(requiredHours);
            totalRequiredHours += requiredHours;
            remainingHours -= requiredHours;
            if (remainingHours <= 0) break;
        }

        if (totalRequiredHours >= taskInfo.getHoursNeeded()) {
            System.out.println("valandu " +taskInfo.getHoursNeeded());
            return ResponseEntity.ok(taskInfo.getDays());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(taskInfo.getDays());
        }
    }

}
