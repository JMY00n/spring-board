package com.jmin.myapp.service;

import com.jmin.myapp.dto.BoardDetailResponse;
import com.jmin.myapp.dto.BoardListResponse;
import com.jmin.myapp.dto.BoardWriteRequest;
import com.jmin.myapp.entity.Board;
import com.jmin.myapp.entity.Member;
import com.jmin.myapp.repository.BoardRepository;
import com.jmin.myapp.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public void write(BoardWriteRequest request, Member member) {
        Board board = new Board();

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setWriter(member.getId());
        board.setCreatedAt(LocalDateTime.now());
        board.setViewCount(0L);

        boardRepository.save(board);
    }

    public Page<BoardListResponse> getBoardList(int page) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by("no").descending());

        Page<Board> boards = boardRepository.findAll(pageable);

        List<BoardListResponse> response = new ArrayList<>();

        for (Board board : boards.getContent()) {
            Member member = memberRepository.findById(board.getWriter())
                    .orElseThrow();
            BoardListResponse dto = new BoardListResponse();

            dto.setNo(board.getNo());
            dto.setTitle(board.getTitle());
            dto.setWriter(member.getName());
            dto.setWriterId(member.getId());
            dto.setCreatedAt(board.getCreatedAt());
            dto.setViewCount(board.getViewCount());

            response.add(dto);
        }

        return new PageImpl<>(
                response,
                pageable,
                boards.getTotalElements()
        );
    }

    public Board findBoard(Long no) {
        return boardRepository.findById(no)
                .orElseThrow(() -> new RuntimeException("게시글 없음"));
    }

    public BoardDetailResponse detail(Long no) {
        // 게시글 조회
        Board board = findBoard(no);
        // 작성자 조회
        Member member = memberRepository.findById(board.getWriter())
                        .orElseThrow();
        // 조회수 증가
        board.setViewCount(board.getViewCount() + 1);

        // DB 저장
        boardRepository.save(board);

        // 응답 객체 생성
        BoardDetailResponse response = new BoardDetailResponse();

        response.setNo(board.getNo());
        response.setTitle(board.getTitle());
        response.setContent(board.getContent());
        response.setWriter(member.getName());
        response.setWriterId(member.getId());
        response.setCreatedAt(board.getCreatedAt());
        response.setViewCount(board.getViewCount());

        // 응답 반환
        return response;
    }

    public void delete(Long no, Member member) {
        Board board = findBoard(no);

        // 작성자 검사
        if (!board.getWriter().equals(member.getId())) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        boardRepository.delete(board);
    }

    public void update(Long no,BoardWriteRequest request, Member member) {
        Board board = findBoard(no);

        if (!board.getWriter().equals(member.getId())) {
            throw new RuntimeException("권한이 없습니다.");
        }

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());

        boardRepository.save(board);
    }
}
