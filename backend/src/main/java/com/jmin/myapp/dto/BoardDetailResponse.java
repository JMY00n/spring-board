package com.jmin.myapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BoardDetailResponse {
    private Long no;
    private String title;
    private String content;
    private String writer;
    private String writerId;
    private LocalDateTime createdAt;
    private Long viewCount;

}
