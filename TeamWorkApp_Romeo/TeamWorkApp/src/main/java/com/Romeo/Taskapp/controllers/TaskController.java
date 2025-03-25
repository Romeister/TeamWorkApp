package com.Romeo.Taskapp.controllers;

import com.Romeo.Taskapp.models.Task;
import com.Romeo.Taskapp.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {
    @Autowired
    private TaskRepository taskRepository;

    @PostMapping("/tasks")
    public ResponseEntity<Long> createTask(@RequestBody TaskRequest taskRequest) {
        if (taskRequest.getDescription().trim().isEmpty() || taskRequest.getMembers().isEmpty()) {
            return ResponseEntity.badRequest().body(0L);
        }

        // Create a new Task entity
        Task task = new Task();
        task.setId(taskRequest.getId());
        task.setDescription(taskRequest.getDescription());
        task.setMembers(String.join(",", taskRequest.getMembers()));

        // Save the task to the database
        taskRepository.save(task);

        return ResponseEntity.ok(task.getId());
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAllTasks(){
        List<Task> tasks = taskRepository.findAll();
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<String> updateTask(@PathVariable Long taskId, @RequestBody TaskRequest taskRequest){
        Task task = taskRepository.findById(taskId).orElse(null);

        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found.");
        }

        task.setDescription(taskRequest.getDescription());
        task.setMembers(String.join(",", taskRequest.getMembers()));
        task.setSection(taskRequest.getSection());

        taskRepository.save(task);

        return ResponseEntity.ok("Task updated successfully.");
    }

    //Delete task method

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId) {
        if (taskRepository.existsById(taskId)) {
            taskRepository.deleteById(taskId);
            return ResponseEntity.ok("Task deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
