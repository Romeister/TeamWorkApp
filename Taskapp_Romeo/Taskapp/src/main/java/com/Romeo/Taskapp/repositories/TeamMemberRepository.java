package com.Romeo.Taskapp.repositories;

import com.Romeo.Taskapp.models.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    TeamMember findByUsernameAndPassword(String username, String password);
}