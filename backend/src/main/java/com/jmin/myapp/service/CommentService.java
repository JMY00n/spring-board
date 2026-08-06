package com.jmin.myapp.service;

import com.jmin.myapp.dto.CommentResponse;
import com.jmin.myapp.dto.CommentUpdateRequest;
import com.jmin.myapp.dto.CommentWriteRequest;
import com.jmin.myapp.entity.Comment;
import com.jmin.myapp.entity.Member;
import com.jmin.myapp.repository.CommentRepository;
import com.jmin.myapp.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class CommentService {
    private final BoardService boardService;
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    public void write(Long boardNo, CommentWriteRequest request, Member member) {
        // 어떤 게시글인지 찾고.
        // 존재하지 않는 게시글에 댓글을 달지 못하기 위함.
        boardService.findBoard(boardNo);

        Comment comment = new Comment();

        comment.setBoardNo(boardNo);
        comment.setWriter(member.getId());
        comment.setContent(request.getContent());
        comment.setCreatedAt(LocalDateTime.now());

        commentRepository.save(comment);

    }

    public List<CommentResponse> commentList(Long boardNo) {
        // 레포지토리에서 boardNo으로 같은 boardNo을 가지고 있는 모든 댓글을 찾아서 comments로 반환
        List<Comment> comments = commentRepository.findByBoardNoOrderByNoDesc(boardNo);
        List<CommentResponse> response = new ArrayList<>();

        for (Comment comment : comments) {
            Member member = memberRepository.findById(comment.getWriter()).orElseThrow();
            CommentResponse dto = new CommentResponse();

            dto.setNo(comment.getNo());
            dto.setContent(comment.getContent());
            dto.setWriter(member.getName());
            dto.setWriterId(member.getId());
            dto.setCreatedAt(comment.getCreatedAt());

            response.add(dto);
        }

        return response;
    }

    public void delete(Long commentNo, Member member) {
        Comment comment = commentRepository.findById(commentNo).orElseThrow();

        if (!comment.getWriter().equals(member.getId())) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public void update(Long commentNo, CommentUpdateRequest request, Member member) throws AccessDeniedException {
        Comment comment = commentRepository.findById(commentNo)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 없습니다."));

        if (!comment.getWriter().equals(member.getId())) {
            throw new AccessDeniedException("작성자만 수정할 수 있습니다.");
        }

        comment.setContent(request.getContent());
    }
}
