package com.jmin.myapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String id;
    private String password;
    private String email;
}