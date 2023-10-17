package com.Romeo.Taskapp.repositories;

import com.Romeo.Taskapp.models.Logs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogsRepository extends JpaRepository <Logs,Long> {
}
