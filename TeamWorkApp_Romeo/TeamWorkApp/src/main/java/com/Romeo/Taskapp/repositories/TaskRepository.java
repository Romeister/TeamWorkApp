package com.Romeo.Taskapp.repositories;

import com.Romeo.Taskapp.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

}
