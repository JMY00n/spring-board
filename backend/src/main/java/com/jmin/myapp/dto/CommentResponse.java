package com.jmin.myapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
// 댓글 목록 응답
public class CommentResponse {
    private Long no;
    private String content;
    private String writer;
    private String writerId;
    private LocalDateTime createdAt;
}
