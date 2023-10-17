package com.Romeo.Taskapp.controllers;

import com.Romeo.Taskapp.models.Logs;
import com.Romeo.Taskapp.repositories.LogsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
public class LogsController {
    @Autowired
    private LogsRepository logsRepository;

    @PostMapping("/logs")
    public ResponseEntity<Long> createLogs(@RequestBody LogsRequest logsRequest) {
        // Validate the task data from the request
        if (logsRequest.getTaskDescription().trim().isEmpty() || logsRequest.getStatusMessage().isEmpty()) {
            return ResponseEntity.badRequest().body(0L);
        }
        // Create a new Task entity
        Logs logs = new Logs();
        logs.setTaskDescription(logsRequest.getTaskDescription());
        logs.setStatusMessage(logsRequest.getStatusMessage());
        logs.setDayOfMonth(LocalDate.now().getDayOfMonth());
        logs.setMonthOfYear(LocalDate.now().getMonthValue());

        // Save the task to the database
        logsRepository.save(logs);

        return ResponseEntity.ok(logs.getId());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<Logs>> getAllTasks(){
        List<Logs> logs = logsRepository.findAll();
        return ResponseEntity.ok(logs);
    }

    @DeleteMapping("/logs/delete-all")
    public ResponseEntity<Void> deleteAllLogs() {
        // Delete all log entries
        logsRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }

}
