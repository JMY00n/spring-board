package com.jmin.myapp.dto;

import lombok.Getter;
import lombok.Setter;

// 댓글 작성 요청
@Getter
@Setter
public class CommentWriteRequest {
    private String content;
}
