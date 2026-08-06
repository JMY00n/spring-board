package com.jmin.myapp.controller;

import com.jmin.myapp.dto.BoardDetailResponse;
import com.jmin.myapp.dto.BoardListResponse;
import com.jmin.myapp.dto.BoardWriteRequest;
import com.jmin.myapp.entity.Board;
import com.jmin.myapp.entity.Member;
import com.jmin.myapp.repository.CommentRepository;
import com.jmin.myapp.service.BoardService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;
    private final CommentRepository commentRepository;

    @PostMapping("/write")
    public ResponseEntity<?> write(@RequestBody BoardWriteRequest request, HttpSession session) {
        Member member = (Member)session.getAttribute("loginMember");

        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        boardService.write(request, member);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public Page<BoardListResponse> list(@RequestParam(defaultValue = "0") int page) {
        return boardService.getBoardList(page);
    }

    @GetMapping("/{no}")
    public BoardDetailResponse detail(@PathVariable Long no) {
        return boardService.detail(no);

    }

    @DeleteMapping("/{no}")
    public ResponseEntity<?> delete(
            @PathVariable Long no,
            HttpSession session
    ) {
        Member member = (Member) session.getAttribute("loginMember");

        if (member == null) {
            return ResponseEntity.badRequest().body("로그인하세요.");
        }

        boardService.delete(no, member);

        return ResponseEntity.ok("삭제 완료");
    }

    @PutMapping("/{no}")
    public ResponseEntity<?> update (
            @PathVariable Long no,
            @RequestBody BoardWriteRequest request,
            HttpSession session
    ) {
        Member member = (Member) session.getAttribute("loginMember");

        boardService.update(no, request, member);

        return ResponseEntity.ok().build();
    }

}
