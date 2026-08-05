package com.jmin.myapp.repository;

import com.jmin.myapp.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByBoardNoOrderByNoAsc(Long boardNo);
}
