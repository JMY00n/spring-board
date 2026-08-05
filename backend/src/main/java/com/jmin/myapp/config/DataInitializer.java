package com.jmin.myapp.config;

import com.jmin.myapp.entity.Board;
import com.jmin.myapp.repository.BoardRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    private final BoardRepository boardRepository;

    public DataInitializer(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    @Override
    public void run(String... args) {
        if (boardRepository.count() > 0) {
            return;
        }

        for (int i = 1; i <= 100; i++) {
            Board board = new Board();

            board.setTitle("테스트 게시글 " + i);
            board.setContent("테스트 내용 " + i);
            board.setWriter("admin");
            board.setCreatedAt(LocalDateTime.now());
            board.setViewCount(0L);

            boardRepository.save(board);
        }
    }
}
