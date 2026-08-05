package com.jmin.myapp.controller;

import com.jmin.myapp.dto.CommentResponse;
import com.jmin.myapp.dto.CommentWriteRequest;
import com.jmin.myapp.entity.Member;
import com.jmin.myapp.service.CommentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/{boardNo}/comments")
    public List<CommentResponse> commentList( @PathVariable Long boardNo ) {
        return commentService.commentList(boardNo);
    }

    @PostMapping("/{boardNo}/comments")
    public ResponseEntity<?> write(
            @PathVariable Long boardNo,
            @RequestBody CommentWriteRequest request,
            HttpSession session
            ) {
        Member member = (Member) session.getAttribute("loginMember");

        if (member == null) {
            return ResponseEntity.status(401).body("로그인이 필요한 서비스입니다.");
        }

        commentService.write(boardNo, request, member);

        return ResponseEntity.ok().build();
    }


}
