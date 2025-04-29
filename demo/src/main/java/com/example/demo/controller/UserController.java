
package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/findUser")
    public Optional<User> findUser(@RequestParam String email) {
        return userService.findUserByEmail(email);
    }

    @DeleteMapping("/deleteUser/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUserById(id);
    }
}
