package com.jmin.myapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardWriteRequest {
    private String title;
    private String content;
}
