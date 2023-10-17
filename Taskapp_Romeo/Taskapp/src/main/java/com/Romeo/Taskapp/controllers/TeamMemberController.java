package com.Romeo.Taskapp.controllers;

import com.Romeo.Taskapp.models.TeamMember;
import com.Romeo.Taskapp.controllers.TeamMemberRequest;
import com.Romeo.Taskapp.repositories.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TeamMemberController {

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @PostMapping("/teammembers")
    public ResponseEntity<String> createTeamMember(@RequestBody TeamMemberRequest teamMemberRequest) {
        // Validate the team member data from the request
        if (teamMemberRequest.getFullName().trim().isEmpty() || teamMemberRequest.getRole().isEmpty()) {
            return ResponseEntity.badRequest().body("Full name and role cannot be empty.");
        }

        // Create a new TeamMember entity
        TeamMember teamMember = new TeamMember();
        teamMember.setFullName(teamMemberRequest.getFullName());
        teamMember.setIcon(teamMemberRequest.getIcon());
        teamMember.setRole(teamMemberRequest.getRole());
        teamMember.setUsername(teamMemberRequest.getUsername());
        teamMember.setPassword(teamMemberRequest.getPassword());


        // Save the team member to the database
        teamMemberRepository.save(teamMember);

        return ResponseEntity.ok("Team member created successfully.");
    }

    @GetMapping("/teammembers")
    public ResponseEntity<List<TeamMember>> getAllTeamMembers() {
        List<TeamMember> teamMembers = teamMemberRepository.findAll();
        return ResponseEntity.ok(teamMembers);
    }

    @PutMapping("/teammembers/{teamMemberId}")
    public ResponseEntity<String> updateTeamMember(@PathVariable Long teamMemberId, @RequestBody TeamMemberRequest teamMemberRequest) {
        TeamMember teamMember = teamMemberRepository.findById(teamMemberId).orElse(null);

        if (teamMember == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Team member not found.");
        }

        teamMember.setFullName(teamMemberRequest.getFullName());
        teamMember.setIcon(teamMemberRequest.getIcon());
        teamMember.setRole(teamMemberRequest.getRole());
        teamMember.setUsername(teamMemberRequest.getUsername());
        teamMember.setPassword(teamMemberRequest.getPassword());

        teamMemberRepository.save(teamMember);

        return ResponseEntity.ok("Team member updated successfully.");
    }

    @DeleteMapping("/teammembers/{teamMemberId}")
    public ResponseEntity<String> deleteTeamMember(@PathVariable Long teamMemberId) {
        if (teamMemberRepository.existsById(teamMemberId)) {
            teamMemberRepository.deleteById(teamMemberId);
            return ResponseEntity.ok("Team member deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
