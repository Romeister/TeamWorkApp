package com.Romeo.Taskapp.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String members;

    private int section;

    public Task(Long id, String description, String members, int section) {
        this.setId(id);
        this.description = description;
        this.members = members;
        this.section = section;
    }

    public Task() {
        this.id = 0L;
        this.description = "";
        this.members = "";
        this.section = 1;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setMembers(String members) {
        this.members = members;
    }

    public String getDescription() {
        return description;
    }

    public String getMembers() {
        return members;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getSection() {
        return section;
    }

    public void setSection(int section) {
        this.section = section;
    }
}
