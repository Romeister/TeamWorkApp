package com.Romeo.Taskapp.controllers;

import com.Romeo.Taskapp.models.TeamMember;
import com.Romeo.Taskapp.repositories.TeamMemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class PageSwitchController {
    private final TeamMemberRepository teamMemberRepository;

    public PageSwitchController(TeamMemberRepository teamMemberRepository){
        this.teamMemberRepository = teamMemberRepository;
    }

    @GetMapping("/teamview")
    public String teamViewPage() {
        return "teamview";
    }

    @GetMapping("/taskview")
    public String taskViewPage(){ return "index";}

    @GetMapping("/LOGS")
    public String logsViewPage(){return "logs";}

    @PostMapping("/login")
    @ResponseBody
    public String performLogin(@RequestParam("username") String username,
                               @RequestParam("password") String password) {

        if(username.equals("admin") && password.equals("admin")){
            return "success";
        }

        TeamMember teamMember = teamMemberRepository.findByUsernameAndPassword(username, password);
        if (teamMember != null) {
            return "success";
        } else {
            return "error";
        }
    }

    @GetMapping("/")
    public String loginPage(){ return "login";}
}

