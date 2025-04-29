package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users") // MongoDB collection name
public class User {
    @Id
    private String id;

    private String name;
    private String picture;
    private String email;
    private String role;
    private String googleCalendarToken;

    // Lawyer-specific fields
    private String specialization;
    private Integer experience;  // Integer because it can be null
    private String location;

    private String createdAt;
}
